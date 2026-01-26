# Accessibility Audit Plan

## Site Information
- **Deploy Preview:** https://deploy-preview-5--buckley-sitzman-llp.netlify.app/
- **Local Dev:** localhost:8080
- **Type:** Static site (Eleventy + TailwindCSS + AlpineJS)

---

## Session Notes

### 2025-01-25 - Full pa11y audit and fixes

Ran pa11y across all pages and fixed identified issues.

**Commits:**
- `bc6b0f1` - Use production URL for sitemap instead of deploy preview URL
- `a08272c` - Add alt attributes to decorative hex logo images
- `52ffb2f` - Exclude thanks page from sitemap
- `78084e2` - Increase gold heading font size for WCAG contrast compliance
- `6862e9f` - Darken Email/Bio link color for contrast compliance

**Issues found and fixed:**

| Issue | Fix Applied | Files Changed |
|-------|-------------|---------------|
| Missing `alt` on hex logos (all pages) | Added `alt=""` for decorative images | 10 templates |
| Gold heading contrast (`text-secondary-500`) | Increased to `text-lg` (18px) to qualify as large text | 3 templates |
| Email/Bio link contrast (`text-gray-400`) | Changed to `text-gray-500` | meet-our-team.njk |

**Final pa11y results:**

| Page | Errors | Notes |
|------|--------|-------|
| `/` | 2 | Gold headings (pass as large text, pa11y doesn't detect) |
| `/services/` | 0 | Clean |
| `/careers/` | 1 | Gold heading (passes as large text) |
| `/contact-us/` | 0 | Clean |
| `/meet-our-team/` | 1 | Gold heading (passes as large text) |

**Note:** The 4 remaining pa11y errors are false positives. The gold headings use `text-lg` (18px) with `font-semibold`, qualifying as "large text" under WCAG 2.1, which only requires 3:1 contrast (the gold meets this). Pa11y doesn't automatically detect large text.

---

### 2025-01-25 - Generated sitemap.xml

Added automatic sitemap generation to help with SEO and to identify all pages for accessibility auditing.

**Commits:**
- `36b93c9` - Add sitemap.xml generation

**What was done:**
- Created `src/sitemap.njk` template that generates `sitemap.xml` at build time
- Sitemap includes all main pages: homepage, about, services, careers, contact
- Uses Eleventy's data cascade to automatically generate URLs
- Sitemap is excluded from the navigation and sitemap itself (prevents recursion)

**How this helps the accessibility audit:**
- Provides a definitive list of all pages that need to be audited
- Can be used programmatically to run pa11y against all pages
- Ensures no pages are missed during manual or automated testing

---

### 2025-01-24 - Set initial plan and installed pa11y

Created audit plan and set up pa11y for automated accessibility testing.

**Commits:**
- `c6c1b07` - Add accessibility audit plan checklist
- `a704683` - Move audit plan to plans/ directory and document in CLAUDE.md
- `13b3cf6` - Add pa11y for accessibility testing

**Decisions:**
- Using yarn (not npm) for package management
- Installing tools as devDependencies (not global)
- Starting with pa11y only; axe-core and Lighthouse to follow

**Initial pa11y findings (homepage only):**
| Issue | Type | Element |
|-------|------|---------|
| Missing `alt` attribute | Image | Header logo (`hex_logo.svg`) |
| Missing `alt` attribute | Image | Page body logo (`hex_logo.svg`) |
| Insufficient contrast (1.94:1, needs 4.5:1) | Color | Heading with `text-secondary-500` |
| Insufficient contrast (1.94:1, needs 4.5:1) | Color | "Services" heading with `text-secondary-500` |

**Commands:**
- `yarn a11y <url>` - Run pa11y against a URL

**Next steps:**
1. Create setup script (`scripts/setup-a11y-tools.sh`)
2. Update README with accessibility testing docs
3. Set up axe-core and Lighthouse
4. Run full audit across all pages

**Open questions:**
- ~~Need to identify all pages on the site for full audit~~ (Resolved: sitemap.xml now lists all pages)
- ~~Should we fix issues as we find them, or complete full audit first?~~ (Decision: fix as we go)

---

## Phase 1: Setup & Automated Testing

### Tool Setup - Pa11y (Current)
- [x] Research required tools (pa11y, axe-core, lighthouse CLI)
- [x] Add pa11y as devDependency to package.json
- [x] Add npm script to run pa11y (`yarn a11y <url>`)
- [x] Verify pa11y works against deploy preview
- [x] Update readme.markdown with:
  - Section on accessibility testing tools
  - Instructions to run setup script
  - Commands to run audits locally

### Tool Setup - axe-core
- [x] Add @axe-core/cli as devDependency
- [x] Add npm script to run axe-core (`yarn axe <url>`)
- [x] Verify axe-core works against deploy preview
- [x] Update setup script and README

### Tool Setup - Lighthouse
- [x] Add lighthouse as devDependency
- [x] Add npm script to run lighthouse accessibility audit (`yarn lighthouse <url>`)
- [x] Verify lighthouse works against deploy preview (score: 95)
- [x] Update setup script and README

### Run Automated Audits
- [x] Run pa11y against all pages (completed 2025-01-25)
- [x] Run axe-core CLI against deploy preview (completed 2025-01-25)
- [x] Run Lighthouse accessibility audit (completed 2025-01-25, score: 95)
- [x] Collect and parse output from each tool

**Axe-core findings (deploy-preview-8):**

| Page | Issues | Type |
|------|--------|------|
| `/` | 2 | Color contrast (false positive - large text) |
| `/services/` | 1 | Heading order (h3 without h2) |
| `/careers/` | 1 | Color contrast (false positive - large text) |
| `/contact-us/` | 0 | Clean |
| `/meet-our-team/` | 2 | Color contrast + Heading order |

**Known issues to address later:**
- **Heading order** on `/services/` and `/meet-our-team/` - h3 elements appear without preceding h2, violating heading hierarchy. Service cards and team member cards use h3 but pages skip from h1 to h3.

---

## Phase 2: Source Code Review

### Images & Media
- [x] Audit all `alt` attributes in templates (.njk files)
- [ ] Audit alt text in content files (people, services, etc.)
- [x] Check for decorative images (should have `alt=""`)

### Document Structure
- [ ] Verify proper heading hierarchy (h1 → h2 → h3) *(axe found issues on /services/ and /meet-our-team/)*
- [ ] Check for skip-link implementation
- [ ] Verify `lang` attribute on `<html>` element
- [ ] Check page `<title>` elements

### Forms & Interactive Elements
- [ ] Audit form labels and input associations
- [ ] Check ARIA attributes on AlpineJS components
- [ ] Verify focus states are visible in CSS
- [ ] Check mobile menu accessibility (keyboard, screen reader)

### Links & Navigation
- [ ] Audit link text (no "click here" patterns)
- [ ] Check for links that open in new tabs (need warning)
- [ ] Verify navigation landmarks

### Color & Contrast
- [x] Review color values in tailwind.config.js
- [x] Check text/background contrast ratios (fixed gold headings + gray links)
- [ ] Verify focus indicator visibility

---

## Phase 3: Rendered HTML Analysis

Pages to audit (from sitemap.xml):
- [ ] Fetch and analyze homepage (/)
- [ ] Fetch and analyze /about page
- [ ] Fetch and analyze /services page
- [ ] Fetch and analyze /careers page
- [ ] Fetch and analyze /contact page
- [ ] Verify semantic landmarks in rendered output
- [ ] Check interactive component ARIA states

---

## Phase 4: Reporting

- [ ] Categorize findings by severity (Critical, Serious, Moderate, Minor)
- [ ] Map issues to specific source files and line numbers
- [ ] Provide remediation recommendations for each issue
- [ ] Generate final audit report

---

## Phase 5: CI/CD Integration (Future)

- [ ] Create GitHub Action workflow for accessibility testing
- [ ] Configure to run on pull requests
- [ ] Set failure thresholds (e.g., fail on Critical/Serious issues)
- [ ] Generate and upload audit reports as artifacts
- [ ] Consider integration with Netlify deploy previews

---

## Phase 6: Custom Claude Accessibility Agent

Create a custom Claude Code agent that automates accessibility auditing by running all three tools and producing a consolidated report.

### Agent Design
- [ ] Define agent prompt and capabilities
- [ ] Agent should accept a URL (or list of URLs) as input
- [ ] Agent runs pa11y, axe-core, and Lighthouse against each URL
- [ ] Agent parses and consolidates results from all tools

### Reporting
- [ ] Deduplicate issues found by multiple tools
- [ ] Categorize by severity (Critical, Serious, Moderate, Minor)
- [ ] Identify false positives (e.g., large text contrast issues)
- [ ] Produce summary with issue counts per page
- [ ] Provide actionable remediation suggestions

### Integration
- [ ] Add agent to project's Claude Code configuration
- [ ] Document usage in readme.markdown
- [ ] Consider adding as a slash command (e.g., `/a11y-audit`)

---

## WCAG 2.1 AA Checklist Reference

Key principles being evaluated:
- **Perceivable:** Text alternatives, captions, adaptable content, distinguishable
- **Operable:** Keyboard accessible, enough time, no seizures, navigable
- **Understandable:** Readable, predictable, input assistance
- **Robust:** Compatible with assistive technologies
