# Djiba's Trip: GitHub setup

## 1. Put the app online (GitHub Pages)
1. Create a new GitHub repository and upload these files to the root: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`. (`worker.js` and this README are optional there.)
2. Repo **Settings > Pages**: Source = *Deploy from a branch*, Branch = `main` / root. Your app appears at `https://YOURNAME.github.io/REPO/`.

## 2. Turn on the AI (free Cloudflare Worker)
GitHub Pages can't hold a secret key, so a tiny Worker sits in between.
1. Get an API key at console.anthropic.com and set a monthly spend limit there.
2. At cloudflare.com: **Workers & Pages > Create > Worker**, paste `worker.js`, deploy.
3. Worker **Settings > Variables**: add secret `ANTHROPIC_API_KEY` (your key) and text `ALLOWED_ORIGIN` = `https://YOURNAME.github.io` (no trailing slash, no repo path).
4. Copy the Worker URL, open `index.html`, and set `const CFG={endpoint:'https://your-worker.workers.dev'}`, then commit. (Or paste it in the app under Advanced.)

## 3. Install on your phone
Open the GitHub Pages link in Safari (iPhone: Share > Add to Home Screen) or Chrome (Android: menu > Install app).

Notes: address suggestions use Photon and the map uses OpenStreetMap tiles. Both need no keys.
