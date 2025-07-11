# Video Optimization Guide

Your videos are currently **210 MB** and causing navigation freezes. Here's how to optimize them:

## Current Video Sizes:
- `about-page-back-ground-video.mp4` - 96 MB
- `accessories-background.mp4` - 48 MB  
- `main-page-background.mp4` - 26 MB
- `Gear-background.mp4` - 24 MB
- `appparel-background.mp4` - 17 MB

## Quick Online Solution (No Software Needed):

### Option 1: Use CloudConvert (Free)
1. Go to https://cloudconvert.com/mp4-converter
2. Upload each video
3. Settings:
   - Video Codec: H.264
   - Video Size: 1920x1080 (or current size)
   - Video Quality: CRF 28 (good for backgrounds)
   - Remove Audio: Yes
   - Optimize for Web: Yes
4. Download optimized videos

### Option 2: Use Clideo (Free)
1. Go to https://clideo.com/compress-video
2. Upload video
3. Choose "Basic" compression (70% reduction)
4. Download

## Expected Results:
- 96 MB → ~15-20 MB
- 48 MB → ~8-10 MB
- 26 MB → ~4-5 MB
- 24 MB → ~4-5 MB
- 17 MB → ~3-4 MB

**Total: 210 MB → ~35-45 MB (80% reduction)**

## After Optimization:
1. Replace videos in `/public/videos/`
2. Test navigation speed
3. Commit and push changes

## Alternative: Convert to WebM
WebM format provides even better compression:
- Use https://cloudconvert.com/mp4-to-webm
- Update your components to use WebM with MP4 fallback 