# EX.IO Interactive Exchange Website

HTML, CSS, JavaScript, and artwork for the EX.IO RFQ landing page.

[Live website](https://exio-rfq-julia-hero.juliahsu.chatgpt.site/)

## Files

- `index.html`: page markup, RFQ preview, Services, and Why Choose sections.
- `styles.css`: responsive layout, glass styling, hover effects, and animations.
- `app.js`: live market prices, cursor effects, illustrations, and scroll transitions.
- Other files and folders: images, SVGs, and token icons used by the page.

## Run locally

No build step or package installation is required. From this folder run:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173 in your browser. Internet access is needed for Google Fonts and public Kraken market-price requests. The RFQ interface is a visual demo; its buttons do not execute trades.

## Editing

Edit the three main files and refresh the browser. Keep asset paths relative so the website can be hosted in a subdirectory.

This source snapshot includes the Why Choose feature hover lift. It does not include deployment credentials or the original hosting configuration.
