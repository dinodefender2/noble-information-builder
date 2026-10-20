# Noble Information Builder — web app

Standalone version of the claude.ai artifact. Static files only; no server code.

## What changed from the artifact
- Drafting calls the Anthropic API straight from the browser with your own API key
  (Settings → paste key → Save). The key stays in that browser on that device.
  Case materials go only from the browser to api.anthropic.com.
- Word and PDF downloads use the normal browser download (share sheet on iPhone/iPad).
- All libraries and fonts are bundled, so the page, file reading, and Word/PDF output
  work offline once loaded. Only drafting needs the internet.
- Installable (Chrome/Edge: Install app; Safari on Mac: File → Add to Dock;
  iPhone/iPad: Share → Add to Home Screen).
- Each draft shows its token count and approximate cost.
- If this same index.html is opened as a claude.ai artifact, it still uses claude.ai drafting.

## Hosting
Must be served over https (or http://localhost) for install and offline to work.
Any static host works: GitHub Pages, Cloudflare Pages, Netlify, or a local server:

    cd noble-information-builder && python3 -m http.server 8765
    # then open http://localhost:8765

## Updating
After changing any file, bump `VERSION` in `sw.js` so installed copies refresh.
