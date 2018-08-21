var fs = require("fs");
var _ = require('underscore');
var gulp = require('gulp');
var less = require('gulp-less');
var cdnify = require('gulp-cdnify');

var grename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var plumber = require('gulp-plumber');
var tap = require("gulp-tap");
var gutil = require('gulp-util');
var es = require('event-stream');
var replace = require("gulp-replace");
var base64 = require('gulp-base64');
var concat = require("gulp-concat");

var minifycss = require("gulp-minify-css");

var runSequence = require('run-sequence');

var scripts = require("./scripts");

var env = process.env.NODE_ENV || 'development';
var debug = false;
var isWin = /^win/.test(process.platform);

console.log("Running gulp in " + (debug ? "DEBUG" : "PRODUCTION") + " mode");

var dest = {
    css: "../build/css",
    html: "../build",
    fonts: "../build/fonts",
    images: "../build/images",
    vendor: "../build/vendor"
};

var src = {
    index: "src/index.html",
    fonts: [],
    images: ['src/ajax-loader.gif'],
    scripts: ["src/**/*.js"],
    entry: 'src/app.jsx',
    components: ["src/**/*.jsx"],
    less: ["src/app.less"],
    css: ["src/**/*.css"],
    sample: "sample_data.json"
};

var scriptParams = {
    dest: dest.html,
    target: 'all.js',
    extensions: [".js", ".jsx"],
    entry: src.entry,
    onRebundle: function () {
        runSequence('build_demo');
    }
};

gulp.task('scripts', function () {
    return scripts(_.defaults({watch: false, debug: debug}, scriptParams));
});

gulp.task('devScripts', function () {
    return scripts(_.defaults({watch: true, debug: debug}, scriptParams));
});

var sourcemap_init = function () {
    return sourcemaps.init();
};
var sourcemap_write = function () {
    return sourcemaps.write();
};

var maxEmbeddedFileSize = 500 * 1024;
gulp.task('less', function () {
    return gulp.src(src.less)
        .pipe(plumber())
        .pipe(if_(debug, sourcemap_init))
        .pipe(less())
        .pipe(if_(debug, sourcemap_write))
        .pipe(base64({
            exclude: [/.*dont_embed/],
            maxImageSize: maxEmbeddedFileSize,
            debug: true
        }))
        .pipe(gulp.dest(dest.css));
});

gulp.task('css', function () {
    return gulp.src(src.css)
        .pipe(plumber())
        .pipe(if_(debug, sourcemap_init))
        .pipe(less())
        .pipe(if_(debug, sourcemap_write))
        .pipe(base64())
        .pipe(gulp.dest(dest.css));
});

gulp.task("resources", ["less", "css", "vendor"], function () {
    return gulp.src([dest.css + "/**/*.css", dest.vendor + "/**/*.css"])
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(dest.html));
});

gulp.task("build_demo", function (cb) {
    gulp.src(src.index)
        .pipe(replace(/<!-- js -->/, function () {
            var script = fs.readFileSync(dest.html + "/all.js", 'utf8');
            return '<script type="text/javascript">' + script + '</script>';
        }))
        .pipe(replace(/<!-- css -->/, function () {
            var style = fs.readFileSync(dest.html + "/all.css", 'utf8');
            return '<style>' + style + '</style>';
        }))
        .pipe(grename('template.html'))
        .pipe(gulp.dest(dest.html))
        .on('end', function () {
            var exec = require('child_process').exec;
            var makeDemo = isWin ? "make_demo.bat" : 'bash ./make_demo.sh';
            exec(makeDemo, function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
        });
});

gulp.task('release', function () {
    debug = false;
    return runSequence(['resources', 'scripts'], 'build_demo');
});

gulp.task('default', function () {
    return runSequence(['resources', 'devScripts'], 'build_demo', 'watch');
});

gulp.task('rebuild_resources', function () {
    return runSequence('resources', 'build_demo');
});

gulp.task('watch', function () {
    gulp.watch(src.index, ['rebuild_resources']);
    gulp.watch(["src/**/*.less"], ['rebuild_resources']);
    gulp.watch(src.sample, ['rebuild_resources']);
});

var vendorModules = [];

function vendor(moduleName, modulePath, fn) {
    var module = function (path) {
        return gulp.src("node_modules/" + modulePath + "/**/" + path);
    };
    var moduleDest = dest.vendor + "/" + moduleName;
    vendorModules.push(moduleName);
    gulp.task(moduleName, function () {
        return fn(module, moduleDest);
    });
}

//vendor('bootstrap', "bootstrap/dist", function (bootstrap, dest) {
//    return es.concat(
//        bootstrap("css/bootstrap.css")
//            .pipe(base64())
//            .pipe(gulp.dest(dest)),
//        bootstrap("fonts/!*").pipe(gulp.dest(dest))
//    );
//});

//vendor('font-awesome', "font-awesome", function (fontAwesome, dest) {
//    return es.concat(
//        fontAwesome("css/font-awesome.css")
//            .pipe(base64())
//            .pipe(gulp.dest(dest)),
//        fontAwesome("fonts/!*").pipe(gulp.dest(dest))
//    );
//});

/*vendor('react-widgets', "react-widgets/dist", function (widgets, dest) {
    return es.concat(
        widgets("*.css")
            .pipe(base64())
            .pipe(gulp.dest(dest))
    );
});*/

vendor('griddle', "griddle-react/dist", function (griddle, dest) {
    return es.concat(
        griddle("*.css")
            .pipe(base64())
            .pipe(gulp.dest(dest))
    );
});

//vendor('c3', "c3", function (c3, dest) {
//    return es.concat(
//        c3("c3.min.css")
//            .pipe(base64())
//            .pipe(gulp.dest(dest))
//    );
//});

gulp.task('vendor', vendorModules);

var if_ = function (check, filter) {
    if (check) {
        return filter();
    } else {
        return gutil.noop();
    }
};