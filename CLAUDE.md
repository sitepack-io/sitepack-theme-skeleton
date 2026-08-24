# CLAUDE.md — Building an adaptive SitePack theme

Instructions for an AI agent editing this theme. Read this file completely before touching
any `.twig`, `.css` or `theme.json` file.

**Adaptive** here means one thing: *the merchant, not the theme, owns the design.* Every
colour, font, radius and width the visitor sees must come from a setting the merchant can
change in the SitePack admin. A theme that looks correct only with its own default palette
is not adaptive and will be rejected.

## Prerequisites

- A **SitePack Partner account** is required to register, sync or publish a theme.
  Register for free at <https://admin.sitepack.eu/partners>.
- The **SitePack CLI** is required — themes cannot be uploaded by hand.
  See <https://sitepack.dev/docs/cli/installation>.

## Reference documentation (sitepack.dev)

Consult these before inventing an API. They are the authoritative developer docs:

| Topic | URL |
| :--- | :--- |
| Theme development overview | <https://sitepack.dev/docs/themes/overview> |
| Getting started (init & watch) | <https://sitepack.dev/docs/themes/getting-started> |
| Directory structure & file mapping | <https://sitepack.dev/docs/themes/directory-structure> |
| `theme.json` manifest & settings | <https://sitepack.dev/docs/themes/theme-json> |
| Assets & customization | <https://sitepack.dev/docs/themes/assets> |
| **Twig objects, functions & filters** | <https://sitepack.dev/docs/themes/twig-objects> |
| Template hooks & i18n | <https://sitepack.dev/docs/themes/template-hooks> |
| Publishing & monetization | <https://sitepack.dev/docs/themes/publishing-and-monetization> |
| JavaScript SDK | <https://sitepack.dev/docs/sdk/overview> |
| CLI installation | <https://sitepack.dev/docs/cli/installation> |

If a function or filter is not documented on sitepack.dev **and** not on the allow-list
below, do not use it.

---

## 1. The Twig sandbox — hard limits

Theme templates render inside a Twig **sandbox**. Anything outside the allow-list throws a
`SecurityNotAllowed…Error`, and the visitor gets a theme error page instead of the site.
The allow-list is enforced twice, and the two lists are **not identical**:

1. **At sync/upload time** — every `.twig` file is parsed and security-checked before it is
   accepted. A violation returns a `400 Twig Sandbox Error` and the file is not stored.
2. **At render time** — the sandbox runs again against the live template.

Use only the **intersection** of the two lists, which is what follows. A filter that passes
upload but is missing at render (or vice versa) produces a broken live site.

### Allowed tags

```
if   elseif   else   for   set   include   extends   block   trans   app_block
```

Everything else is forbidden. In particular **do not use**:
`macro`, `import`, `from`, `use`, `embed`, `with`, `apply`, `filter`, `verbatim`, `do`,
`autoescape`, `sandbox`, `cache`, `deprecated`, `flush`.

No macros means: factor shared markup into `snippets/*.twig` and pull it in with
`{% include 'snippets/x.twig' with { … } %}`.

### Allowed filters

```
abs            capitalize     date           default        ensure_link    escape
first          format         join           json_encode    keys           last
length         lower          merge          nl2br          number_format  raw
replace        reverse        round          slice          sort           striptags
title          trans          trim           upper          url_encode     asset_url
```

**Never use these — they are traps:**

| Filter | Why not |
| :--- | :--- |
| `img_url` | Never implemented — no image-variant system exists. It used to pass upload validation and then fail at render; it is now rejected at sync. Use the URL directly: `{{ article.image }}`. |
| `truncate` | Requires twig/string-extra, which the render environment does not load. Also rejected at sync. Use `\|striptags\|slice(0, 200)`, or truncate in the source data / with CSS `text-overflow`. |
| `filter` | Allowed at render, **rejected at upload** → sync fails. |
| `split`, `map`, `reduce`, `batch`, `column`, `spaceless`, `u`, `format_date`, `format_currency`, `country_name` | Not on either list. |

The render environment registers exactly three custom filters — `asset_url`, `ensure_link`
and `hex_to_rgb` (the last is not sandbox-allowed, so unusable). Everything else on the
allow-list comes from Twig core. A filter that is neither Twig core nor one of those two
usable customs cannot work, no matter what an allow-list says.

Use `|escape` (and `|escape('js')` inside `<script>`), never the `|e` shorthand.

### Allowed functions

Generic Twig:

```
range   cycle   random   date   max   min   constant
```

SitePack:

```
ensure_link                    theme_asset                 theme_setting
sitepack_head                  sitepack_title              sitepack_scripts
sitepack_cookies               sitepack_navigation         sitepack_breadcrumbs
sitepack_translations          sitepack_translations_list  sitepack_languages
sitepack_language_switcher     sitepack_language_name      sitepack_language_flag
sitepack_slug                  sitepack_product_slug       sitepack_category_slug
sitepack_blog_slug
sitepack_content               sitepack_elements           sitepack_content_legal
sitepack_footer                sitepack_legal_links        sitepack_copyright
sitepack_icon                  sitepack_live_search        sitepack_live_search_icon
sitepack_shopping_cart_icon    sitepack_price              sitepack_cart
sitepack_category_filters      app_block                   csrf_token
calculate_text_color           calculate_brightness
```

### Allowed object access

Only getters are reachable on API models: methods starting with `get`, `is` or `has`
(`site.getSetting('…')`, `settings.getSetting('store_enabled')`). Property access is
restricted to an explicit list per model. Prefer the documented dotted access
(`product.name`, `article.title`) — Twig resolves that to the allowed getter.

`DateTime`/`DateTimeImmutable` expose only `format`, `getTimestamp` and `.timestamp`.

---

## 2. Colours: the core rule

> **A submitted theme must contain no hardcoded colour values in `assets/css/theme.css`,
> in any `.twig` file, or in inline `style=""` attributes.**

That means no hex (`#ca992f`, `#eee`), no `rgb()`/`rgba()`/`hsl()` literals, and no CSS
colour keywords (`darkblue`, `white`, `black`, `red`). The only exceptions are
`transparent`, `currentColor` and `inherit`.

### How merchant colours reach your CSS

1. You declare a setting in `theme.json`:

   ```json
   { "type": "colour", "key": "header-background-color", "default": "#ffffff" }
   ```

2. The merchant edits it in the SitePack admin.
3. SitePack serves a generated stylesheet that emits, for **every** declared setting key,
   a CSS custom property in `:root` with a `--` prefix — the key verbatim:

   ```css
   :root { --header-background-color: #123456; }
   ```

4. Your `theme.css` consumes it:

   ```css
   header { background-color: var(--header-background-color); }
   ```

So the rule is mechanical: **every colour you want to style must first exist as a `colour`
setting in `theme.json`.** If you catch yourself typing a hex value in CSS, stop and add
the setting instead.

### Fallbacks in `var()`

A second argument to `var()` is a hardcoded colour and defeats the merchant's choice. Do
not write `var(--main-color, #ca992f)`. The `:root` block always carries a value for every
declared setting (falling back to the setting's `default`), so the fallback is dead code
that only hides a missing setting declaration.

### Deriving shades instead of inventing them

Adaptive themes need hover states, borders, subtle backgrounds and "muted" text. Derive
them from the merchant's colours — never hardcode a grey.

- **In CSS**, prefer relative colour manipulation that stays bound to the variable:

  ```css
  .card { border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent); }
  .btn:hover { filter: brightness(92%); }
  .muted { color: color-mix(in srgb, var(--text-color) 60%, transparent); }
  ```

  `color-mix()` and `filter: brightness()` keep everything relative to a setting. A
  translucent overlay via `color-mix(… transparent)` is also acceptable because it carries
  no colour of its own.

- **In Twig**, two sandbox functions exist for computed colours:

  ```twig
  {{ calculate_text_color('#123456') }}   {# readable black/white for a background #}
  {{ calculate_brightness('#123456', 20) }} {# lighten/darken by N steps #}
  ```

  These take a hex string, so they are only useful when the value comes from data (e.g. a
  custom template field), not for styling the chrome. For the chrome, use CSS variables.

### Foreground/background pairs

Contrast is the merchant's to break. Whenever you add a `colour` setting for a background,
add a matching text-colour setting so a dark brand colour does not produce unreadable text:

```json
{ "type": "colour", "key": "footer-background-color", "default": "#3f434a" },
{ "type": "colour", "key": "footer-text-color",       "default": "#f1f1f1" }
```

Do not rely on an auto-derived `--…-text` variable being present in the rendered CSS — the
admin preview computes such pairs, the live stylesheet does not. Declare both settings.

### Settings that always exist

These are supplied by SitePack core for every custom theme, whether or not you declare
them, so you may use them in CSS without adding them to `theme.json`:

| Variable | Default |
| :--- | :--- |
| `--heading-font` | `Open_Sans` |
| `--body-font` | `Open_Sans` |
| `--main-color` | `#ca992f` |
| `--main-color-text` | `#ffffff` |
| `--secondary-color` | `#129171` |
| `--secondary-color-text` | `#ffffff` |
| `--link-color` | `#ca992f` |
| `--link-active-color` | `#b38a2a` |
| `--link-text-decoration` | `underline` |
| `--border-radius` | `5px` |
| `--container-width` | `1200px` |

Fonts are applied globally by the generated stylesheet — do not set `font-family` on `*`,
`body` or headings yourself. Use `var(--border-radius)` for every rounded corner and
`var(--container-width)` for every page-width container, rather than fixed pixel values.

---

## 3. `theme.json`

```json
{
  "uuid": "…",                    // generated by `sitepack theme:init`; never edit
  "name": "…",
  "author": "…",
  "version": 1,                    // plain integer, managed by publishing
  "supports_site": true,
  "supports_online_store": true,
  "settings": [ … ],
  "templates": [ … ]
}
```

### Setting types

| Type | Becomes a CSS variable | Notes |
| :--- | :--- | :--- |
| `colour` | yes | British spelling. Hex string. |
| `pixels` | yes | **Write the default with its unit** (`"5px"`), not a bare number — the default is emitted verbatim. |
| `font` | yes | Value is a font key with underscores (`Open_Sans`). |
| `options` | yes (as raw text) | Add an `options` array for the dropdown. |
| `text`, `textarea`, `image`, `list` | not intended as CSS | Content-shaped settings. |

Every setting needs `key`, `type` and `default`; add a human-readable `label` so the admin
UI is understandable.

Note: `theme_setting()` reads the theme's *declared* settings, not the merchant's saved
values. To style with a merchant value, always go through the CSS variable.

### Custom templates

```json
"templates": [
  { "key": "landing-page", "name": "Landing page", "fields": [
      { "key": "hero-title", "type": "text", "label": "The main hero title" }
  ]}
]
```

`key` must match `templates/{key}.twig`. Field types: `text`, `textarea`, `image`, `list`.
Read the values with bracket notation and always guard them:

```twig
{% if page['hero-title'] %}<h1>{{ page['hero-title'] }}</h1>{% endif %}
```

---

## 4. Directory structure (enforced on upload)

Only this layout is accepted; anything else returns a `422` and aborts the sync.

| Path | Allowed contents |
| :--- | :--- |
| `theme.json` / `themes.json` | the only files accepted at the theme root |
| `layouts/` | `.twig` |
| `templates/` | `.twig` |
| `snippets/` | `.twig` |
| `translations/` | `.json`, **lowercase filenames** (`nl.json`, `en.json`) |
| `assets/` (`css/`, `js/`, `img/`, `fonts/`) | `png jpg jpeg gif svg webp css js json pdf woff woff2 ttf otf` |

Files at the root other than the manifest — this `CLAUDE.md`, `README.md`,
`sitepack.config.json` — are skipped by the CLI and never synced. Keep `.sitepackignore`
up to date for anything else that should not travel.

Do not add new top-level directories. Do not reference external CDNs, Google Fonts or
remote scripts from templates — ship assets under `assets/`.

### Templates

Ship all of: `404`, `account`, `article`, `blog`, `cart`, `category`, `index`, `legal`,
`page`, `product`, `products`, `search`, `sitemap`, `tag`, plus any custom template
declared in `theme.json`. `products.twig` and `search.twig` are technically optional
(missing ones fall back to `page.twig`, which renders the chrome but no listing) — a
complete theme includes them.

Every template extends `layouts/base.twig` and fills `{% block content %}`.

---

## 5. Template data

Full reference: <https://sitepack.dev/docs/themes/twig-objects>. Summary:

**Everywhere:** `site` (`.name`, `.locale`, `.logo`, `.icon`, `.domain`, `.socialMedia`,
`.getSetting(…)`), `settings` (feature flags, e.g. `settings.getSetting('store_enabled')`),
`navigation`, `seo`, `translations`, `pageHreflang`.

Use `pageHreflang` for `<html lang>` — the platform supplies it as a ready-to-use BCP-47
tag, page-aware on translated sites. Do not derive it from `site.locale`, which is the raw
`nl_NL` form deliberately kept that way for `og:locale` and the language switchers.

**Per template:**

| Template | Variables |
| :--- | :--- |
| `index.twig` | `collections.frontpage.products` |
| `product.twig` | `product` (`.name`, `.priceCents`, `.images`, `.description`, `.variants`, …) |
| `category.twig` | `category`, `products`, `sub_categories`, `quick_filters`, `total_products`, `total_pages`, `current_page` |
| `products.twig` | `products`, `sub_categories` |
| `search.twig` | `keywords`, `results` (each with `type`, `url`, `title`, `description`, `image`, `price`) |
| `blog.twig` | `blog.articles` |
| `article.twig` | `article` (`.title`, `.content`, `.image`, `.tags`, `.created`, `.author`) |
| `tag.twig` | `tag.title`, `tag.blogs` |
| `cart.twig` | `cart` (`.totalProducts`, `.totalValue`, `.items`) — render with `sitepack_cart()` |
| `account.twig` | `customer` (`.firstName`, `.lastName`, `.email`) |
| `page.twig` | page content via `sitepack_content()` / `sitepack_elements()` |
| `sitemap.twig` | `sitemap.pages`, `.categories`, `.products`, `.blogs`, `.content` |
| custom templates | field values via `page['field-key']` |

Prices always go through `{{ sitepack_price(product.priceCents) }}` — never format cents
yourself.

### Internal links

Every internal link goes through a slug helper, never straight into `href`. A listing is
assembled in the store's **main** language, so `href="{{ product.url }}"` throws a visitor
reading `/de/` back out of German — and pasting the language prefix in front of that same
slug names an address whose canonical is somewhere else.

Pass the **item**, not one of its fields: each item carries the address it has in every
language, and the helper reads the right one off it.

```twig
<a href="{{ sitepack_slug('pricing') }}">…</a>          {# a page, by its default slug #}
<a href="{{ sitepack_product_slug(product) }}">…</a>    {# a product #}
<a href="{{ sitepack_category_slug(category) }}">…</a>  {# a category #}
<a href="{{ sitepack_blog_slug(article) }}">…</a>       {# a blog post #}
```

A bare slug or path is still accepted for links you write by hand. If you build a hash for
a card snippet instead of passing the item, carry `translations` across with it:

```twig
{% include 'snippets/category-card.twig' with { category: {
    url: sub_category.slug,
    translations: sub_category.translations|default([]),
    categoryName: sub_category.name
} } %}
```

They are safe on a single-language store — nothing to guard.

## 6. Hooks and translations

Keep every `{% app_block '…' %}` hook already present in the templates; installed SitePack
apps inject markup there. The complete list is in [TEMPLATE_HOOKS.md](TEMPLATE_HOOKS.md).
When you add a new section, add symmetric `…_before` / `…_after` hooks around it.

No user-visible string may be hardcoded in a template. Use `{{ 'key.path'|trans }}` (with
`|trans({'%placeholder%': value})` for interpolation) and add the key to **every** file in
`translations/` (`en.json` is the fallback and must always be complete).

## 7. Workflow

```bash
sitepack login
sitepack theme:init
sitepack theme:watch
sitepack theme:publish
```

`theme:watch` syncs on save and validates as it goes. Things to know while working:

- A file that fails validation is **rejected silently** — the previously synced version
  stays live. If a change does not appear, read the watcher output; add `--debug` for the
  full server response.
- Files written in bulk or by a script sometimes do not trigger the watcher. Force a sync
  with `touch` on the affected files.
- `.json` files are syntax-checked locally before upload; a malformed `theme.json` blocks
  the sync.

## 8. Checklist before submitting a theme

Run these and fix every hit:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' assets/css templates snippets layouts
```

```bash
grep -rnE '\|\s*(img_url|filter|truncate|split|map|batch|column|e)\b|\{%\s*(macro|import|from|use|embed|with|apply|verbatim|do|autoescape)\b' templates snippets layouts
```

- [ ] No hardcoded colours anywhere (the grep above returns nothing, `transparent` /
      `currentColor` / `inherit` only).
- [ ] No `var(--x, #fallback)` fallback colours.
- [ ] Every colour used in CSS has a matching `colour` setting in `theme.json`, and every
      background setting has a paired text-colour setting.
- [ ] `pixels` defaults include their unit; box radii use `var(--border-radius)` and
      containers use `var(--container-width)`. (`border-radius: 50%` for circles, `0` for
      resets and decorative micro-radii on non-box elements are fine.)
- [ ] No `font-family` declarations of your own.
- [ ] Only allow-listed tags, filters and functions (second grep returns nothing).
- [ ] All templates present and extending `layouts/base.twig`; all `app_block` hooks kept.
- [ ] No hardcoded user-facing strings; `en.json` complete and every other locale in sync.
- [ ] No files outside the allowed directory structure; no external CDN references.
- [ ] Verified in the admin by changing `main-color`, `header-background-color` and
      `footer-background-color` to strongly contrasting values — the site must stay
      readable and on-brand.
