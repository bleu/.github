# README template for maintained Bleu repos

Copy this structure into any repo we maintain. Rules: one-paragraph pitch under the
title (what it is, who it's for, one proof point), a designed social preview
(Settings → Social preview, use `brand/social-<repo>.png` from this repo or render a
new one), and the Built-by-Bleu banner as the footer.

```markdown
# repo-name

One sentence: what this is and who it's for. One proof point (forks, production
use, audit) if it exists.

## Quick start

<the shortest path to running it>

## Docs

<links>

---

[![Built and maintained by Bleu](https://raw.githubusercontent.com/bleu/.github/main/brand/banner-built-by-bleu.png)](https://bleu.builders/?utm_source=github&utm_medium=referral&utm_campaign=repo-readme&utm_content=repo-name)
```

New social previews: `brand/render.mjs` renders them (needs playwright + the brand fonts);
brand source of truth is `jose-brain/bleu-brain/document-system/` (tokens,
application-rules, fonts, vectors). 1280×640 @2x, ink ground, aqua accent, grain.
