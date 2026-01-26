# Accessibility Audit Plan

## Site Information
- **Deploy Preview:** https://deploy-preview-5--buckley-sitzman-llp.netlify.app/
- **Local Dev:** localhost:8080
- **Type:** Static site (Eleventy + TailwindCSS + AlpineJS)

---

## Session Notes

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
- Should we fix issues as we find them, or complete full audit first?

---

## Phase 1: Setup & Automated Testing

### Tool Setup - Pa11y (Current)
- [x] Research required tools (pa11y, axe-core, lighthouse CLI)
- [x] Add pa11y as devDependency to package.json
- [x] Add npm script to run pa11y (`yarn a11y <url>`)
- [x] Verify pa11y works against deploy preview
- [ ] Create `scripts/setup-a11y-tools.sh` script for Mac that:
  - Checks for Node.js/npm
  - Runs npm install
  - Verifies installations
  - Provides clear success/failure output
- [ ] Update README.md with:
  - Section on accessibility testing tools
  - Instructions to run setup script
  - Commands to run audits locally

### Tool Setup - axe-core (Later)
- [ ] Add @axe-core/cli as devDependency
- [ ] Add npm script to run axe-core
- [ ] Verify axe-core works against deploy preview
- [ ] Update setup script and README

### Tool Setup - Lighthouse (Later)
- [ ] Add lighthouse as devDependency
- [ ] Add npm script to run lighthouse accessibility audit
- [ ] Verify lighthouse works against deploy preview
- [ ] Update setup script and README

### Run Automated Audits
- [ ] Run pa11y against deploy preview (all pages)
- [ ] Run axe-core CLI against deploy preview (after setup)
- [ ] Run Lighthouse accessibility audit (after setup)
- [ ] Collect and parse output from each tool

---

## Phase 2: Source Code Review

### Images & Media
- [ ] Audit all `alt` attributes in templates (.njk files)
- [ ] Audit alt text in content files (people, services, etc.)
- [ ] Check for decorative images (should have `alt=""`)

### Document Structure
- [ ] Verify proper heading hierarchy (h1 → h2 → h3)
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
- [ ] Review color values in tailwind.config.js
- [ ] Check text/background contrast ratios
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

## WCAG 2.1 AA Checklist Reference

Key principles being evaluated:
- **Perceivable:** Text alternatives, captions, adaptable content, distinguishable
- **Operable:** Keyboard accessible, enough time, no seizures, navigable
- **Understandable:** Readable, predictable, input assistance
- **Robust:** Compatible with assistive technologies
