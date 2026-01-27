#!/usr/bin/env node

/**
 * Comprehensive Accessibility Audit Script
 *
 * Runs pa11y, axe-core, and lighthouse against all pages in a sitemap,
 * then consolidates, deduplicates, and categorizes the results.
 *
 * Usage: node scripts/audit-accessibility.js <sitemap-url>
 * Example: node scripts/audit-accessibility.js http://localhost:8080/sitemap.xml
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const xml2js = require('xml2js');

const execAsync = promisify(exec);

// Configuration
const REPORTS_DIR = path.join(__dirname, '../a11y_reports');
const CONSOLIDATED_REPORT = path.join(REPORTS_DIR, 'consolidated-report.json');

// Severity mappings for each tool
const SEVERITY_MAP = {
  pa11y: {
    'error': 'critical',
    'warning': 'serious',
    'notice': 'moderate'
  },
  axe: {
    'critical': 'critical',
    'serious': 'serious',
    'moderate': 'moderate',
    'minor': 'minor'
  },
  lighthouse: {
    // Lighthouse uses numeric scores, we'll categorize based on impact
    'high': 'critical',
    'medium': 'serious',
    'low': 'moderate'
  }
};

/**
 * Fetch content from a URL
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Parse sitemap XML and extract URLs
 */
async function parseSitemap(sitemapUrl) {
  console.log(`📥 Fetching sitemap from: ${sitemapUrl}`);

  const xml = await fetchUrl(sitemapUrl);
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);

  const urls = result.urlset.url.map(item => item.loc[0]);

  console.log(`✅ Found ${urls.length} URLs in sitemap\n`);
  return urls;
}

/**
 * Run pa11y against a URL
 */
async function runPa11y(url) {
  try {
    const timestamp = Date.now();
    const relativeReportPath = `a11y_reports/pa11y-${timestamp}.json`;
    const absoluteReportPath = path.join(__dirname, '..', relativeReportPath);
    const pa11yPath = path.join(__dirname, '../node_modules/.bin/pa11y');
    await execAsync(`${pa11yPath} ${url} --reporter json > ${absoluteReportPath}`);
    const content = await fs.readFile(absoluteReportPath, 'utf-8');
    await fs.unlink(absoluteReportPath); // Clean up temp file
    return JSON.parse(content);
  } catch (error) {
    console.error(`  ⚠️  pa11y failed for ${url}:`, error.message);
    return [];
  }
}

/**
 * Run axe-core against a URL
 */
async function runAxe(url) {
  try {
    const timestamp = Date.now();
    const relativeReportPath = `a11y_reports/axe-${timestamp}.json`;
    const absoluteReportPath = path.join(__dirname, '..', relativeReportPath);
    const axePath = path.join(__dirname, '../node_modules/.bin/axe');
    // axe treats --save path as relative to CWD, so use relative path
    await execAsync(`${axePath} ${url} --save ${relativeReportPath}`);
    const content = await fs.readFile(absoluteReportPath, 'utf-8');
    await fs.unlink(absoluteReportPath); // Clean up temp file
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    console.error(`  ⚠️  axe failed for ${url}:`, error.message);
    return { violations: [] };
  }
}

/**
 * Run lighthouse against a URL
 */
async function runLighthouse(url) {
  try {
    const timestamp = Date.now();
    const relativeReportPath = `a11y_reports/lighthouse-${timestamp}.json`;
    const absoluteReportPath = path.join(__dirname, '..', relativeReportPath);
    const lighthousePath = path.join(__dirname, '../node_modules/.bin/lighthouse');
    // lighthouse treats --output-path as relative to CWD, so use relative path
    await execAsync(`${lighthousePath} ${url} --only-categories=accessibility --chrome-flags="--headless" --output json --output-path=${relativeReportPath} --quiet`);
    const content = await fs.readFile(absoluteReportPath, 'utf-8');
    await fs.unlink(absoluteReportPath); // Clean up temp file
    return JSON.parse(content);
  } catch (error) {
    console.error(`  ⚠️  lighthouse failed for ${url}:`, error.message);
    return { categories: { accessibility: { score: null } }, audits: {} };
  }
}

/**
 * Normalize pa11y results to common format
 */
function normalizePa11yResults(results, url) {
  return results.map(issue => ({
    tool: 'pa11y',
    url: url,
    type: issue.code,
    message: issue.message,
    selector: issue.selector,
    context: issue.context,
    severity: SEVERITY_MAP.pa11y[issue.type] || 'moderate',
    wcag: extractWcagFromCode(issue.code),
    raw: issue
  }));
}

/**
 * Normalize axe-core results to common format
 */
function normalizeAxeResults(results, url) {
  const issues = [];

  if (results.violations) {
    results.violations.forEach(violation => {
      violation.nodes.forEach(node => {
        issues.push({
          tool: 'axe',
          url: url,
          type: violation.id,
          message: violation.description,
          selector: node.target.join(', '),
          context: node.html,
          severity: SEVERITY_MAP.axe[violation.impact] || 'moderate',
          wcag: violation.tags.filter(tag => tag.startsWith('wcag')),
          raw: { violation, node }
        });
      });
    });
  }

  return issues;
}

/**
 * Normalize lighthouse results to common format
 */
function normalizeLighthouseResults(results, url) {
  const issues = [];

  if (results.audits) {
    Object.entries(results.audits).forEach(([key, audit]) => {
      if (audit.score !== null && audit.score < 1 && audit.details) {
        // Only include failed audits with details
        const severity = audit.score === 0 ? 'critical' :
                        audit.score < 0.5 ? 'serious' : 'moderate';

        issues.push({
          tool: 'lighthouse',
          url: url,
          type: key,
          message: audit.title,
          selector: audit.details.items ?
                   audit.details.items.map(item => item.node?.selector || '').join(', ') :
                   '',
          context: audit.description,
          severity: severity,
          wcag: [], // Lighthouse doesn't directly map to WCAG
          raw: audit
        });
      }
    });
  }

  return issues;
}

/**
 * Extract WCAG criteria from error code
 */
function extractWcagFromCode(code) {
  const wcagMatch = code.match(/WCAG2(A{1,3})?\.(\d+\.\d+\.\d+)/i);
  return wcagMatch ? [`wcag${wcagMatch[2]}`] : [];
}

/**
 * Generate unique key for deduplication
 */
function getIssueKey(issue) {
  return `${issue.url}::${issue.type}::${issue.selector}::${issue.message}`;
}

/**
 * Deduplicate issues across tools
 */
function deduplicateIssues(allIssues) {
  const issueMap = new Map();

  allIssues.forEach(issue => {
    const key = getIssueKey(issue);

    if (!issueMap.has(key)) {
      issueMap.set(key, {
        ...issue,
        detectedBy: [issue.tool]
      });
    } else {
      const existing = issueMap.get(key);
      if (!existing.detectedBy.includes(issue.tool)) {
        existing.detectedBy.push(issue.tool);
      }
      // Keep the highest severity
      const severities = ['critical', 'serious', 'moderate', 'minor'];
      const currentIndex = severities.indexOf(existing.severity);
      const newIndex = severities.indexOf(issue.severity);
      if (newIndex < currentIndex) {
        existing.severity = issue.severity;
      }
    }
  });

  return Array.from(issueMap.values());
}

/**
 * Categorize issues by severity and type
 */
function categorizeIssues(issues) {
  const categorized = {
    bySeverity: {
      critical: [],
      serious: [],
      moderate: [],
      minor: []
    },
    byType: {},
    byPage: {},
    byWcag: {}
  };

  issues.forEach(issue => {
    // By severity
    categorized.bySeverity[issue.severity].push(issue);

    // By type
    if (!categorized.byType[issue.type]) {
      categorized.byType[issue.type] = [];
    }
    categorized.byType[issue.type].push(issue);

    // By page
    if (!categorized.byPage[issue.url]) {
      categorized.byPage[issue.url] = [];
    }
    categorized.byPage[issue.url].push(issue);

    // By WCAG
    issue.wcag.forEach(wcagCriterion => {
      if (!categorized.byWcag[wcagCriterion]) {
        categorized.byWcag[wcagCriterion] = [];
      }
      categorized.byWcag[wcagCriterion].push(issue);
    });
  });

  return categorized;
}

/**
 * Generate summary statistics
 */
function generateSummary(categorized, urls) {
  const summary = {
    totalPages: urls.length,
    totalIssues: 0,
    issuesBySeverity: {},
    issuesByPage: {},
    mostCommonIssues: []
  };

  // Count by severity
  Object.entries(categorized.bySeverity).forEach(([severity, issues]) => {
    summary.issuesBySeverity[severity] = issues.length;
    summary.totalIssues += issues.length;
  });

  // Count by page
  Object.entries(categorized.byPage).forEach(([url, issues]) => {
    summary.issuesByPage[url] = issues.length;
  });

  // Most common issues
  const typesCounts = Object.entries(categorized.byType)
    .map(([type, issues]) => ({
      type,
      count: issues.length,
      severity: issues[0].severity
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  summary.mostCommonIssues = typesCounts;

  return summary;
}

/**
 * Run all audits for a single URL
 */
async function auditUrl(url, index, total) {
  console.log(`\n[${index + 1}/${total}] Auditing: ${url}`);

  const [pa11yResults, axeResults, lighthouseResults] = await Promise.all([
    runPa11y(url),
    runAxe(url),
    runLighthouse(url)
  ]);

  const normalizedIssues = [
    ...normalizePa11yResults(pa11yResults, url),
    ...normalizeAxeResults(axeResults, url),
    ...normalizeLighthouseResults(lighthouseResults, url)
  ];

  console.log(`  ✅ Found ${normalizedIssues.length} total issues`);

  return {
    url,
    pa11yIssueCount: pa11yResults.length || 0,
    axeIssueCount: axeResults.violations ? axeResults.violations.length : 0,
    lighthouseScore: lighthouseResults.categories?.accessibility?.score || null,
    issues: normalizedIssues
  };
}

/**
 * Main execution
 */
async function main() {
  const sitemapUrl = process.argv[2];

  if (!sitemapUrl) {
    console.error('❌ Error: Please provide a sitemap URL');
    console.error('Usage: node scripts/audit-accessibility.js <sitemap-url>');
    console.error('Example: node scripts/audit-accessibility.js http://localhost:8080/sitemap.xml');
    process.exit(1);
  }

  console.log('🔍 Starting Comprehensive Accessibility Audit\n');
  console.log('=' .repeat(60));

  try {
    // Ensure reports directory exists
    await fs.mkdir(REPORTS_DIR, { recursive: true });

    // Parse sitemap
    const urls = await parseSitemap(sitemapUrl);

    // Run audits for all URLs
    console.log('Running audits (pa11y, axe-core, lighthouse)...\n');
    const results = [];

    for (let i = 0; i < urls.length; i++) {
      const result = await auditUrl(urls[i], i, urls.length);
      results.push(result);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Processing Results...\n');

    // Collect all issues
    const allIssues = results.flatMap(r => r.issues);
    console.log(`  Total raw issues: ${allIssues.length}`);

    // Deduplicate
    const uniqueIssues = deduplicateIssues(allIssues);
    console.log(`  Unique issues after deduplication: ${uniqueIssues.length}`);

    // Categorize
    const categorized = categorizeIssues(uniqueIssues);

    // Generate summary
    const summary = generateSummary(categorized, urls);

    // Build final report
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        sitemapUrl,
        pagesAudited: urls.length,
        tools: ['pa11y', 'axe-core', 'lighthouse']
      },
      summary,
      categorized,
      rawResults: results.map(r => ({
        url: r.url,
        pa11yIssueCount: r.pa11yIssueCount,
        axeIssueCount: r.axeIssueCount,
        lighthouseScore: r.lighthouseScore
      }))
    };

    // Write to disk
    await fs.writeFile(
      CONSOLIDATED_REPORT,
      JSON.stringify(report, null, 2),
      'utf-8'
    );

    console.log('\n✅ Audit Complete!\n');
    console.log('=' .repeat(60));
    console.log('\n📈 Summary:');
    console.log(`  Pages audited: ${summary.totalPages}`);
    console.log(`  Total unique issues: ${summary.totalIssues}`);
    console.log(`  Critical: ${summary.issuesBySeverity.critical || 0}`);
    console.log(`  Serious: ${summary.issuesBySeverity.serious || 0}`);
    console.log(`  Moderate: ${summary.issuesBySeverity.moderate || 0}`);
    console.log(`  Minor: ${summary.issuesBySeverity.minor || 0}`);
    console.log(`\n📄 Report saved to: ${CONSOLIDATED_REPORT}\n`);

  } catch (error) {
    console.error('\n❌ Audit failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
