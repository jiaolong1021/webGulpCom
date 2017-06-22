/*********************************************************
*    功能： 用于将scss文件编译成css样式文件
*    主要插件：
*       1. gulp-sass：        ---   sass/scss编译
*       2. gulp-plumber：     ---   专门为gulp而生的错误处理库
*       4. gulp-csscomb       ---   格式化css
*       5. gulp-postcss       ---   为生成的css样式添加适合各种浏览器的前缀
*       6. gulp-if            ---   有条件的运行gulp任务
*********************************************************/

var gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    sass = require('gulp-sass'),
    cssComb = require("gulp-csscomb"),
	postcss = require('gulp-postcss'),
    gulpIf = require("gulp-if");

// 工具模块
var util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 * scss处理(所有scss汇入main*.scss，然后编译成main*.css)
 * @param event
 * @param config
 * @param connect
 */
function scss(event, config, connect) {
    var scssConfig = config.scssConfig;

    return gulp.src(scssConfig.scssMain)   // sass文件编译成css
        .pipe(sass.sync(scssConfig.sassOptions).on('error', sass.logError))
        .pipe(cssComb())
        .pipe(postcss([autoprefixer(scssConfig.prefixOptions)]))
	    .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(gulp.dest(scssConfig.cssDist))
        .pipe(connect.reload());
}

module.exports = {
    scss: scss
};
