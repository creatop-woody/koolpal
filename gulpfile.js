const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const minimist = require('minimist');
const extender = require('gulp-html-extend');
const gulpBabel = require('gulp-babel');
const tailwindcss = require('tailwindcss'); // 加入 Tailwind

// 設定環境選項
const envOptions = {
  string: 'env',
  default: { env: 'development' },
};
const options = minimist(process.argv.slice(2), envOptions);
console.log(options);

// 清理目標資料夾
gulp.task('clean', () => {
  return gulp.src(['./assets', './.tmp'], { read: false, allowEmpty: true }).pipe($.clean());
});

// 處理 HTML
gulp.task('html', () => {
  return gulp
    .src(['./src/**/!(_)*.html'])
    .pipe(extender({ annotations: false, verbose: false }))
    .pipe(gulp.dest('./assets'))
    .pipe(browserSync.stream());
});

// 編譯 JavaScript 並合併為 app.js
gulp.task('babel', () => {
  return gulp
    .src(['./src/js/app/*.js'])
    .pipe($.plumber())
    .pipe($.concat('app.js'))
    .pipe(
      gulpBabel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(
      $.if(
        options.env === 'production',
        $.uglify({
          compress: { drop_console: true },
        })
      )
    )
    .pipe(gulp.dest('./assets/js'))
    .pipe(browserSync.stream());
});

// 處理 Vendor JavaScript
gulp.task('vendorJs', () => {
  const vendorFiles = [
    './src/js/vendor/*.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/aos/dist/aos.js',
    './node_modules/swiper/swiper-bundle.js',
  ];

  return gulp
    .src(vendorFiles)
    .pipe($.order(['jquery.js']))
    .pipe($.concat('vendor.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./assets/js'));
});

// 編譯 SCSS 並壓縮，並加入 Tailwind CSS
gulp.task('sass', () => {
  return gulp
    .src('./src/css/*.scss')
    .pipe($.plumber())
    .pipe(
      $.sass({
        outputStyle: 'nested',
      }).on('error', $.sass.logError)
    )
    .pipe($.postcss([
      tailwindcss('./tailwind.config.js'), 
      autoprefixer({ overrideBrowserslist: ['last 5 versions'], grid: false })
    ]))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream());
});

// 壓縮或直接複製圖片
gulp.task('imageMin', () => {
  return gulp
    .src('./src/img/**/*')
    .pipe($.if(options.env === 'production', $.imagemin())) // 僅在生產環境壓縮圖片
    .pipe(gulp.dest('./assets/img'));
});

// 啟動 BrowserSync
gulp.task('browserSync', (done) => {
  browserSync.init({
    server: { baseDir: './assets' },
    reloadDebounce: 2000,
  });
  done();
});

// 監視文件變更
gulp.task('watch', () => {
  gulp.watch(['./src/css/**/*.sass', './src/css/**/*.scss'], gulp.series('sass'));
  gulp.watch(['./src/**/*.html'], gulp.series('html', 'sass'));
  gulp.watch(['./src/js/**/*.js'], gulp.series('babel'));
  gulp.watch('tailwind.config.js', gulp.series('sass'));
});

// 設定 build 任務
gulp.task('build', gulp.series('clean', 'html', 'sass', 'babel', 'vendorJs', 'imageMin'));

// 設定預設任務，運行 BrowserSync 和 watch
gulp.task('default', gulp.series('build', gulp.parallel('browserSync', 'watch')));
