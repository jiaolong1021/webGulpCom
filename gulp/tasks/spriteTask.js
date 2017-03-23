/**********************************************************
 *   功能： 生成雪碧图
 *   主要插件：
 *       1. gulp.spritesmith          ---        将一个图片集转换成一个雪碧图，并生成对应样式
 *       2. gulp-changed              ---       监控文件，过滤未改动的文件
 *       3. gulp-rename               ---       重命名
 *       4. gulp-concat               ---       合并多个文件
 *       5. del                       ---        删除文件
 *       6. vinyl-paths               ---        动态获取文件路径
 *
 **********************************************************/

const gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    changed = require("gulp-changed"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    fs = require("fs"),
    gulpIf = require("gulp-if");

// 工具模块
const util = require("./util"),
    plumberHandle = util.plumberHandle,
    msgHandle = util.msgTipHandle;

/**
 * 生成雪碧图
 * @param config
 * @param reload
 */
function sprite(config, reload) {
    let spriteConfig = config.spriteConfig;
    let spriteData = gulp.src(spriteConfig.spriteSrc + "/**/*.*")
        .pipe(plumberHandle())
        .pipe(spritesmith(spriteConfig.spriteOptions));
    let imgStream = spriteData.img;
    let cssStream = spriteData.css;

    cssStream
        .pipe(plumberHandle())
        .pipe(rename("_icons.scss"))
        .pipe(gulp.dest(spriteConfig.spriteScss));

    return imgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(spriteConfig.spriteDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

/**
 * 手机端开启后生成雪碧图
 * @param config
 * @param reload
 */
function phoneSprite(config, reload) {
    let phoneSprite = config.phoneSprite;
    let phoneSpriteData = gulp.src(phoneSprite.spriteSrc + "/**/*.*")
        .pipe(plumberHandle())
        .pipe(spritesmith(phoneSprite.spriteOptions));
    let phoneImgStream = phoneSpriteData.img;
    let phoneCssStream = phoneSpriteData.css;

    phoneCssStream
        .pipe(plumberHandle())
        .pipe(rename("_icons-phone.scss"))
        .pipe(gulp.dest(phoneSprite.spriteScss));

    return phoneImgStream
        .pipe(plumberHandle())
        .pipe(gulp.dest(phoneSprite.spriteDist))
        .pipe(gulpIf(config.debug, msgHandle()))
        .pipe(reload({stream: true}));
}

/**
 * 生成iChoice雪碧图
 * @param config
 */
function iChoice(config) {
    let iChoiceConfig =  config.iChoiceConfig;
    let basePath = config.src.split('src')[0];
    let fileList = fs.readdirSync(basePath + "/iChoice");

    /* 同时生成多个雪碧图 */
    for(let i=0; i<fileList.length; i++){
        if(fileList[i].indexOf(".") === -1){
            iChoiceConfig.spriteOptions.imgName = "images/" + fileList[i] + ".png";
            // 除去图片、out目录的外的所有目录
            gulp.src(basePath + iChoiceConfig.spriteSrc + "/" + fileList[i] + "/*.*")
                .pipe(spritesmith(iChoiceConfig.spriteOptions))
                .pipe(gulp.dest(basePath + iChoiceConfig.spriteDist + "/" + fileList[i]));
        }
    }
}

module.exports = {
    sprite: sprite,
    iChoice: iChoice,
    phoneSprite: phoneSprite
};