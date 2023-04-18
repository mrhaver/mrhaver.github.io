const gulp          = require('gulp');
const server        = require('browser-sync').create();
const pug           = require('gulp-pug');
const notify        = require('gulp-notify');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const perfectionist = require('perfectionist');
const minify        = require('gulp-clean-css');
const rename        = require('gulp-rename');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');
const rimraf        = require('rimraf');

// Paths
var Paths = {
    DIST:  'dist',
    PUG:   'app/*.pug',
    JS:    'app/assets/js/custom/',
    B_JS:  'app/assets/js/bootstrap/',
    CSS:   'app/assets/css/',
    PHP:   'app/assets/php/',
    IMG:   'app/assets/images/',
    FONTS: 'app/assets/fonts/**/*.*',
    VIDEO: 'app/assets/video/**/*.*'
}

// Pug
gulp.task('pug', function() {
    return gulp.src(Paths.PUG)
        .pipe(pug({
            pretty:  '    ',
            doctype: 'html'
        }))
        .on('error', notify.onError())
        .pipe(gulp.dest((Paths.DIST)))
});

// SCSS
gulp.task('scss', function () {

    var processors = [
        autoprefixer(),
        perfectionist({
            maxAtRuleLength: false,
            maxSelectorLength: 1
        })
    ];

    return gulp.src('app/assets/scss/template.scss')
        .pipe(sass())
        .on('error', notify.onError())
        .pipe(postcss(processors))
        .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
        .pipe(minify({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
});

// PHP
gulp.task('php', function() {
    return gulp.src(Paths.PHP + '*.php')
        .pipe(gulp.dest(Paths.DIST + '/assets/php/'))
});

// JQ
gulp.task('js-jquery', function() {
    return gulp.src([
        Paths.JS + 'jquery.min.js',
        Paths.JS + 'popper.min.js',
    ])
    .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/'))
});

// JS
gulp.task('js-plugins', function() {
    return gulp.src([
        Paths.JS + 'appear.js',
        Paths.JS + 'gmap3.js',
        Paths.JS + 'imagesloaded.pkgd.js',
        Paths.JS + 'isotope.pkgd.js',
        Paths.JS + 'jqBootstrapValidation.js',
        Paths.JS + 'jquery.superslides.js',
        Paths.JS + 'jquery.fitvids.js',
        Paths.JS + 'jquery.magnific-popup.js',
        Paths.JS + 'jquery.easypiechart.js',
        Paths.JS + 'owl.carousel.js',
        Paths.JS + 'twitterFetcher.js',
        Paths.JS + 'jquery.countTo.js',
        Paths.JS + 'jquery.sticky-kit.js',
        Paths.JS + 'jquery.singlePageNav.js',
        Paths.JS + 'jarallax.js',
        Paths.JS + 'jarallax-video.js',
        Paths.JS + 'submenu-fix.js',
        Paths.JS + 'prism.js',
    ])
    .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/'))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/'))
});

// Bootstrap JS
gulp.task('js-bootstrap', function() {
    return gulp.src([Paths.B_JS + '*.js', Paths.B_JS + '*.map'])
        .pipe(gulp.dest(Paths.DIST + '/assets/js/bootstrap/').on('error', notify.onError()))
});

// JS Core
gulp.task('js-core', function() {
    return gulp.src(Paths.JS + 'custom.js')
        .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/').on('error', notify.onError()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(Paths.DIST + '/assets/js/custom/'))
});

// CSS
gulp.task('css', function() {
    return gulp.src(Paths.CSS + '*.css')
        .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
        .pipe(concat('plugins.css'))
        .pipe(minify({keepBreaks: false}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(Paths.DIST + '/assets/css/'))
});

// Images
gulp.task('images', function() {
    return gulp.src(Paths.IMG + '**/*.*')
        .pipe(gulp.dest(Paths.DIST + '/assets/images/'))
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(Paths.FONTS)
        .pipe(gulp.dest(Paths.DIST + '/assets/fonts/'))
});

// Video
gulp.task('video', function() {
    return gulp.src(Paths.VIDEO)
        .pipe(gulp.dest(Paths.DIST + '/assets/video/'))
});

// Server
function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: 'dist/'
        }
    });
    done();
}

gulp.task('watch', function() {
    gulp.watch(('app/**/*.pug'), gulp.series(('pug'), reload));
    gulp.watch(('app/assets/scss/**/*.scss'), gulp.series(('scss'), reload));
    gulp.watch(Paths.JS + '*.js', gulp.series('js-jquery', reload));
    gulp.watch(Paths.B_JS + '*.js', gulp.series('js-bootstrap', reload));
    gulp.watch(Paths.JS + '*.js', gulp.series('js-plugins', reload));
    gulp.watch(Paths.JS + 'custom.js',  gulp.series('js-core', reload));
    gulp.watch(Paths.CSS + '*.css', gulp.series('css', reload));
    gulp.watch(Paths.IMG + '**/*.*', gulp.series('images', reload));
    gulp.watch(Paths.FONTS, gulp.series('fonts', reload));
    gulp.watch(Paths.PHP + '*.php', gulp.series('php', reload));
});

const dev = gulp.series(
    'pug',
    'scss',
    'js-jquery',
    'js-bootstrap',
    'js-plugins',
    'js-core',
    'css',
    'images',
    'fonts',
    'video',
    'php',
    serve,
    'watch'
);
exports.default = dev;

// Clean dist folder
gulp.task('clean', function (cb) {
    rimraf(Paths.DIST + '/*', cb);
});
