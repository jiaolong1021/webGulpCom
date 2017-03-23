/*
 *   功能： gulp任务执行的默认路径
 *   主要插件：
 *       1. gulp                      ---        gulp基础组件
 *       2. del                       ---        删除文件
 *       3. minimist                  ---        解析参数选项变为json对象
 *       4. browser-sync              ---        搭建web服务器
 *
 * */
require('./gulp/check-versions')();

var gulp = require('gulp'),        // 基础库
    minimist = require('minimist'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    runSequence = require("run-sequence"),
    reload = browserSync.reload;

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
    return htmlTask.html({}, config, reload);
});
gulp.task('script', function () {
    return scriptsTask.script({}, config, reload);
});
gulp.task('sprite', function () {
    return spriteTask.sprite(config, reload);
});
gulp.task('images', function () {
    return imagesTask.images({}, config, reload);
});
gulp.task('scss', function () {
    return scssTask.scss({}, config, reload);
});
gulp.task('css', function () {
    return cssTask.css({}, config, reload);
});
gulp.task('htmlInclude', function () {
    return htmlTask.htmlInclude({}, config, reload);
});
gulp.task('htmlIncludeWatch', ['htmlInclude'], function (done) {
	reload();
	done();
});
/* 手机端雪碧任务 */
gulp.task('phoneSprite', function () {
    return spriteTask.phoneSprite(config, reload);
});
gulp.task('pug', function () {
    return pugTask.pugBuild({}, config, reload);
});
gulp.task('others', function () {
	return othersTask.others({}, config, reload);
});

// 启动web开发环境的服务
gulp.task('serve', function() {
	runSequence(['clean'], ['sprite'], ['scss', 'pug', 'others'], ['images', 'script', 'html', 'css'], function () {
		browserSync.init(config.browserSync.development);

		gulp.watch(config.spriteConfig.spriteSrc + "/**/*.*", ['sprite']); // 监控雪碧图任务
		gulp.watch(config.scssConfig.scssSrc + "/**/*.scss", ['scss']); // 监控scss样式源文件
		gulp.watch(config.cssConfig.src, function (event) {cssTask.css(event, config, reload); });  // 监控css样式源文件
		gulp.watch(config.imagesConfig.src, function (event) { imagesTask.images(event, config, reload); }); // 监控所有图片
		gulp.watch(config.src + "/js/**/**", function (event) {scriptsTask.script(event, config, reload); }); // 监控js源文件
		gulp.watch(config.htmlConfig.src, function (event) {htmlTask.html(event, config, reload);});   // 监控html源文件
		gulp.watch([config.pugConfig.src], function (event) {pugTask.pugBuild(event, config, reload);});   // 监控pug源文件
		gulp.watch(config.htmlConfig.ignore, ['htmlIncludeWatch']); // include模块内容监控
		gulp.watch([config.dist + "/css/main/images/**/**"]).on('change', reload);// 监控目标文件夹下雪碧变化
		/*gulp.watch(config.dist + "/!**!/!*.html").on('change', reload);*/
		gulp.watch(config.others.src, function (event) {othersTask.others(event, config, reload);});
		gulp.run('sprite'); //解决雪碧图第一次生成错误问题
	});
});

/* 编辑同时适应手机、web端的响应式页面服务器 */
gulp.task('phoneServe', function() {
    runSequence(['clean'], ['sprite', 'phoneSprite'], ['others', 'pug'], ['scss', 'images'], ['script', 'html', 'css'], function () {
	    browserSync.init(config.browserSync.development);

	    gulp.watch(config.spriteConfig.spriteSrc + "/**/*.*", ['sprite']); // 监控雪碧图任务
	    gulp.watch(config.phoneSprite.spriteSrc + "/**/*.*", ['phoneSprite']);  // 监控手机雪碧图任务
	    gulp.watch(config.cssConfig.src, function (event) {cssTask.css(event, config, reload) });  // 监控css样式源文件
	    gulp.watch(config.scssConfig.scssSrc + "/**/*.scss", function (event) {scssTask.scss(event, config, reload) }); // 监控scss样式源文件
	    gulp.watch(config.imagesConfig.src, function (event) { imagesTask.images(event, config, reload); }); // 监控所有图片
	    gulp.watch(config.src + "/js/**/**", function (event) {scriptsTask.script(event, config, reload); }); // 监控js源文件
	    gulp.watch(config.htmlConfig.src, function (event) {htmlTask.html(event, config, reload);});   // 监控html源文件
	    gulp.watch(config.htmlConfig.ignore, ['htmlIncludeWatch']); // include模块内容监控
	    gulp.watch(config.pugConfig.src, function (event) {pugTask.pugBuild(event, config, reload);});   // 监控pug源文件
	    gulp.watch([config.pugConfig.ignore + "/**/**"], function (event) {pugTask.pugBuild({}, config, reload);});   // 监控pug模板文件
	    gulp.watch(config.dist + "/css/main/images/**/**").on('change', reload);// 监控目标文件夹下雪碧变化
	    /*gulp.watch(config.dist + "/!**!/!*.html").on('change', reload);*/
	    gulp.watch(config.others.src, function (event) {othersTask.others(event, config, reload);});
	    gulp.run('sprite');//解决雪碧图第一次生成错误问题
	    gulp.run('phoneSprite');//解决雪碧图第一次生成错误问题
    });
});

//删除temp和dist下的所有文件 等同于 gulp.task('clean',function(){require('del')(['.tmp','dist'])});
gulp.task('clean', del.bind(null, config.cleanConfig.src, {
    force: true
}));

/* iChoice雪碧图 */
gulp.task('iChoice', function () {
    spriteTask.iChoice(config);
});