/**********************************************************
*   功能： 用于HTML页面的编译、嵌入
*   主要插件：
*       1. gulp-changed              ---        监控文件，过滤未改动的文件
*       2. gulp-content-includer     ---        替换html中includer引用的公用模块
*       3. gulp-jsbeautifier         ---        美化html、css、js代码
*       4. gulp-if：                 ---        有条件的运行gulp任务
*       5. del                       ---        删除文件
*       6. vinyl-paths               ---        动态获取文件路径
*
**********************************************************/

const gulp = require("gulp"),
    changed = require("gulp-changed"),
    contentInclude = require("gulp-content-includer"),
    beautifier = require("gulp-jsbeautifier"),
    del = require("del"),
    vinylPaths = require('vinyl-paths'),
    gulpIf = require("gulp-if");

// 工具模块
const util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 *   html编译
 */
function html(event, config, connect) {
    let htmlConfig = config.htmlConfig;

    if(event.type === undefined){
        // 刚启动时，html全部拷贝
        return gulp.src(htmlConfig.src)
            .pipe(plumberHandle())      // 阻止异常引起程序中断
            .pipe(contentInclude({
                deepConcat: true,
                includerReg: /<!\-\-\s{0,100}include\s+"([^"]+)"\s{0,100}\-\->/g
            }))
            .pipe(beautifier()) // 美化代码
            .pipe(gulp.dest(htmlConfig.dist))   // 输出到目的文件夹
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());
    }else if(event.type === "added" || event.type === "changed" || event.type === "renamed"){
        // html新增、有改变
        return gulp.src(htmlConfig.src)
            .pipe(plumberHandle())      // 阻止异常引起程序中断
            .pipe(contentInclude({
                deepConcat: true,
                includerReg: /<!\-\-\s{0,100}include\s+"([^"]+)"\s{0,100}\-\->/g
            }))
            .pipe(changed(htmlConfig.dist))
            .pipe(beautifier()) // 美化代码
            .pipe(gulp.dest(htmlConfig.dist))   // 输出到目的文件夹
	        .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());
    }else if(event.type === "deleted"){
        // 删除html
        let delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist);  // 对删除路径处理
        return gulp.src(delPath)
	        .pipe(plumberHandle())
            .pipe(vinylPaths(del))
            .pipe(gulpIf(config.debug, msgHandle()))
            .pipe(connect.reload());
    }
}

/*
 *
 *  HTML内容替换
 * */
function htmlInclude(event, config, connect) {
    let htmlConfig = config.htmlConfig;

    // 执行拷贝
    return gulp.src(htmlConfig.src)
        .pipe(contentInclude({
            deepConcat: true,
            includerReg: /<!\-\-\s{0,100}include\s+"([^"]+)"\s{0,100}\-\->/g
        }))
        .pipe(beautifier()) // 美化代码
	    .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(gulp.dest(htmlConfig.dist));
}

module.exports = {
    html: html,
    htmlInclude: htmlInclude
};


















