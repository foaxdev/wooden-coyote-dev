"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const pug = require("gulp-pug");
const babel = require('gulp-babel');
const terser = require("gulp-terser");

gulp.task("css", () => {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("source/css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("html", () => {
  return gulp.src("source/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("build"))
});

gulp.task("js", () => {
  return gulp.src("source/js/*.js")
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

gulp.task("server", () => {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.scss", gulp.series("css"));
    gulp.watch("source/js/*.js", gulp.series("js", "copy", "refresh"));
    gulp.watch("source/**/*.pug", gulp.series("html", "refresh"));
});


gulp.task("images", () => {
    return gulp.src("source/img/**/*.{svg}")
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("source/img"));
});

gulp.task("webp", () => {
    return gulp.src("source/img/*.png")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("source/img"));
});

gulp.task("copy", () => {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/*.js",
        "source/css/*.css",
        "source/*.html",
        "source/**/*.png",
        "source/manifest.json"
    ], {
        base: "source"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", () => {
    return del("build");
});

gulp.task("build", gulp.series(
    "clean",
    "copy",
    "css"
));

gulp.task("refresh", (done) => {
    server.reload();
    done();
});

gulp.task("start", gulp.series(
    "clean",
    "copy",
    "css",
    "js",
    "html",
    "server"
));
