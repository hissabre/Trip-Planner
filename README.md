# Djiba's Trip: GitHub setup

## 1. Put the app online
1. New GitHub repository. Upload to the root: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
2. **Settings > Pages**: Deploy from branch `main` / root. App URL: `https://YOURNAME.github.io/REPO/`.
3. Phone: open the link, then iPhone Safari Share > Add to Home Screen, or Android Chrome menu > Install app.

## 2. AI (the app picks the first one available)
1. **Inside Claude:** works automatically.
2. **Your own endpoint (best quality, you pay for usage):** deploy `worker.js` on Cloudflare with secret `ANTHROPIC_API_KEY` and text `ALLOWED_ORIGIN` = `https://YOURNAME.github.io`; then set `const CFG={endpoint:'https://your-worker.workers.dev'}` in `index.html`. Set a spend limit on the key.
3. **Free option (experimental):** Puter.js lets visitors use AI with their own free Puter account (a sign-in popup appears on first use). No key needed from you.
4. **No AI at all:** the app falls back to the free planner built on OpenStreetMap + Wikipedia.

## Always free, no keys
Address suggestions (Photon), places and hours (OpenStreetMap), weather (Open-Meteo), prayer times (Aladhan), map tiles (OpenStreetMap).

## Offline
Trips, checkmarks and guides are saved on the phone and open without internet, along with the app itself and any map tiles you've viewed. Use My trips > Backup to export a copy; Restore imports it.
