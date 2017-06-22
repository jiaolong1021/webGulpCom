/*********************************************************
*   功能： 用于HTML页面的编译
*   主要插件：
*       1. gulp-changed              ---        监控文件，过滤未改动的文件
*       2. gulp-pug                  ---        将pug后缀文件处理成html
*       3. del                       ---        删除文件
*       4. gulp-jsbeautifier         ---        美化html、css、js代码
*       5. vinylPaths                ---        动态获取文件路径
*       6. gulp-if                   ---        有条件的运行gulp任务
*
**********************************************************/

const gulp = require("gulp"),
    changed = require("gulp-changed"),
    pug = require("gulp-pug"),
    beautifier = require("gulp-jsbeautifier"),
    del = require("del"),
    vinylPaths = require('vinyl-paths'),
    gulpIf = require("gulp-if");

// 工具模块
const localUtil = require("./util"),
    plumberHandle = localUtil.plumberHandle,
    msgHandle = localUtil.msgTipHandle;

/*
*   pug编译
* */
function pugBuild(event, config, connect) {
	let pugConfig = config.pugConfig;

    if(pugConfig.pugUse){
        if(event.type === undefined){
            // 刚启动时，pug编译
            return gulp.src(pugConfig.src)
                .pipe(plumberHandle())
                .pipe(pug({}))
                .pipe(beautifier())
                .pipe(gulp.dest(pugConfig.dist))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(connect.reload());
        }else if(event.type === "added" || event.type === "changed" || event.type === "renamed"){
            // pug新增、有改变
            return gulp.src(pugConfig.src)
                .pipe(plumberHandle())
                //.pipe(changed(pugConfig.dist))
                .pipe(pug({}))
                .pipe(beautifier())
                .pipe(gulp.dest(pugConfig.dist))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(connect.reload());
        }else if(event.type === "deleted"){
            // 删除pug对应的html文件
            var delPath = event.path.replace(/\\/g, "/").replace(config.src, config.dist).replace(".pug", ".html");  // 对删除路径处理
            return gulp.src(delPath)
	            .pipe(plumberHandle())
                .pipe(vinylPaths(del))
                .pipe(gulpIf(config.debug, msgHandle()))
                .pipe(connect.reload());
        }
    }
}

module.exports = {
    pugBuild: pugBuild
};


















