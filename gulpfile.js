'use strict';
/////////////////////////////////////////////////////////////////////////////
// GULP PLUGINS
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    ignore = require('gulp-ignore'),
    imageop = require('gulp-image-optimization'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;
    var modRewrite  = require('connect-modrewrite');

/////////////////////////////////////////////////////////////////////////////
// GULP PATHS
var path = {
    src: {
        application: 'src/app/**/*.*',
        root: 'src/*.*',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        css: 'src/assets/css/**/*.scss',
        js: 'src/assets/js/**/*.*'
    },
    build: {
        application: 'build/app/',
        root: 'build/',
        img: 'build/assets/img/',
        fonts: 'build/assets/fonts/',
        css: 'build/assets/cssTest/',
        cssSource: 'build/assets/css/',
        js: 'build/assets/js/'
    },
    watch: {
        application: 'src/app/**/*.*',
        root: 'src/**/*.*',
        img: 'src/assets/img/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        css: 'src/assets/css/**/*.scss',
        js: 'src/assets/js/**/*.*'
    },
    clean: 'build/'
};


/////////////////////////////////////////////////////////////////////////////
// PRINT ERRORS
function printError(error) {
    console.log(error.toString());
    this.emit('end');
}

/////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVE
var config = {
    server: {
        baseDir: "./build",
        middleware: [
                modRewrite([
                    '!\\.\\w+$ /index.html [L]'
                ])
            ]
    },
    files: ['./build/**/*'],
    tunnel: false,
    host: 'localhost',
    port: 888,
    notify: false,
    logPrefix: "frontend",
    watchTask: true
};

gulp.task('serve', function () {
    setTimeout(function () {
        browserSync(config);
    }, 5000)
});

/////////////////////////////////////////////////////////////////////////////
// application BUILD
gulp.task('application:build', function () {
    return gulp.src(path.src.application)
        .pipe(ignore.exclude(['*___jb_tmp___', '_header.html', '_footer.html', '_top-menu.html', '_left-menu.html']))
        .pipe(rigger())
        .on('error', printError)
        .pipe(gulp.dest(path.build.application))
        .pipe(reload({stream: true}));
});

gulp.task('root:build', function () {
    return gulp.src(path.src.root)
        .pipe(ignore.exclude(['*___jb_tmp___', 'index.php', 'MAMP-PRO-Logo.png']))
        .pipe(rigger())
        .on('error', printError)
        .pipe(gulp.dest(path.build.root))
        .pipe(reload({stream: true}));
});


/////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT BUILD
gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

/////////////////////////////////////////////////////////////////////////////
// STYLES BUILD
gulp.task('css:build', function () {
    return gulp.src(path.src.css)
        .pipe(sass({outputStyle: 'expanded', indentWidth: 4}))
        .on('error', printError)
        .pipe(autoprefix({
            browsers: ['last 30 versions', '> 1%', 'ie 9'],
            cascade: true
        }))
        .pipe(ignore.exclude('mixins.css'))
        .pipe(gulp.dest(path.build.cssSource))
        .pipe(ignore.exclude('main.css'))
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
});


/////////////////////////////////////////////////////////////////////////////
// IMAGES BUILD
gulp.task('img:build', function (cb) {
    gulp.src(path.src.img)
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .on('error', printError)
        .pipe(gulp.dest(path.build.img))
        .on('end', cb)
});

/////////////////////////////////////////////////////////////////////////////
// FONTS BUILD
gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

/////////////////////////////////////////////////////////////////////////////
// BUILD ALL
gulp.task('build', [
    'application:build',
    'root:build',
    'fonts:build',
    'img:build',
    'css:build',
    'js:build'
]);

/////////////////////////////////////////////////////////////////////////////
// WATCH ALL
gulp.task('watch', function () {
    watch([path.watch.application], function (event, cb) {
        gulp.start('application:build');
    });
    watch([path.watch.root], function (event, cb) {
        gulp.start('root:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.css], function (event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
});

/////////////////////////////////////////////////////////////////////////////
// CLEAN PRODUCTION
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

/////////////////////////////////////////////////////////////////////////////
// DEFAULT TASK
gulp.task('default', ['build', 'serve', 'watch']);
