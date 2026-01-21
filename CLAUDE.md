# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run start      # Dev server with hot reload (localhost:8080)
npm run build      # Production build (outputs to _site/)
```

The start command runs Eleventy in watch mode and PostCSS watcher in parallel.

## Technology Stack

- **Static Site Generator:** Eleventy (11ty) v3
- **Templating:** Nunjucks (.njk files)
- **Styling:** TailwindCSS with forms, typography, and aspect-ratio plugins
- **Client Interactivity:** AlpineJS (via CDN)
- **CMS:** Netlify CMS (Git-backed, admin at `/admin`)
- **Deployment:** Netlify (deploys `_site/` directory)

## Architecture

### Data-Driven Content

Content is stored as YAML frontmatter in markdown files, accessed via Eleventy collections:

- `src/people/people.md` → `collections.people` (team members)
- `src/services/services.md` → `collections.services` (service listings)
- `src/job_postings/job_postings.md` → `collections.job_postings` (careers)
- `src/other_people/other-people.md` → `collections.other_people`

Each collection file contains a YAML array in frontmatter. The `.eleventy.js` config extracts these with custom collection functions that return `[0].data.members` or similar.

### Template Structure

- `src/_includes/default.njk` - Base HTML layout (head, nav, footer)
- Page templates in `src/*.njk` use `layout: default` frontmatter
- Pages define `title`, `description`, `feature_image` in frontmatter
- Use `| markdown` filter to render markdown content in templates

### Styling

TailwindCSS entry point is `src/assets/styles/tailwind.css`. Custom theme colors (primary, secondary, light_gold) and Poppins font are configured in `tailwind.config.js`.

### Client-Side Behavior

AlpineJS handles all interactivity (mobile menu, service card expansion, scroll animations). Look for `x-data`, `x-show`, `@click`, `x-intersect` attributes in templates.

## Key Files

- `.eleventy.js` - Eleventy config, collection definitions, shortcodes
- `tailwind.config.js` - Custom theme configuration
- `admin/config.yml` - Netlify CMS field definitions
- `netlify.toml` - Deployment configuration

## Debugging

Use `{{ someObject | dump }}` filter in Nunjucks templates to inspect data.
