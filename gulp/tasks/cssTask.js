/**********************************************************
*     功能： 用于CSS样式编译
*     主要插件：
*       1. gulp：             ---   gulp主文件
*       2. gulp-changed:      ---   监控文件，过滤未改动的文件
*       3. gulp-if：          ---   有条件的运行gulp任务
*       4. vinyl-paths        ---   获取文件路径
*       5. del                ---   删除文件
 *********************************************************/

const gulp = require('gulp'),
    changed = require('gulp-changed'),
    del = require("del"),
    gulpIf = require("gulp-if"),
    vinylPaths = require('vinyl-paths');


// 工具模块
const util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 * css下的css文件处理
 * */
function css(event, config, reload) {
	let cssConfig = config.cssConfig;
    // 复制css文件，包括层级
    if(event.type === undefined){
        return gulp.src(cssConfig.src)
            .pipe(plumberHandle())
            .pipe(gulp.dest(cssConfig.dist))
	        .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    } else if(event.type === "added" || event.type === "changed" || event.type === "renamed"){
        return gulp.src(cssConfig.src)
            .pipe(plumberHandle())
            .pipe(changed(cssConfig.dist))
            .pipe(gulp.dest(cssConfig.dist))
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    }else if(event.type === "deleted"){
        let delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist);  // 对删除路径处理
        return gulp.src(delPath)
            .pipe(vinylPaths(del))
	        .pipe(plumberHandle())
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(reload({stream: true}));
    }
}

module.exports = {
    css: css
};
