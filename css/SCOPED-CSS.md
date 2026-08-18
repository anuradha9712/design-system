# Scoped CSS (`scoped.css`)

`@innovaccer/design-system/css` is a global stylesheet: it puts design tokens on `:root`, base
typography on `body`, and ~2400 unprefixed class selectors into the document. When MDS is one app
among several on a shared page — for example a set of `ui-{appName}-app` web components mounted into
a host shell — those globals restyle everything around it.

`scoped.css` is the same bundle wrapped in a CSS `@scope` at-rule, so nothing outside the scope root
is touched.

> **Browser support:** `@scope` requires **Chrome/Edge 118+, Safari 17.4+, Firefox 128+**. There is no
> polyfill and autoprefixer does not help. Use the global `index.css` if you must support older
> browsers.

---

## Consuming it

**1. Import the scoped bundle instead of the global one**

```diff
- import '@innovaccer/design-system/css';
+ import '@innovaccer/design-system/css/scoped';
```

(`@innovaccer/design-system/css/dist/scoped.css` also works if your bundler doesn't resolve the
directory shim.)

**2. Mark your app root with `data-mds-root`**

```html
<ui-analytics-app data-mds-root>
  <!-- MDS components render here -->
</ui-analytics-app>
```

The cleanest way to guarantee this across every app is to have the custom element mark itself, so no
template ever has to remember it and the CSS never needs regenerating:

```js
class UiAppBase extends HTMLElement {
  connectedCallback() {
    this.setAttribute('data-mds-root', '');
  }
}
```

That's the whole integration. The attribute needs no particular value — its presence is what matters
— and it is inert when the global stylesheet is used instead.

---

## What the transform does

| Input | Output |
|---|---|
| `:root { --primary: … }` | `:scope { --primary: … }` |
| `body { font-family: … }` | `:scope { font-family: … }` |
| `.Button { … }` | `.Button, :scope.Button { … }` (inside the `@scope` block) |
| `@media (…) { .x { … } }` | nested inside `@scope`, selectors rewritten |
| `@font-face`, `@keyframes` | hoisted above `@scope`, unchanged |

Resulting shape:

```css
@font-face { … }
@keyframes fadeIn { … }
@scope ([data-mds-root]) {
  :scope { --primary: …; }
  .Button, :scope.Button { … }
  @media (forced-colors: active) { .x, :scope.x { … } }
}
```

`@font-face` is hoisted because font loading is document-wide, and its `url()` is relative to the
stylesheet — **keep `scoped.css` in the same directory as `MaterialSymbolsRounded.woff2`**.
`@keyframes` is hoisted because animation names are referenced from inline styles in component JS
(see `PopperWrapper`), which are not subject to `@scope`.

### Why every rule is duplicated as `.x, :scope.x`

Inside `@scope`, a bare selector is implicitly relative to `:scope` **as a descendant**, so it does
not match the scope root itself. Verified in Chrome 151 — with
`@scope ([data-mds-root]) { .Card { border-top-width: 7px } }`:

| element | computed `border-top-width` |
|---|---|
| `<div data-mds-root class="Card">` (the root) | `0px` |
| `<div class="Card">` nested inside it | `7px` |

Backdrop and the popper content put the MDS class on the very element that is marked as a scope root,
so each rule needs the explicit `:scope`-prefixed form too.

### Specificity

`@scope` contributes no specificity, so the plain `.Button` form keeps its original `(0,1,0)` and the
cascade inside the bundle is unchanged. The `:scope.Button` form is `(0,2,0)`, but since *every* rule
gains both forms the relative ordering among MDS rules is preserved. Scope proximity is a cascade
criterion ranked *below* specificity, so with a single scope root it is inert.

---

## Portals

Modal, Sidesheet, FullscreenModal, Backdrop, every popper-based overlay (Tooltip, Dropdown, Popover,
DatePicker) and the reorder-list drag ghost render through `ReactDOM.createPortal` into
`document.body` — i.e. **outside** your app root. `@scope` does not reach them on its own.

The library therefore stamps `data-mds-root` onto those portal roots itself:

- [`core/utils/overlayHelper.ts`](../core/utils/overlayHelper.ts) — the shared `.Overlay-wrapper`
  container used by Modal, Sidesheet and FullscreenModal
- [`core/components/atoms/backdrop/Backdrop.tsx`](../core/components/atoms/backdrop/Backdrop.tsx)
- [`core/components/atoms/popperWrapper/PopperWrapper.tsx`](../core/components/atoms/popperWrapper/PopperWrapper.tsx)
  — covers all `appendToBody` overlays
- [`core/components/organisms/listbox/reorderList/Draggable.tsx`](../core/components/organisms/listbox/reorderList/Draggable.tsx)
  — the reorder drag ghost, via its `renderItem` props (the ghost is not an overlay layer, so it
  keeps portaling to `document.body` rather than joining `.Overlay-wrapper`)

Nothing is required of the consuming app here. **If you add a new component that portals to
`document.body`, add `data-mds-root` to the portaled element or its container** — otherwise it will
render unstyled under `scoped.css`.

---

## Matching the `ui-{appName}-app` tag instead of the attribute

**CSS has no wildcard or regex for tag names.** `ui-*-app` is an invalid selector (verified via
`querySelectorAll`, which throws on it), and there is no `[tagname^="ui-"]` equivalent — attribute
selectors only match real attributes. Two dead ends worth naming:

- `:defined` matches every built-in element too, so it cannot mean "any custom element".
- `:not(:defined)` matches custom elements only *before* `customElements.define()` upgrades them, so
  it stops matching exactly when your app boots.

Tags therefore have to be listed explicitly. `@scope` takes a **forgiving selector list**, so
unknown or not-yet-created tags are preserved rather than invalidating the whole sheet:

```bash
npx gulp --gulpfile css/gulpfile.js scopedCss --scope "[data-mds-root],ui-analytics-app,ui-billing-app"
```

```css
@scope ([data-mds-root], ui-analytics-app, ui-billing-app) { … }
```

Trade-off: the file must be regenerated whenever an app is added, and `data-mds-root` is still
required on portal roots regardless. Self-marking in `connectedCallback` (above) avoids both, which
is why the attribute is the default.

### Donut scoping

To exclude non-MDS subtrees inside the app root, pass a limit:

```bash
npx gulp --gulpfile css/gulpfile.js scopedCss --scope-limit "[data-mds-ignore]"
```

```css
@scope ([data-mds-root]) to ([data-mds-ignore]) { … }
```

---

## Building

`npm run build-css` emits both bundles into `css/dist/`:

```
index.css     global      (unchanged, still the default export)
scoped.css    scoped to   @scope ([data-mds-root])
```

### Measured size

| bundle | raw | gzip | brotli |
|---|---|---|---|
| `index.css` (global) | 273K | 36K | 29.2K |
| `scoped.css` (`@scope`) | 349K | 45K | 35.8K |
| *(rejected)* `:is()` prefixing | 371K | 39K | 30.2K |

Note the inversion: `@scope` is ~22K smaller **raw** than prefixing every selector with
`:is([data-mds-root], [data-mds-root] *)`, but ~6K **larger gzipped**, because a repeated identical
prefix compresses better than the `, :scope…` duplication. `@scope` was chosen for the cleaner
output, zero added specificity, and donut scoping — not for transfer size.

---

## Implementation

[`css/scripts/postcss-mds-scope.js`](./scripts/postcss-mds-scope.js), wired into the `scopedCss`
gulp task in [`css/gulpfile.js`](./gulpfile.js). It runs before autoprefixer — which handles `@scope`
correctly, prefixing declarations inside it and preserving the at-rule — so any rule autoprefixer
clones inherits the scope.

Selectors starting with a combinator cannot be compounded with `:scope`; none exist in the bundle
today and the plugin emits a PostCSS warning if one appears.
