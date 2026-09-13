# ZX — Personal Portfolio

Light monochrome portfolio with connected project pages, a pan/zoom global map, keyboard shortcuts and a seven-film sequence.

## Edit the content

Edit `dist/content.js`. Each page has a permanent ID, title, subtext, parent, images, captions and an empty `body` for the write-up. Filling `body` replaces that page's write-up placeholders. About uses its own empty body. Add gallery images to `dist/assets` and update the corresponding image/caption lists. Private audience analytics remain placeholders until supplied.

- `H`: home; `M`: global map; `Esc`: parent/return.
- Map: drag, wheel/pinch, plus/minus, Fit All.
- Images open in an accessible full-size viewer.
- Films load YouTube embeds on request, with a direct YouTube link.

## Preview

Serve `dist` with any static HTTP server. The site has no build or package dependencies. Hash routes support direct links and browser history.

## Content status

All requested pages exist. Flour, Ideate Hackathon, NUS COOP and law-firm photos need identification/supply. Vision and History remain writing spaces. Unmatched gallery assets are retained under `dist/assets`; their original filenames are recorded in `gallery.json`. Originals in Downloads were not altered.

## Sources

- Portrait, Nothing concept image and adapted channel introduction: existing ZXTECH project in the adjacent `zachxtech-site` folder. Sample articles and old unverified metrics were not copied.
- Uploaded archive: `dist/assets/gallery.json` maps each web image to its original filename. TECHYARD September 2026 screenshot and undated dashboard are historical illustrations, not a claim about the 2023–2024 site appearance.
- YouTube titles/thumbnails: official video pages, recorded in `research/videos.json`.
- Channel counts: https://www.youtube.com/@ZXTech/about, checked 13 Sep 2026, 20:39 SGT. 20.2K subscribers (public rounded count), 4,793,306 views, 575 videos. Saved in `research/channel-stats.json`.
- M1 Pro mouse/dock: https://aftershockpc.com/products/as-m1pro-wh. Official transparent asset https://cdn.shopify.com/s/files/1/0637/0407/2436/files/m1pro-whitehighres.png?v=1733976774. No newer named revision was verified.
- Griffin Labs company imagery: https://griffinlabs.ai/t1 and https://griffinlabs.ai/t1/t1-cover.webp. This is company context; it does not imply Zac designed the pictured T1.
- Career roles/dates and personal experience: user supplied. Content creation begins 2015; the channel's separate establishment date is not substituted.
