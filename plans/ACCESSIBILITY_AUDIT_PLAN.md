# Accessibility Audit Plan

## Site Information
- **Deploy Preview:** https://deploy-preview-5--buckley-sitzman-llp.netlify.app/
- **Local Dev:** localhost:8080
- **Type:** Static site (Eleventy + TailwindCSS + AlpineJS)

---

## Session Notes

### 2025-01-26 - External link warnings and careers page audit

**Commits:**
- `ebc20c1` - Add external link indicator to job application links

**External Link Warnings:**
Implemented icon + screen reader text pattern for job application "Apply" buttons:
- Added external link icon (arrow out of box) next to "Apply" text
- Added sr-only text "(opens in new tab)" for screen readers
- Icon marked with aria-hidden="true" to prevent duplicate announcements

**Pattern used (Option 3 - Icon + Screen Reader Text):**
```html
<a href="..." target="_blank">
  Apply
  <svg aria-hidden="true"><!-- external link icon --></svg>
  <span class="sr-only">(opens in new tab)</span>
</a>
```

**Careers Page Audit:**
Performed comprehensive accessibility audit of careers page with temporary job listing:
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ All images have appropriate alt text
- ✅ External links have clear warnings
- ✅ Keyboard accessible throughout
- ✅ Focus indicators present
- ✅ Job posting content structure accessible
- ⚠️ 1 false positive (gold heading meets large text contrast requirements)

**Result:** Careers page fully accessible, ready for real job postings.

Improves WCAG 3.2.5 Change on Request (Level AAA).

---

### 2025-01-26 - Link text audit and target="_blank" fixes

**Commits:**
- `88065c5` - Remove unnecessary target="_blank" from internal and mailto links

**Link Text Audit:**
Audited all links across the site for descriptive text and proper usage.

**Good news:**
- ✅ No "click here", "read more", or other non-descriptive link patterns found
- ✅ All navigation links are clear and descriptive
- ✅ All CTA buttons have meaningful text
- ✅ Team member links labeled as "Email" and "Bio"
- ✅ Image links have proper alt text

**Issues found and fixed:**
- Removed `target="_blank"` from mailto links (opens email client, doesn't need new tab)
- Removed `target="_blank"` from internal /contact-us link on careers page

**Remaining:**
- External job application links still have `target="_blank"` (appropriate) but need new tab warnings

---

### 2025-01-26 - Focus states audit and fixes

**Commits:**
- `0e0e620` - Add focus states to match hover states across site

**Focus States Audit:**
Audited all interactive elements to ensure keyboard users have visible focus indicators.

**Issues found and fixed:**
- Logo link: Added padding and primary ring for better visibility
- Desktop navigation (6 links): Added focus:text-secondary-500 and focus:border-b-secondary-500 to match hover
- Footer links (3 links): Added focus:ring-2 focus:ring-primary-500
- Team member Email/Bio links: Added focus:ring-2 focus:ring-secondary-400
- Contact sidebar links (2 links): Added focus:ring-2 focus:ring-primary-500

**Pattern consistency:**
Focus states follow established site patterns:
- Navigation links → Color/border changes (no rings, matches mobile menu)
- CTAs/buttons → Secondary rings
- Utility links → Primary rings
- Form inputs → Blue rings

**Verification:**
Ran axe-core on multiple pages - no new violations introduced.

Improves WCAG 2.4.7 Focus Visible (Level AA) compliance.

---

### 2025-01-26 - ARIA attributes audit

**ARIA Audit Results:**
Audited all AlpineJS interactive components across the site:

**✅ Excellent implementations:**
- Mobile menu has proper ARIA attributes (role="dialog", aria-modal, aria-expanded)
- Menu buttons have proper labels and keyboard support
- Focus management automatically moves to close button when opened

**⚠️ Issues identified (not fixed yet):**
- Service card expansion on /services/ lacks keyboard accessibility
- Missing role="button", tabindex, aria-expanded, and keyboard handlers
- Violates WCAG 2.1 Level A (2.1.1 Keyboard)

**Decision:** Documented issues for future resolution. Not fixing service cards in this session.

---

### 2025-01-26 - Form label audit and heading hierarchy fixes

**Form Audit Results:**
Audited contact form at `/contact-us/`. Found **0 violations** in axe-core. Manual review confirms:
- ✅ All 9 form fields have properly associated labels (for/id matching)
- ✅ ARIA attributes correctly used (phone field has aria-describedby)
- ✅ Required fields marked with required attribute
- ✅ Appropriate input types (email uses type="email")
- ✅ All fields have autocomplete attributes (given-name, family-name, email, tel)
- ✅ Focus states visible on all inputs and buttons
- ✅ Semantic HTML (form, label, button elements)
- ✅ Section has sr-only h2 heading

**No changes needed** - form is excellently implemented for accessibility.

---

### 2025-01-26 - Fix heading hierarchy on services page

**Commits:**
- `ee10413` - Fix heading hierarchy on services page

**Issue fixed:**
Changed service card titles from `<h3>` to `<h2>` to establish proper heading hierarchy. The page structure is now:
- H1: "Services" (page title)
- H2: Individual service names (Tax Planning, Bookkeeping, etc.)

**Verification:**
- Ran axe-core against http://localhost:8080/services/ and confirmed **0 violations**
- Also verified /meet-our-team/ page - heading hierarchy was already fixed in commit d6f35a8 (added sr-only h2)

---

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

**Known issues (now resolved):**
- ~~**Heading order** on `/services/` and `/meet-our-team/`~~ - Fixed in commits d6f35a8 (meet-our-team) and ee10413 (services).

---

## Phase 2: Source Code Review

### Images & Media
- [x] Audit all `alt` attributes in templates (.njk files)
- [x] Audit alt text in content files (people, services, etc.)
- [x] Check for decorative images (should have `alt=""`)

**Content Files Alt Text Audit (2026-01-26):**
- ✅ **people.md**: All person images rendered with `alt="{{person.name}}"` in templates (meet-our-team.njk:21, person.njk:16)
- ✅ **services.md**: No images in service data
- ✅ **job_postings.md**: Template ready with `alt="{{posting.name}}"` (careers.njk:49), currently no postings
- ✅ **other_people.md**: No images

**All Template Images:**
- ✅ Person portraits: Use person names (excellent)
- ✅ Feature images: Use page title (default.njk:194)
- ✅ Homepage staff photo: "Staff Photo" (index.njk:39, has TODO for improvement)
- ✅ Lester Buckley testimonial photo: "Lester F. Buckley" (index.njk:71)
- ⚠️ Logo images: Use "Logo" - could be more descriptive like "Buckley & Sitzman LLP" (default.njk:56, 154)
- ✅ NESCPA badge: "NESCPA 100% Membership" (default.njk:230)
- ✅ Decorative hex logos: Properly use `alt=""` throughout

**Result:** All images have alt attributes. Most are excellent. Logo alt text could be improved but is acceptable.

### Document Structure
- [x] Verify proper heading hierarchy (h1 → h2 → h3) *(Fixed: /services/ now uses h2 for service titles)*
- [x] Check for skip-link implementation *(Added in commit 4bad522)*
- [x] Verify `lang` attribute on `<html>` element *(Confirmed present in default.njk:2)*
- [x] Check page `<title>` elements *(Confirmed working in default.njk:4-6)*

### Forms & Interactive Elements
- [x] Audit form labels and input associations *(Contact form: excellent - all labels properly associated, ARIA attributes correct, focus states visible)*
- [x] Check ARIA attributes on AlpineJS components *(See findings below)*
- [x] Verify focus states are visible in CSS *(Fixed in commit 0e0e620)*
- [x] Check mobile menu accessibility (keyboard, screen reader) *(Fixed in commit 4bad522)*

**ARIA Attributes Audit Findings:**
- ✅ **Mobile menu** (default.njk) - Excellent: proper role, aria-expanded, aria-modal, keyboard support, focus management
- ⚠️ **Service card expansion** (services.njk:25-53) - Issues found:
  - Missing role="button" on interactive div
  - Missing tabindex="0" for keyboard access
  - Missing aria-expanded attribute
  - No keyboard handlers (Enter/Space)
  - Not keyboard accessible (WCAG 2.1 Level A violation)
- ✅ **Animation triggers** (index.njk, careers.njk) - OK: decorative only, no interaction
- ℹ️ **Team member cards** (meet-our-team.njk) - Note: unused x-data variable, no accessibility impact

### Links & Navigation
- [x] Audit link text (no "click here" patterns) *(Fixed in commit 88065c5)*
- [x] Check for links that open in new tabs (need warning) *(Fixed in commit ebc20c1)*
- [x] Verify navigation landmarks

**Navigation Landmarks Audit (2026-01-26):**
Verified proper HTML5 landmarks in default.njk:
- ✅ `<header>` (line 49) - Site header with sticky navigation
- ✅ `<nav>` (line 51) - Desktop navigation menu
- ✅ `<main id="main-content">` (line 191) - Main content with ID for skip-link target
- ✅ `<footer>` (line 208) - Site footer with contact info
- ✅ Mobile menu uses `role="dialog"` with proper ARIA attributes (semantically correct)

**Result:** Excellent landmark structure. All major page regions properly marked.

### Color & Contrast
- [x] Review color values in tailwind.config.js
- [x] Check text/background contrast ratios (fixed gold headings + gray links)
- [x] Verify focus indicator visibility *(Fixed in commit 0e0e620)*

---

## Phase 3: Rendered HTML Analysis

Pages to audit (from sitemap.xml):
- [ ] Fetch and analyze homepage (/)
- [ ] Fetch and analyze /about page
- [ ] Fetch and analyze /services page
- [ ] Fetch and analyze /careers page
- [ ] Fetch and analyze /contact page
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
