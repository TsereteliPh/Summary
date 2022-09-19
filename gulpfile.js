const gulp = require('gulp');
const del = require('del');
const less = require('gulp-less');
const concat = require('gulp-concat');
const sourcemap = require('gulp-sourcemaps');
const cleanCss =  require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const autoPrefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

const paths = {
    styles: {
        src: 'src/less/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/scripts/'
    },
    img: {
        src: 'src/img/**/*.{jpg,png,svg}',
        dest: 'dist/img/'
    }
};

//Функция для очистки финальной папки

function clean() {
    return del(['dist/**', '!dist/*.html', '!dist/img/**', '!dist/normalize/**', '!dist/fonts/**']);
}

//Функция обработки стилей

function styles() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemap.init())
    .pipe(concat('main.less'))
    .pipe(less())
    .pipe(autoPrefixer())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(cleanCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}

//Функция обработки скриптов

function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemap.init())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
}

//Функция обработки изображений

function imageCompress() {
    return gulp.src(paths.img.src)
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 80}),
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.svgo({
            plugins: [{removeViewBox: false}]
        })
    ]))
    .pipe(gulp.dest(paths.img.dest))
}

//Функция - наблюдатель

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

//Добавляем переменную в которой описана вся сборка

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.imageCompress = imageCompress;
exports.build = build;
exports.default = build;