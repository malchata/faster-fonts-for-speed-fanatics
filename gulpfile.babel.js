// Modules
import gulp from "gulp";
import util from "gulp-util";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import autorem from "autorem";
import htmlmin from "gulp-htmlmin";
import livereload from "gulp-livereload";

const moduleOpts = {
  autoprefixer: {
    browsers: ["last 2 versions", "> 5%", "ie >= 10", "iOS >= 8"]
  },
  htmlmin: {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true
  }
};

// CSS Build Task
const buildCSS = ()=>{
  const src = "htdocs/css/theme/source/speed.scss";
  const dest = "htdocs/css/theme";

  return gulp.src(src)
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(moduleOpts.autoprefixer), autorem(), cssnano()]))
    .pipe(gulp.dest(dest))
    .pipe(livereload());
};

exports.buildCSS = buildCSS;

// HTML Task (Triggers Reloading Only)
const minifyHTML = ()=>{
  const src = "htdocs/index.src.html";
  const dest = "htdocs/";

  return gulp.src(src)
    .pipe(plumber())
    .pipe(rename("index.html"))
    .pipe(htmlmin(moduleOpts.htmlmin))
    .pipe(gulp.dest(dest))
    .pipe(livereload());
};

exports.minifyHTML = minifyHTML;

// Watch Task
const watch = ()=>{
  livereload.listen();
  gulp.watch("htdocs/css/**/*.scss", buildCSS);
  gulp.watch("htdocs/index.src.html", minifyHTML);
};

exports.default = watch;
exports.build = gulp.parallel(buildCSS, minifyHTML);
