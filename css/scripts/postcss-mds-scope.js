/**
 * PostCSS plugin that wraps the whole MDS stylesheet in a CSS `@scope` at-rule, so the bundle can
 * be loaded inside a host application without restyling anything outside the scope root.
 *
 * Output shape
 * ------------
 *   @font-face { … }                      <- hoisted, document-wide by nature
 *   @keyframes fadeIn { … }               <- hoisted, referenced from inline styles in component JS
 *   @scope ([data-mds-root]) {
 *     :scope { --primary: … }             <- was :root / body
 *     .Button, :scope.Button { … }        <- see "self-matching" below
 *     @media (…) { .x, :scope.x { … } }
 *   }
 *
 * Self-matching: why every rule also gets a `:scope`-prefixed copy
 * ---------------------------------------------------------------
 * Inside `@scope`, a bare selector is implicitly relative to `:scope` as a *descendant*, so `.Card`
 * does not match the scope root itself. Components that portal to `document.body` sit outside the
 * app root and are therefore marked as scope roots themselves — with a plain attribute, no wrapper
 * div (Backdrop, the Popover element that backs every popper overlay, the reorder drag ghost).
 *
 * The duplication cannot be narrowed to an "overlay only" subset of the stylesheet, for two reasons:
 *
 *   1. `Popover`'s `className` is public API, so any MDS class can land on the marked element.
 *      In-repo already: EditableInput passes utility classes (`px-6 py-6 d-flex align-items-center`),
 *      Tooltip passes tooltip styles, DateRangePicker its own.
 *   2. A root's own class gates its descendants. Bare `.Popover .Popover-item` requires `.Popover`
 *      to be a *descendant* of a scope root; when `.Popover` IS the scope root that fails for every
 *      child, so `:scope.Popover .Popover-item` is required too.
 *
 * Cost, measured on this bundle: +2565 selectors, 273.6K -> 349.4K raw, 37.1K -> 45.8K gzipped.
 * The alternatives were rejected deliberately: wrapping portal roots in container divs would remove
 * the need entirely but adds DOM nodes to shared components, and `:is(<root>, <root> *)` prefixing
 * self-matches in one compound but drops `@scope` (and donut scoping) altogether.
 *
 * Left untouched (intentionally global):
 *   @font-face      — font loading is document-wide, and the `url()` is relative to this file
 *   @keyframes      — animation names are referenced from inline styles in component JS
 *   @supports params — a feature test, not a matching selector
 */

const LEADING_GLOBAL_ROOT = /^(?::root|html|body)\b/;

// At-rules that must stay at the top level: scoping them would either break them outright
// (@charset/@import must precede style rules) or silently change their meaning.
const HOISTED_AT_RULES = /^(?:font-face|(?:-\w+-)?keyframes|charset|import|namespace|property|counter-style|font-feature-values|layer)$/i;

module.exports = (opts = {}) => {
  const scopes = (opts.scopes && opts.scopes.length ? opts.scopes : ['[data-mds-root]'])
    .map((scope) => String(scope).trim())
    .filter(Boolean);

  if (!scopes.length) throw new Error('postcss-mds-scope: at least one scope selector is required');

  const limit = opts.limit ? String(opts.limit).trim() : '';
  const scopeParams = `(${scopes.join(', ')})${limit ? ` to (${limit})` : ''}`;

  /**
   * `.a .b` -> `.a .b, :scope.a .b`
   * `:root` -> `:scope`
   */
  const scopeSelector = (selector, rule, result) => {
    const trimmed = selector.trim();
    if (!trimmed) return selector;

    if (trimmed.startsWith(':scope')) return trimmed;

    // The tokens on `:root` and the base typography on `body` belong on the scope root itself.
    if (LEADING_GLOBAL_ROOT.test(trimmed)) {
      return trimmed.replace(LEADING_GLOBAL_ROOT, ':scope');
    }

    // A selector starting with a combinator cannot be compounded with `:scope`. None exist in the
    // bundle today; warn loudly rather than emit broken CSS if one ever appears.
    if (/^[>+~]/.test(trimmed)) {
      rule.warn(result, `postcss-mds-scope: cannot scope selector starting with a combinator: "${trimmed}"`);
      return trimmed;
    }

    return `${trimmed}, :scope${trimmed}`;
  };

  // Plain-function plugin form: `gulp-postcss` still bundles PostCSS 7, while the repo root has
  // PostCSS 8. A bare `(root, result)` function is the one signature both versions accept.
  const plugin = (root, result) => {
    // Snapshot first: the loop below reparents nodes, which mutates `root.nodes`.
    const topLevel = root.nodes.slice();
    const toScope = topLevel.filter((node) => !(node.type === 'atrule' && HOISTED_AT_RULES.test(node.name)));

    if (!toScope.length) return;

    // `append` with a string is parsed by whichever PostCSS version owns this AST, which keeps the
    // plugin free of a direct postcss import (and thus of a version mismatch).
    root.append(`@scope ${scopeParams} {}`);
    const scopeRule = root.last;

    toScope.forEach((node) => {
      node.remove();
      scopeRule.append(node);
    });

    scopeRule.walkRules((rule) => {
      // Keyframe steps (`0%`, `from`) are selectors syntactically but must not be scoped. All
      // @keyframes are hoisted above, so this only guards against future nesting.
      for (let parent = rule.parent; parent; parent = parent.parent) {
        if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
      }

      rule.selectors = rule.selectors.map((selector) => scopeSelector(selector, rule, result));
    });
  };

  plugin.postcssPlugin = 'postcss-mds-scope';

  return plugin;
};
