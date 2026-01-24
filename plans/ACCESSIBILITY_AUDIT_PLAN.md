# Accessibility Audit Plan

## Site Information
- **Deploy Preview:** https://deploy-preview-5--buckley-sitzman-llp.netlify.app/
- **Local Dev:** localhost:8080
- **Type:** Static site (Eleventy + TailwindCSS + AlpineJS)

---

## Phase 1: Setup & Automated Testing

### Tool Setup
- [ ] Research required tools (pa11y, axe-core, lighthouse CLI)
- [ ] Create `scripts/setup-a11y-tools.sh` script for Mac that:
  - Checks for Node.js/npm
  - Installs required npm packages (globally or as devDependencies)
  - Verifies installations
  - Provides clear success/failure output
- [ ] Add devDependencies to package.json if appropriate
- [ ] Update README.md with:
  - Section on accessibility testing tools
  - Instructions to run setup script
  - Manual installation steps as fallback
  - Commands to run audits locally

### Run Automated Audits
- [ ] Run pa11y against deploy preview (all pages)
- [ ] Run axe-core CLI against deploy preview
- [ ] Run Lighthouse accessibility audit
- [ ] Collect and parse JSON output from each tool

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

- [ ] Fetch and analyze homepage
- [ ] Fetch and analyze /about page
- [ ] Fetch and analyze /services page
- [ ] Fetch and analyze /careers page (if exists)
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
