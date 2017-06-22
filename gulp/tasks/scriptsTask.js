/*********************************************************
*   功能： 用于HTML页面的编译
*   主要插件：
*       1. gulp-rename：        ----       重命名
*       2. gulp-sourcemaps：    ----       一个信息文件，里面储存着位置信息
*       3. gulp-changed:        ----       监控文件，过滤未改动的文件
*       4. gulp-if：            ----       有条件的运行gulp任务
*       5. gulp-uglify:         ----       js压缩
*       6. gulp-babel:          ----       支持ECMAScript
*       7. gulp-jshint:         ----       js检查
*       8. del                  ----       删除文件
*       9. vinyl-paths          ----       动态获取文件路径
*********************************************************/

const gulp = require('gulp'),
	changed = require('gulp-changed'),
	gulpIf = require('gulp-if'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	/*babel = require('gulp-babel'),*/
	jshint = require('gulp-jshint'),
	/*beautifier = require("gulp-jsbeautifier"),*/
	del = require("del"),
	vinylPaths = require('vinyl-paths');

// 工具模块
const util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 * js目录下的文件处理
 *  --- js文件经过babel等方式处理，其他类型文件则直接拷贝
 * @param event
 * @param config
 * @param connect
 * */
function script(event, config, connect) {
    let scriptConfig = config.scriptConfig;
    if(event.type === undefined){
        gulp.src(scriptConfig.others)
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(gulp.dest(scriptConfig.dist));

        return gulp.src(scriptConfig.src)
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.init()))  // 是否生成sourcemaps, loadMaps为true，执行
            .pipe(plumberHandle())    // 防止管道中断
            //.pipe(babel({presets: ['es2015']}))  //  编译ES6格式代码
            .pipe(gulpIf(scriptConfig.isJshint, jshint()))    // javascript语法检验
            .pipe(gulpIf(scriptConfig.isJshint, jshint.reporter('default')))
            .pipe(gulpIf(scriptConfig.isJshint, jshint.reporter('fail')))
            .pipe(gulpIf(scriptConfig.isUglify, uglify()))  // javascript压缩
            .pipe(gulpIf(scriptConfig.isRename, rename(scriptConfig.rename))) // 重命名
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.write(scriptConfig.loadMapsPath))) // 生成sourcemaps
	        //.pipe(beautifier())
            .pipe(gulp.dest(scriptConfig.dist)) // 输入到目的文件夹
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());
    } else if(event.type === "added" || event.type === "changed" || event.type === "renamed"){
        gulp.src(scriptConfig.others)
            .pipe(plumberHandle())    // 防止管道中断
	        .pipe(changed(scriptConfig.dist))
            .pipe(gulp.dest(scriptConfig.dist));

        return gulp.src(scriptConfig.src)
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.init()))  // 是否生成sourcemaps, loadMaps为true，执行
            .pipe(plumberHandle())    // 防止管道中断
            .pipe(changed(scriptConfig.dist))
            //.pipe(babel({presets: ['es2015']}))  //  编译ES6格式代码
            .pipe(gulpIf(scriptConfig.isJshint, jshint()))    // javascript语法检验
            .pipe(gulpIf(scriptConfig.isJshint, jshint.reporter('default')))
            .pipe(gulpIf(scriptConfig.isJshint, jshint.reporter('fail')))
            .pipe(gulpIf(scriptConfig.isUglify, uglify()))  // javascript压缩
            .pipe(gulpIf(scriptConfig.isRename, rename(scriptConfig.rename))) // 重命名
            .pipe(gulpIf(scriptConfig.loadMaps, sourcemaps.write(scriptConfig.loadMapsPath))) // 生成sourcemaps
	        //.pipe(beautifier())
            .pipe(gulp.dest(scriptConfig.dist)) // 输入到目的文件夹
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());

    }else if(event.type === "deleted"){
        let delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist);  // 对删除路径处理
        return gulp.src(delPath)
	        .pipe(plumberHandle())
            .pipe(vinylPaths(del))
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());
    }
}

module.exports = {
    script: script
};
