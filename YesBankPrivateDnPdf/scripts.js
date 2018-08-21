var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var watchify = require("watchify");
var babelify = require("babelify");
var grename = require('gulp-rename');
var _ = require('underscore');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var util = require("util");

module.exports = function scripts(opts) {
    var args = {
        debug: opts.debug,
        extensions: opts.extensions,
        entries: [opts.entry]
    };
    var stream;
    if (opts.watch) {        
        args = _.extend(args, watchify.args);
        stream = watchify(browserify(args)).transform(babelify);
        stream.on('update', function () {
            var start = new Date();
            console.log('Starting scripts...');
            return rebundle().on('end', function () {
                var end = new Date();
                var seconds = (end - start) / 1000;
                console.log('Finished scripts after ' + Math.round(seconds * 100) / 100 + ' s');
                if (opts.onRebundle) opts.onRebundle();
            });
        });
    } else {
        stream = browserify(args).transform(babelify);
    }
    function rebundle() {
        var s = stream.bundle()
            .on('error', function (err) {
                console.log(err.message);
                this.emit('end');
            })
            .pipe(source(opts.entry))
            .pipe(grename(opts.target));
        if (!opts.debug) {
            s.pipe(streamify(uglify().on('error', function (err) {
                console.log(util.inspect(err));
                this.emit('end');
            })));
        }
        return s.pipe(gulp.dest(opts.dest));
    }

    return rebundle();
};
