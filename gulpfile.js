const {src, parallel, dest, series, watch} = require("gulp");
const browserSync = require("browser-sync").create();
const nunjucksRender = require("gulp-nunjucks-render");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');

let scssImports = ["src/scss/style.scss"]

const USE_TEMPLATES = true;
const HtmlTask = USE_TEMPLATES ? nunjucks:copyHtml;
const DEST_DIR = "./build";
const SASS_OUTPUT = "compressed"


// Cleanin up dir
function clean(cb){
    del([DEST_DIR]).then(() => cb());
}

// Simple images minify
function minifyImages(cb){
    src("src/assets/img/**/*")
    .pipe(imagemin())
    .pipe(dest(`${DEST_DIR}/assets/img`));
    cb();
}


// Minify html
function minifyHtml(cb){
    src("src/*.html")
    .pipe(dest(DEST_DIR))
    .pipe(
        htmlmin({
            collapseWhitespace: true
        })
    )
    .pipe(gulp.dest(DEST_DIR));
    cb();
}

// Minify nunjucks
function minifyNunjucks(cb){
    src("src/views/**/*.html")
    .pipe(
        nunjucksRender({
            path: ["src/templates/"]
        })
    )
    .pipe(
        htmlmin({
            collapseWhitespace:true
        })
    )
    .pipe(dest(DEST_DIR));
    cb();
}



// "Compile" nunjucks
function nunjucks(cb){
    src("src/views/*.html")
    .pipe(
        nunjucksRender({
            path: ["src/templates/"]
        })
    ).on("error", console.log)
    .pipe(dest(DEST_DIR));
    cb();
}


// "Compile" js
function compileJs(cb){
    src("src/js/*.js")
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(dest(`${DEST_DIR}/js`));
    cb();
}


// "Compile" SCSS
function compileScss(cb){
    src(scssImports)
        .pipe(sass({outputStyle:SASS_OUTPUT}).on("error", sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(`${DEST_DIR}/css`))
        .pipe(browserSync.stream());
    cb();
}

// Copy other assets
function copyFiles(cb){
    src([
        "!src/assets/img/**/*",
        "src/assets/**/*"
    ])
    .pipe(dest(`${DEST_DIR}/assets`))
    cb();
}

// Copies html files (when not in template mode)
function copyHtml(cb){
    src("src/views/**/*.html").pipe(dest(DEST_DIR))
    cb();
}


// Watch task
function watchTask(){
    browserSync.init({
        server: {
            baseDir: `${DEST_DIR}/`
        }
    });
    watch("src/scss/**/*.scss", compileScss);
    watch("src/js/**/*.js", compileJs).on("change", browserSync.reload);
    watch("src/assets/img/**/*", minifyImages).on("change", browserSync.reload);
    watch("src/views/**/*.html", HtmlTask).on("change", browserSync.reload);
    watch("src/assets/**/*", copyFiles).on("change", browserSync.reload);
    if(USE_TEMPLATES){
        watch("src/templates/**/*.html", nunjucks).on("change", browserSync.reload);
    }
}



exports.default = series(HtmlTask,minifyImages, compileScss, compileJs, copyFiles, watchTask);
exports.build = series(clean, parallel( USE_TEMPLATES ? minifyNunjucks : minifyHtml, minifyImages,compileScss, compileJs, copyFiles));