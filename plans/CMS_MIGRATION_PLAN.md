# CMS Migration Plan: Netlify CMS → Sveltia CMS

**Date:** 2026-01-27
**Status:** Draft - Awaiting approval

## Overview

Migrate from deprecated Netlify CMS to Sveltia CMS, a modern drop-in replacement that uses the same configuration format. This will fix production issues and provide better image handling.

**Fallback option:** If Sveltia CMS doesn't meet needs, we can migrate to Decap CMS (official Netlify CMS successor) with similar ease.

## Current Issues

1. CMS only works locally, errors in production
2. Image handling issues (undiagnosed)
3. Using deprecated software (Netlify CMS)

## Root Cause Analysis

**Production Issue:**
- Netlify CMS with GitHub backend requires OAuth authentication
- Missing GitHub OAuth App configuration or Netlify Git Gateway setup
- Local development works because it uses different auth flow

**Image Issues:**
- Need to verify during testing
- Current config saves to `img/` directory which exists
- May be related to media_folder path or public_folder configuration

## Migration Approach: Sveltia CMS

**Why Sveltia:**
- Drop-in replacement - uses existing `admin/config.yml` unchanged
- Actively maintained and modern
- Better performance and image handling
- Simpler GitHub OAuth setup
- Same content structure - no data migration needed

## Implementation Steps

### Phase 1: Local Migration & Testing

1. **Update admin/index.html**
   - Replace Netlify CMS script with Sveltia CMS CDN
   - Update page title if needed
   - Keep GitHub auth provider script

2. **Verify/Update config.yml**
   - Review current configuration
   - Add `public_folder` setting for proper image paths
   - Confirm media_folder configuration

3. **Local Testing**
   - Test CMS loads at `/admin`
   - Verify all three collections appear (People, Services, Job Postings)
   - Test adding/editing/removing people
   - Test image uploads and verify correct paths
   - Confirm changes commit to Git properly

### Phase 2: GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new app with:
     - Homepage URL: `https://buckleysitzman.com`
     - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Note Client ID and generate Client Secret

2. **Configure Netlify**
   - Add environment variables in Netlify dashboard:
     - `GITHUB_OAUTH_CLIENT_ID`
     - `GITHUB_OAUTH_CLIENT_SECRET`
   - Or enable Git Gateway as alternative

3. **Update config.yml for production**
   - Verify backend configuration points to correct repo
   - Ensure branch is set to `main`
   - Enable editorial workflow for PR-based edits (publish_mode: editorial_workflow)

### Phase 3: Production Deployment & Testing

1. **Deploy Changes**
   - Commit admin/index.html changes
   - Push to main branch
   - Verify Netlify build succeeds

2. **Production Testing**
   - Access `/admin` on production site
   - Test GitHub OAuth login flow
   - Verify all collections load
   - Test editing content (use test person or job posting)
   - Verify image upload works
   - Confirm changes create proper Git commits

3. **Access Control Verification**
   - Confirm only GitHub collaborators can access
   - Test with authorized user account

### Phase 4: Documentation & Handoff

1. **Update CLAUDE.md**
   - Change CMS reference from Netlify to Sveltia
   - Document OAuth configuration
   - Add troubleshooting notes

2. **Create user guide** (optional)
   - How to access CMS
   - How to add/edit people
   - How to add/edit services
   - How to add/edit job postings
   - Image upload best practices

## Testing Checklist

### Functionality Tests
- [ ] CMS loads at `/admin` locally
- [ ] CMS loads at `/admin` on production
- [ ] GitHub OAuth authentication works
- [ ] People collection displays correctly
- [ ] Services collection displays correctly
- [ ] Job Postings collection displays correctly
- [ ] Can add new person with image
- [ ] Can edit existing person
- [ ] Can remove person
- [ ] Can add new service
- [ ] Can edit existing service
- [ ] Can add new job posting with image
- [ ] Can edit job posting
- [ ] Images upload successfully
- [ ] Image paths are correct in markdown files
- [ ] Images display on built site
- [ ] Changes create PRs (not direct commits to main)
- [ ] PRs have proper descriptions and file changes
- [ ] Only authorized users can access CMS

### Image Handling Tests
- [ ] Upload image for person - verify path
- [ ] Upload image for job posting - verify path
- [ ] Verify images appear in `img/people/` directory
- [ ] Verify images display on live site
- [ ] Test image deletion/replacement

## Rollback Plan

If Sveltia CMS has issues:

1. **Option A: Revert to Netlify CMS** (temporary)
   - Restore original admin/index.html
   - Keep OAuth configuration
   - Quick rollback, but still using deprecated software

2. **Option B: Switch to Decap CMS** (preferred fallback)
   - Similar to Sveltia, drop-in replacement
   - Update script tag to Decap CDN
   - Use same config.yml
   - Official successor, more conservative choice

## Success Criteria

- [ ] CMS accessible and functional in production
- [ ] Authorized users can add/edit people via GUI
- [ ] Authorized users can add/edit services via GUI
- [ ] Authorized users can add/edit job postings via GUI
- [ ] Image uploads work correctly
- [ ] Changes create PRs for review (editorial workflow)
- [ ] No local development workflow disruption

## Decisions Made

1. **Authentication:** GitHub OAuth (users must be repo collaborators)

2. **Branch workflow:** CMS edits create PRs for review (not direct to `main`)

3. **Media provider exploration:** Defer until after Sveltia is working with Git-based images

## Questions Still Needed

1. **Image optimization:** Should we add image optimization/resizing to the workflow?

2. **User documentation:** Do you want a user guide for non-technical editors?

## Media Management Considerations

**Current approach:** Images stored in Git repository (`img/` directory)
- Pros: Simple, no external dependencies, version controlled
- Cons: Bloats repository size, no automatic optimization, slower uploads

**External media provider options to explore:**

**Cloudinary:**
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Automatic image optimization and transformations
- CDN delivery
- Sveltia CMS has built-in Cloudinary support

**Uploadcare:**
- Free tier: 3 GB storage, 3 GB CDN traffic/month
- Image processing and optimization
- CDN delivery
- Good CMS integration

~~**Netlify Large Media:**~~ (Deprecated - not supported by Sveltia)

**Decision criteria:**
- Monthly image upload/traffic volume
- Budget constraints
- Need for image transformations (resizing, format conversion)
- Importance of CDN delivery vs current hosting
- Repository size concerns

**Action:** Defer media provider research until after Sveltia CMS is working with Git-based images. Then evaluate if external provider would provide meaningful benefits.

## Notes

- Existing `config.yml` should work with minimal changes
- No content migration required - files stay as-is
- Sveltia CMS has better i18n support if needed in future
- Editorial workflow (PR-based) will be enabled from the start

---

## Next Steps

- [x] Review and approve this plan
- [x] Answer key questions (auth method, branch workflow, media provider timing)
- [ ] Begin Phase 1 implementation
