# Buckley Sitzman Site

[![Netlify Status](https://api.netlify.com/api/v1/badges/b28dc169-581e-4d55-86f5-cd23acdd6fc0/deploy-status)](https://app.netlify.com/projects/buckley-sitzman-llp/deploys)

## Install and Setup

Run `yarn install` to get all dependencies running. You may also need to do
`asdf install` to install dependencies of yarn.

## Running Locally

`yarn build` will build the site

`yarn start` will start the site and its watchers -- from there, you can open it
up in the browser at `localhost:8080`

## Content Management

Visiting `/admin` will send you to the admin dashboard. As a caveat, this pull
content from the current `main` branch on GitHub, rather than locally. You'll
need to authenticate with your GitHub account.

## Debugging

If you're working with a collection or some other JS object and you need to see
what's up with it, you can do something like this, where `someObject` is valid
JSON (an array, object literal, string, etc.), nested arbitrarily deeply.

```njk
<pre>{{ someObject | dump }}</pre>
```

This makes use of the `dump` function defined in `.eleventy.js`

[Source for this trick](https://justbea.dev/notes/nunjucks-dump/)

## Guidelines and Conventions

We make use of:

+ Eleventy for the site itself
+ Nunjucks for templating
+ TailwindCSS for styles
+ AlpineJS for little bits of JS
+ Our wonderful and delicious brains

## Adding Job Postings

Job postings are stored in `src/job_postings/job_postings.md`. To add a new posting, add an item to the `items` array in the YAML frontmatter.

### Job Posting Example

```yaml
---
name: Job Postings
permalink: false
items:
  - name: Bookkeeper
    body: >-
      **About Us**


      Buckley & Sitzman is a leading provider of professional accounting and
      consulting services. We are a dynamic and growing accounting firm
      dedicated to providing excellent financial services to our diverse
      clientele.


      **Key Responsibilities**


      * Maintain and update financial records for our clients

      * Record day-to-day financial transactions and complete the posting process

      * Reconcile sales taxes, payroll taxes, and bank accounts at the end of each month

      * Process accounts receivable/payable and handle payroll in a timely manner

      * Assist with the preparation of financial statements and reports


      **Qualifications**


      * Bookkeeping and Payroll experience, 3-5 years preferred

      * Solid understanding of basic bookkeeping and accounting principles

      * Hands-on experience with Quickbooks Online and Desktop software

      * High degree of accuracy and attention to detail


      **Benefits**


      * 401(k) matching

      * Health, Vision, and Dental insurance

      * Flexible schedule

      * Paid time off

      * Professional development assistance


      **How to Apply**


      Please send your resume and cover letter to
      [contact@bsncpa.com](mailto:contact@bsncpa.com) with the subject line
      "Bookkeeper Application"
    link: "https://www.indeed.com/job-link-here"
    image: /img/splashes/tax-stock-photo.jpeg
---
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Job title displayed as the card heading |
| `body` | Yes | Markdown-formatted job description (use `>-` for multiline) |
| `link` | No | External application URL (displays "Apply" button if provided) |
| `image` | No | Path to image displayed on the job card (e.g., `/img/splashes/photo.jpg`) |

## Adding Services

Services are stored in `src/services/services.md`. To add a new service, add an item to the `items` array in the YAML frontmatter.

### Service Example

```yaml
---
title: Services
permalink: false
items:
  - title: Tax Planning and Preparation
    summary: Reduce your tax liabilities and maximize cash flow.
    body: >-
      At Buckley & Sitzman, LLP, we guide our clients through a full range of
      tax planning and preparation decisions with strategies that minimize your
      tax liabilities, maximize your cash flow and keep you on track to your
      financial goals.


      Our expertise, experience, analysis and thorough research allow us to
      optimize financial opportunities to be found in existing as well as
      recently altered tax laws.
---
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Service name displayed as the card heading |
| `summary` | Yes | Brief one-line description shown on the collapsed card |
| `body` | Yes | Markdown-formatted full description (use `>-` for multiline) |

## Adding Team Members

Team members are stored in `src/people/people.md`. To add a new team member, add an item to the `members` array in the YAML frontmatter.

**Image requirements:** Headshot photos should be 600x900 pixels at 72 PPI.

### Team Member Example

```yaml
---
title: People
permalink: false
members:
  - permalink: false
    name: Grant H. Buckley, CPA, CFE
    short_name: Grant Buckley
    job_title: Partner
    email_address: gbuckley@bsncpa.com
    image: /img/people/grant_buckley.jpg
    body: >-
      Grant's detail-oriented focus has led to serving clients in a variety of
      accounting capacities including tax planning and research, estate
      planning, audit and assurance, forensic accounting, consulting and
      transactional work.


      Grant joined the firm in 2013 after spending several years with a Big
      Four public accounting firm, becoming a fourth generation accounting
      professional practicing at the firm.


      Outside of the office, Grant loves to spend time with friends and family.
      His wife, Kelsey, is a dentist and together they share two beautiful
      daughters, Libby and Claire.


      **Professional Memberships and Credentials**


      * American Institute of Certified Public Accountants (AICPA)

      * Nebraska Society of Certified Public Accountants (NESCPA)

      * Association of Certified Fraud Examiners (ACFE)

      * Certified Public Accountant

      * Certified Fraud Examiner


      **Education**

      - University of Nebraska-Lincoln, BSBA Accounting (minors in Finance & Sociology), Highest Distinction

      - University of Nebraska-Lincoln, Masters Degree in Professional Accountancy, Highest Distinction


      **Community**

      - Board Member & Treasurer, Community Action Partnership of Lancaster and Saunders Counties

      - The University of Nebraska-Lincoln School of Accountancy Junior Advisory Board
---
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `permalink` | Yes | Always set to `false` |
| `name` | Yes | Full name with credentials (e.g., "Jane Doe, CPA") |
| `short_name` | Yes | Display name without credentials (e.g., "Jane Doe") |
| `job_title` | No | Position title (e.g., "Partner", "Partner Emeritus", or empty string) |
| `email_address` | No | Email address for the team member |
| `image` | Yes | Path to headshot photo (e.g., `/img/people/jane_doe.jpg`) |
| `body` | Yes | Markdown-formatted bio (use `>-` for multiline) |

## Adding Other Professionals

Other professionals (such as interns or additional staff without full bios) are stored in `src/other_people/other-people.md`. These appear in a separate section on the Meet Our Team page.

### Other Professional Example

```yaml
---
title: Other People
permalink: false
members:
  - permalink: false
    name: Joanne Chartraw
  - permalink: false
    name: Joo Sik Kim, CPA
  - permalink: false
    name: Ryan Kramer (Intern)
---
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `permalink` | Yes | Always set to `false` |
| `name` | Yes | Name with optional credentials or role in parentheses |

## Accessibility Testing

This project includes tools for automated accessibility auditing to help ensure WCAG 2.1 AA compliance.

### Setup

Run `yarn install` to install accessibility testing tools along with other dependencies.

### Running Audits

**Pa11y** - HTML CodeSniffer-based testing:

```bash
# Test against deploy preview
yarn a11y https://deploy-preview-5--buckley-sitzman-llp.netlify.app/

# Test against local dev server (start server first with yarn start)
yarn a11y http://localhost:8080

# Test a specific page
yarn a11y http://localhost:8080/services/
```

**Axe-core** - Deque's accessibility engine (uses Chrome headless):

```bash
# Test a URL
yarn axe https://deploy-preview-5--buckley-sitzman-llp.netlify.app/

# Test local dev server
yarn axe http://localhost:8080

# Test multiple pages
yarn axe http://localhost:8080 http://localhost:8080/services/
```

**Lighthouse** - Google's accessibility audit (generates HTML report):

```bash
# Run accessibility audit (generates .report.html file)
yarn lighthouse https://deploy-preview-5--buckley-sitzman-llp.netlify.app/

# Test local dev server
yarn lighthouse http://localhost:8080
```

### Interpreting Results

Pa11y reports issues by WCAG level:
- **Error** - Definite accessibility barrier
- **Warning** - Potential issue that needs manual review
- **Notice** - Best practice suggestion

Common issues and fixes:
- **Missing alt attribute** - Add `alt="description"` for informative images or `alt=""` for decorative images
- **Insufficient contrast** - Check color combinations in `tailwind.config.js`
- **Missing form labels** - Ensure all inputs have associated `<label>` elements

### Comprehensive Audit (All Tools)

Run a complete accessibility audit across all pages in your sitemap:

```bash
# Audit all pages from the sitemap
yarn audit:a11y http://localhost:8080/sitemap.xml

# Or against deploy preview
yarn audit:a11y https://deploy-preview-5--buckley-sitzman-llp.netlify.app/sitemap.xml
```

This automated script will:
1. Parse the sitemap and extract all page URLs
2. Run pa11y, axe-core, and lighthouse against each page
3. Normalize and deduplicate results across all three tools
4. Categorize issues by severity (critical, serious, moderate, minor)
5. Generate a consolidated JSON report at `a11y_reports/consolidated-report.json`

The consolidated report includes:
- Summary statistics (total issues, issues per page, issues per severity)
- Issues organized by severity, type, page, and WCAG criterion
- Detection information (which tools found each issue)
- Most common issues across the site

**Note:** Make sure your dev server is running (`yarn start`) if testing against `localhost:8080`.

### Generating Remediation Plans (Claude Code)

If you're using [Claude Code](https://claude.ai/code), you can generate human-readable remediation plans from audit results:

```bash
# In the Claude Code CLI
/a11y-report
```

This skill will:
1. Check for existing audit results or optionally run a fresh audit
2. Analyze the consolidated report for patterns and priorities
3. Generate a dated markdown remediation plan in `plans/YYYY-MM-DD-ACCESSIBILITY_REMEDIATION.md`
4. Provide actionable recommendations with fix priorities

The remediation plan includes:
- Executive summary with issue counts
- Issues organized by severity (Critical → Minor)
- Affected pages and recommended fixes
- WCAG criteria references
- Analysis of patterns and fix priorities

### Documentation

See `plans/ACCESSIBILITY_AUDIT_PLAN.md` for the full audit checklist and session notes.
