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
- **CMS:** Sveltia CMS (Git-backed, admin at `/admin`)
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

- `readme.markdown` - Project README (not README.md)
- `.eleventy.js` - Eleventy config, collection definitions, shortcodes
- `tailwind.config.js` - Custom theme configuration
- `admin/config.yml` - Sveltia CMS field definitions
- `admin/index.html` - Sveltia CMS loader
- `netlify.toml` - Deployment configuration

## Content Management System

### Sveltia CMS Configuration

The site uses Sveltia CMS, a modern replacement for Netlify CMS. Access the admin interface at `/admin` (both locally and in production).

**Authentication:**
- Production uses GitHub OAuth (configured in Netlify environment variables)
- Only GitHub repository collaborators can access the CMS
- GitHub OAuth App callback URL: `https://api.netlify.com/auth/done`

**Collection Structure:**
Collections are configured as **file collections** (not folder collections) in `admin/config.yml`. Each collection points to a single file containing an array:
- Services: `src/services/services.md` with `items` array
- Job Postings: `src/job_postings/job_postings.md` with `items` array
- People: `src/people/people.md` with `members` array
- Other People: `src/other_people/other-people.md` with `members` array

**Important Notes:**
- All list fields have `required: false` to allow empty arrays
- File collections prevent Sveltia from deleting files when arrays become empty
- Images are stored in the `img/` directory and committed to Git
- Changes commit directly to the `main` branch (no PR workflow)

### Troubleshooting

**Empty collections:** If a collection becomes empty, the file will be preserved with an empty array (e.g., `items: []`). This is intentional to prevent site crashes.

**Image uploads:** Images should upload to the `img/` directory. Verify the `media_folder` and `public_folder` settings in `admin/config.yml` if issues occur.

## Plans

All project plans and checklists are stored in the `plans/` directory. When working on a planned task, reference the corresponding plan file for context and to track progress.

## Debugging

Use `{{ someObject | dump }}` filter in Nunjucks templates to inspect data.
