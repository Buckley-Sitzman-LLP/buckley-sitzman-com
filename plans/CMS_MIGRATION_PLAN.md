# CMS Migration Plan: Netlify CMS → Sveltia CMS

**Date:** 2026-01-27 (Updated: 2026-01-28)
**Status:** Switching to Sveltia CMS - Phase 1 Restart
**Current Step:** Need to update admin files for Sveltia

## Overview

Migrating from deprecated Netlify CMS to Sveltia CMS, a modern, performant replacement with better UX and active development. This fixes production authentication issues and provides a better editing experience.

**Decision history:** Initially considered Decap CMS for editorial workflow support, but determined that PR-based workflow is not critical. Sveltia CMS offers better performance, modern UI, and superior editing experience without the complexity of editorial workflow.

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

**Why Sveltia CMS:**
- Modern, fast, and actively developed replacement for Netlify CMS
- Superior user experience with better UI/UX
- Built by developers familiar with CMS needs
- Compatible with Netlify CMS config format (minimal changes)
- Same content structure - no data migration required
- Direct commits to main branch (simpler workflow)
- Better performance and faster load times

**Why not Decap CMS:**
- Editorial workflow adds unnecessary complexity for this use case
- PR-based workflow determined to be not critical
- Sveltia offers better editing experience and performance
- Decap remains a solid fallback option if needed

## Implementation Steps

### Phase 1: Local Migration & Testing 🔄 IN PROGRESS

1. **Update admin/index.html** ✅ COMPLETE
   - Replaced Decap CMS script with Sveltia CMS CDN
   - Updated comments to reflect Sveltia usage
   - Script tag: `<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>`

2. **Update config.yml** ✅ COMPLETE
   - Removed `publish_mode: editorial_workflow` (direct commits to main)
   - Kept `public_folder: "/img/"` for proper image paths
   - Updated comments to reference Sveltia documentation
   - Backend configuration verified (GitHub repo settings)

3. **Local Testing** ✅ COMPLETE
   - ✅ CMS loads successfully at `localhost:8080/admin`
   - ✅ All collections appear (People, Services, Job Postings, Other People)
   - ✅ Can edit existing content
   - ✅ Can add new content
   - ✅ Can delete items from collections
   - ✅ Empty collections handled correctly (files not deleted)
   - ⏸️ Image uploads work correctly (to be tested in production)
   - ⏸️ Changes commit directly to main branch (to be tested in production)

### Phase 2: GitHub OAuth Setup ✅ COMPLETE

1. **Create GitHub OAuth App** ✅ COMPLETE
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new app with:
     - Homepage URL: `https://buckleysitzman.com`
     - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Note Client ID and generate Client Secret

2. **Configure Netlify** ✅ COMPLETE
   - Add environment variables in Netlify dashboard:
     - `GITHUB_OAUTH_CLIENT_ID`
     - `GITHUB_OAUTH_CLIENT_SECRET`

3. **Merge to main** ✅ COMPLETE
   - Push `fix-netlify-cms-maybe` branch
   - Create and merge PR to main
   - Direct commit workflow configured

### Phase 3: Production Deployment & Testing ✅ COMPLETE

1. **Deploy Changes** ✅ COMPLETE
   - Commit admin/index.html changes
   - Push to main branch
   - Verify Netlify build succeeds

2. **Production Testing** ✅ COMPLETE
   - Access `/admin` on production site
   - Test GitHub OAuth login flow
   - Verify all collections load
   - Test editing content (use test person or job posting)
   - Verify image upload works
   - Confirm changes create proper Git commits

3. **Access Control Verification** ✅ COMPLETE
   - Confirm only GitHub collaborators can access
   - Test with authorized user account

### Phase 4: Documentation & Handoff ✅ COMPLETE

1. **Update CLAUDE.md** ✅ COMPLETE
   - Changed CMS reference from Netlify to Sveltia
   - Documented OAuth configuration
   - Added troubleshooting notes (file collections, empty arrays)
   - Added CMS configuration section

2. **Update README.md** ✅ COMPLETE
   - Updated Content Management section
   - Documented Sveltia CMS authentication
   - Added important notes about workflow

3. **User guide** ✅ EXISTS
   - README already contains comprehensive guides for:
     - Adding job postings
     - Adding services
     - Adding team members
     - Adding other professionals

## Testing Checklist

### Functionality Tests
- [x] CMS loads at `/admin` locally
- [x] CMS loads at `/admin` on production
- [x] GitHub OAuth authentication works in production
- [x] People collection displays correctly
- [x] Services collection displays correctly
- [x] Job Postings collection displays correctly
- [x] Other People collection displays correctly
- [x] Can add new person (without image)
- [x] Can edit existing person
- [x] Can remove person
- [x] Can add new service
- [x] Can edit existing service
- [x] Can add new job posting (without image)
- [x] Can edit job posting
- [x] Can delete items from collections
- [x] Empty collections preserved (files not deleted)
- [ ] Images upload successfully
- [ ] Image paths are correct in markdown files
- [ ] Images display on built site
- [x] Changes commit directly to main branch
- [x] Only authorized users can access CMS

### Image Handling Tests
- [ ] Upload image for person - verify path
- [ ] Upload image for job posting - verify path
- [ ] Verify images appear in `img/people/` directory
- [ ] Verify images display on live site
- [ ] Test image deletion/replacement

## Rollback Plan

If Sveltia CMS has issues:

1. **Option A: Switch to Decap CMS** (preferred fallback)
   - Drop-in replacement for Sveltia
   - Update script tag: `https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js`
   - Use same config.yml
   - Official Netlify CMS successor, more conservative choice
   - Can add `publish_mode: editorial_workflow` if PR workflow desired

2. **Option B: Revert to Netlify CMS** (last resort)
   - Restore original admin/index.html
   - Keep OAuth configuration
   - Quick rollback, but deprecated software

## Success Criteria

- [x] CMS accessible and functional in production
- [x] Authorized users can add/edit people via GUI
- [x] Authorized users can add/edit services via GUI
- [x] Authorized users can add/edit job postings via GUI
- [ ] Image uploads work correctly (not yet tested)
- [x] Changes commit directly to main branch
- [x] No local development workflow disruption
- [x] Empty collections handled properly (no file deletion)

## Decisions Made

1. **CMS Choice:** Sveltia CMS (modern UI, better performance, simpler workflow)

2. **Authentication:** GitHub OAuth (users must be repo collaborators)

3. **Branch workflow:** Direct commits to `main` branch (no PR workflow needed)

4. **Media provider exploration:** Defer until after Sveltia is working with Git-based images

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

- Sveltia CMS is compatible with Netlify CMS config format
- Config requires minimal changes (mainly script tag update, remove `publish_mode`)
- No content migration required - files stay as-is
- Sveltia offers better performance and modern UI
- Direct commit workflow simplifies content editing process

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

**2026-01-28:**
- 📋 Reassessed requirements: editorial workflow not critical
- ✅ Decision to use Sveltia CMS for better UX and performance
- ✅ Updated migration plan to reflect Sveltia CMS approach
- ⏸️ Ready to update admin files for Sveltia (awaiting user approval)

**2026-01-29:**
- ✅ Phase 1 local testing complete
- ⚠️ Discovered issue: Sveltia deleted entire file when collection emptied
- ✅ Fixed by converting from folder collections to file collections
- ✅ Added `required: false` to all list fields to allow empty arrays
- ✅ Verified collections can be emptied without file deletion
- ✅ Phase 2: GitHub OAuth setup complete
- ✅ Phase 3: Production deployment and testing complete
- ✅ Verified production access and editing functionality working
- ✅ Phase 4: Documentation complete (CLAUDE.md and README updated)
- ⏸️ Image upload testing still needed (optional)

---

## Next Steps

- [x] Review and approve this plan
- [x] Answer key questions (auth method, branch workflow, media provider timing)
- [x] Reassess editorial workflow requirement
- [x] Update plan to reflect Sveltia CMS decision
- [x] Update `admin/index.html` with Sveltia CMS script
- [x] Update `admin/config.yml` (convert to file collections, add required: false)
- [x] Complete Phase 1: Local testing with Sveltia
- [x] Phase 2: Set up GitHub OAuth App
- [x] Configure Netlify environment variables
- [x] Merge changes to main
- [x] Test in production
- [x] Verify production access and editing functionality
- [x] Phase 4: Update CLAUDE.md documentation
- [x] Phase 4: Update README.md documentation
- [ ] Optional: Test image uploads in production
