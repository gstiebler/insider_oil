"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    sourcemaps  = require("gulp-sourcemaps"),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    browserSync = require('browser-sync').create();
    
//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {
    return gulp.src([
        "source/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(tslint({ }))
    .pipe(tslint.report("verbose"));
});

//******************************************************************************
//* BUILD
//******************************************************************************
var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-app", function() {
    return gulp.src([
            "src/**/**.ts",
            "src/**/**.tsx",
            "typings/main.d.ts/",
            "source/interfaces/interfaces.d.ts"
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest("out/"));
});

var tsTestProject = tsc.createProject("tsconfig.json");

gulp.task("build", function(cb) {
    runSequence(["build-app", "build-test"], cb);
});

//******************************************************************************
//* BUNDLE
//******************************************************************************
gulp.task("bundle", function() {
  
    var libraryName = "app";
    var mainTsFilePath = "out/app.js";
    var outputFolder   = "dist/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: true,
        standalone : libraryName
    });
    
    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputFolder));
});

//******************************************************************************
//* BUNDLE
//******************************************************************************
gulp.task("bundle-release", function() {
  
    var libraryName = "myapp";
    var mainTsFilePath = "out/app.js";
    var outputFolder   = "dist/";
    var outputFileName = libraryName + ".min.js";

    var bundler = browserify({
        debug: false,
        standalone : libraryName
    });
    
    return bundler.add(mainTsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(outputFolder));
});

//******************************************************************************
//* DEV SERVER
//******************************************************************************
gulp.task("watch", ["default"], function () {
    
    browserSync.init({
        server: "."
    });
    
    gulp.watch([ "source/**/**.ts", "test/**/*.ts"], ["default"]);
    gulp.watch("dist/*.js").on('change', browserSync.reload); 
});

//******************************************************************************
//* Bundle Release
//******************************************************************************
gulp.task("deploy", function (cb) {
    runSequence("build-app", "bundle-release", cb);
});

gulp.task("deploy-debug", function (cb) {
    runSequence("build-app", "bundle", cb);
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", function (cb) {
    runSequence("lint", "build", "test", "bundle", cb);
});