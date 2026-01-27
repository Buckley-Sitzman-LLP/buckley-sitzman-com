---
name: a11y-report
description: Analyze accessibility audit results and create a remediation to-do list
---

# a11y-report

Analyze accessibility audit results and create a remediation to-do list.

## Usage

```
/a11y-report
```

## Instructions

When this skill is invoked, follow these steps:

### 1. Check for audit results

- Check if `a11y_reports/consolidated-report.json` exists and note its timestamp
- Always prompt the user:
  ```
  Before generating the remediation report, would you like to run a fresh accessibility audit?

  Options:
  1. Run the audit now (recommended) - I'll run `yarn audit:a11y http://localhost:8080/sitemap.xml` for you
  2. Proceed with existing results (last audit: [timestamp or "never"])

  Note: Make sure your dev server is running with `yarn start` if you choose option 1.
  ```
- If user chooses option 1, run the audit script using Bash tool and wait for completion before proceeding
- If user chooses option 2 or the file doesn't exist and they decline to run audit, check if the file exists:
  - If it exists, proceed to analysis
  - If it doesn't exist, inform them they must run the audit first

### 2. Analyze the report

Read and parse the consolidated report. Extract:
- Total issue count
- Issues by severity (critical, serious, moderate, minor)
- Issues by page (which pages have the most problems)
- Most common issue types
- Which tools detected each issue

Pay special attention to:
- **False positives**: Color contrast issues for large text (headings) may be false positives if they meet the 3:1 ratio (not the stricter 4.5:1)
- **Real issues**: Structural problems, missing labels, keyboard navigation issues
- **Patterns**: Same issue appearing across multiple pages

### 3. Generate executive summary

Create a markdown-formatted to-do list with the following structure:

```markdown
# Accessibility Remediation Plan

**Generated:** [current date and time]
**Based on audit:** [audit date from metadata]
**Pages audited:** [number]
**Total issues:** [number]

## Summary by Severity

- [ ] **Critical:** [count] issues
- [ ] **Serious:** [count] issues
- [ ] **Moderate:** [count] issues
- [ ] **Minor:** [count] issues

## Issues by Severity

### Critical Issues ([count])

- [ ] **[Issue Type]** - Detected by [tools]
  - **Description:** [clear explanation]
  - **Affected pages:** [list with links]
  - **Fix:** [recommended fix]
  - **WCAG:** [criteria if available]

[Repeat for each unique critical issue]

### Serious Issues ([count])

[Same format as critical]

### Moderate Issues ([count])

[Same format]

### Minor Issues ([count])

[Same format]

## Notes

- Issues marked as potential false positives (e.g., large text contrast) should be noted
- Group similar issues together
- Link to specific files where possible (src/[filename].njk:[line])
```

### 4. Save the report

- Write the executive summary to `plans/YYYY-MM-DD-ACCESSIBILITY_REMEDIATION.md` where YYYY-MM-DD is today's date in ISO 8601 format
- Example: `plans/2026-01-26-ACCESSIBILITY_REMEDIATION.md`
- Use clear markdown formatting with checkboxes for tracking
- Include the audit date and generation date at the top
- Make recommendations actionable and specific

### 5. Prompt for next steps

After saving the report, tell the user where the file was saved (with the actual date-prefixed filename), then ask:

```
✅ Remediation plan saved to plans/[YYYY-MM-DD]-ACCESSIBILITY_REMEDIATION.md

Where would you like to start with remediation?
- Fix critical issues first (recommended if any exist)
- Fix a specific page
- Address a specific type of issue across all pages
- Review potential false positives
```

## Tips

- Don't just list raw data - analyze it for patterns
- Prioritize real accessibility barriers over minor issues
- Group related issues to make fixes more efficient
- Consider whether issues affect all pages or just specific ones
- Note if an issue can be fixed in a template (affects multiple pages) vs individual pages
