# ZX — Personal Portfolio

Light monochrome portfolio with fixed slides, soft translucent panels, DIN / Helvetica Neue typography, a darker random-dither cloth mesh that reshapes during navigation, with a quiet centre, reduced-motion support and a static canvas fallback, a pan/zoom global view, and a seven-film sequence. Category slides use wide, level cards with uneven spacing. Hover or keyboard focus expands a card while nearby cards shift aside. Navigation relationships are implied by placement; no connector lines are drawn.

## Edit the content

Edit `dist/content.js`. Each page has a permanent ID, title, subtext, parent, images, captions and an empty `body` for the write-up. Filling `body` replaces the first note placeholder. Add `notes: [{title, body}, ...]` for the remaining tabs. Images and notes switch inside the current slide. About uses its own empty body. Add gallery images to `dist/assets` and update the corresponding image/caption lists. Private audience analytics remain placeholders until supplied.

- `H`: home; `M`: global map; `Esc`: parent/return.
- Map: drag, wheel/pinch, plus/minus, Fit All.
- Image arrows and thumbnails switch visuals inside the slide; images also open in a full-size viewer.
- Back is fixed at the top left. Left/right arrows follow the slide footer.
- Films load YouTube embeds on request, with a direct YouTube link.

## Preview

Serve `dist` with any static HTTP server. The site has no build or package dependencies. Hash routes support direct links and browser history.

## Content status

All requested pages exist. Flour, Ideate Hackathon, NUS COOP and law-firm photos need identification/supply. Vision and History remain writing spaces. Unmatched gallery assets are retained under `dist/assets`; their original filenames are recorded in `gallery.json`. Originals in Downloads were not altered.

## Sources

- Portrait, Nothing concept image and adapted channel introduction: existing ZXTECH project in the adjacent `zachxtech-site` folder. Sample articles and old unverified metrics were not copied.
- Uploaded archive: `dist/assets/gallery.json` maps each web image to its original filename. TECHYARD September 2026 screenshot is a historical illustration, not a claim about the 2023–2024 site appearance. The dashboard photo was removed from both TECHYARD galleries. Growth infographic figures ($0 → $250K/month revenue; 0 → 10,000 users) were supplied by Zac.
- YouTube titles/thumbnails: official video pages, recorded in `research/videos.json`.
- Channel counts: https://www.youtube.com/@ZXTech/about, checked 13 Sep 2026, 20:39 SGT. 20.2K subscribers (public rounded count), 4,793,306 views, 575 videos. Saved in `research/channel-stats.json`.
- M1 Pro mouse/dock: https://aftershockpc.com/products/as-m1pro-wh. Official transparent asset https://cdn.shopify.com/s/files/1/0637/0407/2436/files/m1pro-whitehighres.png?v=1733976774. No newer named revision was verified.
- Griffin page now uses the public Griffin Labs wordmark and a LionsBot Singapore factory photograph. Sources and credits are recorded in `research/griffin-public-images.json`; neither image represents the NDA project.
- Flour project: user-supplied process photograph and the user-linked YouTube process film (`78ZCLYIE9gE`).
- TECHYARD: IT Show frames from three March 2024 Instagram videos (`research/techyard-stills.json`). The career cover uses the user-selected Aftershock video C1bYnDTyWVd at 54.2s. Showroom gallery images now come from TheSmartLocal’s 12 Dec 2023 article, credited to Shawn Low / TheSmartLocal; watermarks are retained. Sources are in `research/techyard-replacements.json`. The earlier showroom video stills are no longer displayed.
- Career roles/dates and personal experience: user supplied. Content creation begins 2015; the channel's separate establishment date is not substituted.

## Checks

Run `node checks/validate.mjs` for slide render, route, asset, typography and random-wave mesh checks. Use `node --check dist/app.js` and `node --check dist/mesh.js` for syntax.
