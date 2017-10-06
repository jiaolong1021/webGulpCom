/*
 *   功能： gulp任务执行的默认路径
 *   主要插件：
 *       1. gulp                      ---        gulp基础组件
 *       2. del                       ---        删除文件
 *       3. minimist                  ---        解析参数选项变为json对象
 *       4. browser-sync              ---        搭建web服务器
 *
 * */

// node、npm版本检测
require('./gulp/check-versions')();

var gulp = require('gulp'),        // 基础库
	minimist = require('minimist'),
	del = require('del'),
	runSequence = require("run-sequence"),
	connect = require("gulp-connect"),
	nodemon = require("gulp-nodemon"),
	proxy = require("http-proxy-middleware"),
	opn = require("opn");

var knownOptions = {
    string: 'env',
    default: {
        env: 'production'
    }
};

// 引入配置参数
var options = minimist(process.argv.slice(2), knownOptions);
var config = require('./gulp/config.js')(options);

/* 引入独立任务模块, 建立多个任务 */
var taskBasePath = "./gulp/tasks/";
var htmlTask = require(taskBasePath + 'htmlTask'),
    cssTask = require(taskBasePath + 'cssTask'),
    scssTask = require(taskBasePath + 'scssTask'),
    scriptsTask = require(taskBasePath + 'scriptsTask'),
    imagesTask = require(taskBasePath + 'imagesTask'),
    spriteTask = require(taskBasePath + 'spriteTask'),
	othersTask = require(taskBasePath + 'othersTask'),
    pugTask = require(taskBasePath + 'pugTask');

gulp.task('html', function () {
    return htmlTask.html({}, config, connect);
});
gulp.task('script', function () {
    return scriptsTask.script({}, config, connect);
});
gulp.task('sprite', function () {
    return spriteTask.sprite(config, connect);
});
gulp.task('images', function () {
    return imagesTask.images({}, config, connect);
});
gulp.task('scss', function () {
    return scssTask.scss({}, config, connect);
});
gulp.task('css', function () {
    return cssTask.css({}, config, connect);
});
gulp.task('htmlInclude', function () {
    return htmlTask.htmlInclude({}, config, connect);
});
gulp.task('htmlIncludeWatch', ['htmlInclude'], function (done) {
	gulp.src(config.dist + "/**/*.html")
		.pipe(connect.reload());
	done();
});
/* 手机端雪碧任务 */
gulp.task('phoneSprite', function () {
    return spriteTask.phoneSprite(config, connect);
});
gulp.task('pug', function () {
    return pugTask.pugBuild({}, config, connect);
});
gulp.task('others', function () {
	return othersTask.others({}, config, connect);
});

/* 手机、web端的响应式页面服务器 */
gulp.task('phoneServe', function() {
    runSequence(['clean'], ['sprite', 'phoneSprite'], ['others', 'pug'], ['scss', 'images'], ['script', 'html', 'css'], function () {
    	/* 服务器 */
	    connect.server({
		    root: [config.dist],
		    port: config.connect.port,
		    livereload: true,
		    middleware: function(connect, opt) {    /* 通过 http-proxy-middleware 设置代理 */
			    return [
				    /*proxy('/schoolNotice',  {
					    target: 'http://localhost:8080',
					    changeOrigin:true
				    })*/
			    ]
		    }
	    });

	    gulp.watch(config.spriteConfig.spriteSrc + "/**/*.*", ['sprite']); // 监控雪碧图任务
	    gulp.watch(config.phoneSprite.spriteSrc + "/**/*.*", ['phoneSprite']);  // 监控手机雪碧图任务
	    gulp.watch(config.cssConfig.src, function (event) {cssTask.css(event, config, connect) });  // 监控css样式源文件
	    gulp.watch(config.scssConfig.scssSrc + "/**/*.scss", function (event) {scssTask.scss(event, config, connect) }); // 监控scss样式源文件
	    gulp.watch(config.imagesConfig.src, function (event) { imagesTask.images(event, config, connect); }); // 监控所有图片
	    gulp.watch(config.src + "/js/**/**", function (event) {scriptsTask.script(event, config, connect); }); // 监控js源文件
	    gulp.watch(config.htmlConfig.src, function (event) {htmlTask.html(event, config, connect);});   // 监控html源文件
	    gulp.watch(config.htmlConfig.ignore, ['htmlIncludeWatch']); // include模块内容监控
	    gulp.watch(config.pugConfig.src, function (event) {pugTask.pugBuild(event, config, connect);});   // 监控pug源文件
	    gulp.watch([config.pugConfig.ignore + "/**/**"], function (event) {pugTask.pugBuild({}, config, connect);});   // 监控pug模板文件
	    gulp.watch(config.dist + "/css/main/images/**/**").on('change', function () {connect.reload()});// 监控目标文件夹下雪碧变化
	    gulp.watch(config.others.src, function (event) {othersTask.others(event, config, connect);});
	    gulp.run('sprite');//解决雪碧图第一次生成错误问题
	    gulp.run('phoneSprite');//解决雪碧图第一次生成错误问题

	    /* 浏览器自动打开开始页面 */
	    opn("http://localhost:" + config.connect.port + "/index.html");
    });
});

//删除temp和dist下的所有文件 等同于 gulp.task('clean',function(){require('del')(['.tmp','dist'])});
gulp.task('clean', del.bind(null, config.cleanConfig.src, {
    force: true
}));

/* iChoice雪碧图任务 */
gulp.task('iChoice', function () {
    spriteTask.iChoice(config);
});