# Djiba's Trip: GitHub setup (100% free, no keys)

## 1. Put the app online
1. Create a new GitHub repository and upload these files to the root: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
2. Repo **Settings > Pages**: Source = *Deploy from a branch*, Branch = `main` / root. Your app appears at `https://YOURNAME.github.io/REPO/`.

## 2. Install on your phone
iPhone: open the link in Safari, Share > Add to Home Screen. Android: Chrome menu > Install app.

## How it works with no AI and no cost
- **Places, addresses, opening hours, phone, website, halal/vegan tags:** OpenStreetMap (Overpass + Nominatim)
- **Descriptions of landmarks:** Wikipedia
- **Address suggestions:** Photon. **Map background:** OpenStreetMap tiles.
Everything is called straight from the browser, with no accounts or keys.

Limits: OpenStreetMap is volunteer-edited, so some places lack hours or halal tags (the app flags this), and the free servers can be busy at times (just retry).

## Optional: smarter AI planning (not free)
If you ever want richer, AI-written plans, deploy `worker.js` as a Cloudflare Worker with your own Anthropic API key (secret `ANTHROPIC_API_KEY`, text `ALLOWED_ORIGIN` = `https://YOURNAME.github.io`), then set `const CFG={endpoint:'https://your-worker.workers.dev'}` in `index.html`. Set a spend limit on the key first.
