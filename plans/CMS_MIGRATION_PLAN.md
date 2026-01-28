# CMS Migration Plan: Netlify CMS → Decap CMS

**Date:** 2026-01-27
**Status:** Phase 1 Complete - Ready for Phase 2
**Current Step:** Pausing before GitHub OAuth setup for production

## Overview

Migrated from deprecated Netlify CMS to Decap CMS, the official successor that supports editorial workflow. This fixes production authentication issues and enables PR-based content editing.

**What happened:** Initially tried Sveltia CMS, but discovered editorial workflow is a planned feature (not yet implemented). Switched to Decap CMS which has full editorial workflow support.

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

## Migration Approach: Decap CMS

**Why Decap CMS:**
- Official Netlify CMS successor with same config format
- Full editorial workflow support (creates PRs for content edits)
- Drop-in replacement - minimal config changes needed
- Actively maintained by the community
- Same content structure - no data migration required

**Why not Sveltia CMS:**
- Editorial workflow is planned but not yet implemented (as of 2026-01-27)
- See: https://sveltiacms.app/en/docs/workflows/editorial
- May revisit in future when feature is available

## Implementation Steps

### Phase 1: Local Migration & Testing ✅ COMPLETE

1. **Update admin/index.html** ✅
   - Replaced Netlify CMS script with Decap CMS CDN
   - Updated comments to reflect Decap usage

2. **Update config.yml** ✅
   - Added `publish_mode: editorial_workflow` for PR-based edits
   - Added `public_folder: "/img/"` for proper image paths
   - Updated comments to reference Decap documentation

3. **Local Testing** ✅
   - CMS loads successfully at `localhost:8080/admin`
   - All collections appear (People, Services, Job Postings)
   - Editorial workflow confirmed working
   - Test edit created PR successfully (not direct commit to main)
   - Workflow board visible with Draft/In Review/Ready columns

### Phase 2: GitHub OAuth Setup ⏸️ NEXT

1. **Create GitHub OAuth App** ⏸️ TODO
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new app with:
     - Homepage URL: `https://buckleysitzman.com`
     - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Note Client ID and generate Client Secret

2. **Configure Netlify** ⏸️ TODO
   - Add environment variables in Netlify dashboard:
     - `GITHUB_OAUTH_CLIENT_ID`
     - `GITHUB_OAUTH_CLIENT_SECRET`

3. **Merge to main** ⏸️ TODO
   - Push `fix-netlify-cms-maybe` branch
   - Create and merge PR to main
   - Config already has editorial workflow enabled

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
- [x] CMS loads at `/admin` locally
- [ ] CMS loads at `/admin` on production
- [x] GitHub OAuth authentication works (locally)
- [x] People collection displays correctly
- [x] Services collection displays correctly
- [x] Job Postings collection displays correctly
- [ ] Can add new person with image
- [x] Can edit existing person (tested)
- [ ] Can remove person
- [ ] Can add new service
- [ ] Can edit existing service
- [ ] Can add new job posting with image
- [ ] Can edit job posting
- [ ] Images upload successfully
- [ ] Image paths are correct in markdown files
- [ ] Images display on built site
- [x] Changes create PRs (not direct commits to main)
- [x] PRs have proper descriptions and file changes
- [ ] Only authorized users can access CMS (production test pending)

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

- Config required minimal changes (added `publish_mode` and `public_folder`)
- No content migration required - files stay as-is
- Decap CMS is well-established with good community support
- Editorial workflow (PR-based) working successfully in local testing

## Implementation Log

**2026-01-27:**
- ✅ Created migration plan
- ✅ Updated `admin/index.html` to use Sveltia CMS
- ✅ Updated `admin/config.yml` with editorial workflow settings
- ⚠️ Discovered Sveltia CMS editorial workflow is planned, not implemented
- ✅ Switched to Decap CMS (script tag change)
- ✅ Local testing successful - editorial workflow confirmed working
- ✅ Test PR created successfully
- ⏸️ Pausing before Phase 2 (OAuth setup and production deployment)

---

## Next Steps

- [x] Review and approve this plan
- [x] Answer key questions (auth method, branch workflow, media provider timing)
- [x] Complete Phase 1 implementation
- [ ] Resume Phase 2: Set up GitHub OAuth App
- [ ] Configure Netlify environment variables
- [ ] Merge changes to main
- [ ] Test in production
- [ ] Complete image upload testing
- [ ] Phase 4: Update CLAUDE.md documentation
