const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const postcssColorMod = require('postcss-color-mod-function');
const cleaner = require('gulp-clean');
const mdsScope = require('./scripts/postcss-mds-scope');

const DEFAULT_SCOPES = ['[data-mds-root]'];

/** Reads `--flag value` or `--flag=value` out of argv. */
function getFlag(name) {
  const index = process.argv.findIndex((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`));
  if (index === -1) return undefined;

  const arg = process.argv[index];
  return arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : process.argv[index + 1];
}

/**
 * Scope roots for `scoped.css`. Defaults to `[data-mds-root]`; override with
 *   gulp --gulpfile css/gulpfile.js build --scope "[data-mds-root],ui-analytics-app"
 * to additionally match app custom-element tags without touching their markup. CSS has no
 * wildcard for tag names, so `ui-*-app` is not expressible — tags must be listed explicitly.
 */
function getScopes() {
  const scopes = (getFlag('scope') || '')
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean);

  return scopes.length ? scopes : DEFAULT_SCOPES;
}

/**
 * Optional donut-scoping limit — `@scope (<root>) to (<limit>)` — to punch non-MDS subtrees out of
 * the middle of the scope root:
 *   gulp --gulpfile css/gulpfile.js build --scope-limit "[data-mds-ignore]"
 */
function getScopeLimit() {
  return (getFlag('scope-limit') || '').trim() || undefined;
}

const materialIcons = './material-design-icons/iconfont/material-icons.css';
const materialFont = './material-design-icons/iconfont/*.{ttf,otf,woff2}';

const typographyCssPath = [
  './src/components/text.module.css',
  './src/components/heading.module.css',
  './src/components/label.module.css',
  './src/components/caption.module.css',
  './src/components/subheading.module.css',
];

const sources = [
  './src/tokens/*.css',
  './src/variables/*.css',
  materialIcons,
  './src/core/*.css',
  ...typographyCssPath,
  './src/components/*.css',
  './src/ai-components/*.css',
  './src/utils/*.css',
];

function clean() {
  return gulp.src('./dist/*', { allowEmpty: true }).pipe(cleaner());
}

function css() {
  return gulp
    .src(sources)
    .pipe(concat('index.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([postcssColorMod()]))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
}

/**
 * Same bundle as `css()`, with every selector confined to the scope roots so the sheet can be
 * loaded inside a host application without restyling it. Scoping runs before autoprefixer so
 * that any rule autoprefixer clones inherits the scope.
 */
function scopedCss() {
  return gulp
    .src(sources)
    .pipe(concat('scoped.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([postcssColorMod()]))
    .pipe(postcss([mdsScope({ scopes: getScopes(), limit: getScopeLimit() })]))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
}

function font() {
  return gulp.src([materialFont]).pipe(gulp.dest('./dist'));
}

exports.build = gulp.series(clean, gulp.parallel(css, scopedCss, font));

exports.css = css;
exports.scopedCss = scopedCss;
exports.clean = clean;

gulp.task('watch', () => {
  gulp.watch(sources, gulp.parallel(css, scopedCss));
});
