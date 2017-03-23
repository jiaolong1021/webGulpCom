/**
 * gulp配置参数
 */
const fs = require("fs");

let src = 'src';    //源码地址
let dist = 'dist';  // 临时开发目录
const publish = "publish";   // 发布目录

module.exports = function (options) {
    if(options.env === "publish"){
        dist = publish;
    }

    let basePath = options.path.replace(/\\/gi, "/").substr(options.path.replace(/\\/gi, "/").indexOf("project"), options.path.replace(/\\/gi, "/").length);
    src = basePath + src;
    dist = basePath + dist;

    // 浏览器服务设置  ----------------------------------------------------------
    let browserConfig = {
        development: {
            notify: false,
            open: "external",
            port: 8012,
            startPath: "index.html",
            // 在chrome、firefix下打开该站点
            // browser: ["google chrome", "firefox", "iexplore"],
            server: {
                baseDir: dist
            }
        },
        product: {
            notify: true,
            open: "external",
            port: 9012,
            startPath: "index.html",
            browser: ["google chrome", "firefox", "iexplore"],
            server: {
                baseDir: [src, dist]
            }
        }
    };

    // CSS 参数  -------------------------------------------------------
    let cssConfig = {
	    src: src + "/css/**/*.css",
	    dist: dist + "/css"
    };

	// SCSS 参数 --------------------------------------------------------
	let scssConfig = {
		scssSrc: src + "/css",
		scssMain: src + "/css/main.scss", //需要编译的scss
		cssDist: src + "/css",    // main css路径
		sassOptions: { //编译scss过程需要的配置，可以为空
			outputStyle: 'nested'
			//indentWidth: 0
			// includePaths: ['.'],
			// noCache: true
		},
		prefixOptions: { // 添加浏览器前缀时的配置，可以为空
			browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: false
		}
	};

    // JS 参数 --------------------------------------------------------
    let scriptConfig = {
        src: src + "/js/**/*.js",
        dist: dist + '/js',
	    others: [src + "/js/**/**", "!" + src + "/js/**/*.js"],
        isUglify: false, // 是否压缩
        isJshint: false, // 是否语法验证
        loadMaps: false,    // 是否生成
        isRename: false,
        rename: { // 重命名配置
            suffix: '.min' // 加后缀
        },
        loadMapsPath: './' // sourcemaps文件生成位置。不指定的情况下，sourcemaps信息直接写入到当前css文件中
    };

    // HTML 参数 --------------------------------------------------------
    let htmlConfig = {
	    src:  [src + "/**/*.html", "!" + src + "/module", "!" + src + "/module/**/*.*"],
        dist: dist,
        ignore: src + "/module/**/**"
    };

    // pug 参数 --------------------------------------------------------
    let pugConfig = {
	    pugUse: false,
	    src: [src + '/**/*.pug', "!" + src + "/modulepug", "!" + src + "/modulepug/**/**"],
	    dist: dist,
        ignore: [src + "/modulepug", src + "/modulepug/**/**"]
    };

    // images 参数 --------------------------------------------------------
    let imagesConfig = {
	    src: src + '/images/**/**',
        dist: dist + "/images"
    };

    // 雪碧图 生成设置 --------------------------------------------------------
    let spriteConfig = {
	    spriteSrc: src + '/icons',
	    spriteDist: dist,
        spriteScss: src + '/css',
	    spriteOptions: {
            imgName: 'images/sprite.png', //保存合并后图片的地址
            //cssName: 'sprite.css', //保存合并后对于css样式的地址
            cssName: 'sprite.css', //保存合并后对于css样式的地址
            padding: 5, //合并时两个图片的间距
            cssTemplate: './gulp/css.handlebars', // 输出雪碧图css模板
            cssVarMap: function(sprite) {
	            let cName = "";
	            let beginName = sprite.name;
	            let prefix = '.ico-';

	            if (beginName.indexOf('-hover') !== -1) {
		            cName = prefix + beginName.replace(/-hover$/gi, ':hover');
	            }
	            if (beginName.indexOf('-active') !== -1) {
		            cName = prefix + beginName.replace(/-active$/gi, '.active');
	            }
	            if (beginName.indexOf('-btn') !== -1) {
		            cName = '.hover-item:hover ' + prefix + beginName.replace(/-btn$/gi, '');
	            }
	            if (beginName.indexOf('-bactive') !== -1) {
		            cName = '.hover-item.active ' + prefix + beginName.replace(/-bactive$/gi, '');
	            }
	            if (beginName.indexOf('-bacthover') !== -1) {
		            cName = '.hover-item.active:hover ' + prefix + beginName.replace(/-bacthover$/gi, '');
	            }
	            if(cName !== ""){
		            sprite.name = cName;
	            }else{
		            sprite.name = prefix + beginName;
	            }
             }
        }
    };

    let phoneSprite = {
        spriteSrc: src + '/iconsphone',
        spriteTemp: '.tmp',
        spriteDist: dist,
        spriteScss: src + '/css',

        spriteOptions: {
            imgName: 'phoneSprite.png', //保存合并后图片的地址
            //cssName: 'sprite.css', //保存合并后对于css样式的地址
            cssName: 'phoneSprite.css', //保存合并后对于css样式的地址
            padding: 10, //合并时两个图片的间距
            cssTemplate: './gulp/phoneCss.handlebars', // 输出雪碧图css模板
            cssVarMap: function (sprite) {
	            let cName = "";
	            let beginName = sprite.name;
	            let prefix = '.ico-';

	            if (beginName.indexOf('-hover') !== -1) {
		            cName = prefix + beginName.replace(/-hover$/gi, ':hover');
	            }
	            if (beginName.indexOf('-active') !== -1) {
		            cName = prefix + beginName.replace(/-active$/gi, '.active');
	            }
	            if (beginName.indexOf('-btn') !== -1) {
		            cName = '.hover-item:hover ' + prefix + beginName.replace(/-btn$/gi, '');
	            }
	            if (beginName.indexOf('-bactive') !== -1) {
		            cName = '.hover-item.active ' + prefix + beginName.replace(/-bactive$/gi, '');
	            }
	            if (beginName.indexOf('-bacthover') !== -1) {
		            cName = '.hover-item.active:hover ' + prefix + beginName.replace(/-bacthover$/gi, '');
	            }

	            if(cName !== ""){
		            sprite.name = cName;
	            }else{
		            sprite.name = prefix + beginName;
	            }

                /* 1. 图片长宽、位置都除2 */
                sprite.width  = parseInt(sprite.width)/2;
                sprite.height = parseInt(sprite.height)/2;
                sprite.x = parseInt(sprite.x)/2;
                sprite.y = parseInt(sprite.y)/2;

                /* 2.如果总长宽有小数点，图片位置长宽减0.5  */
                let totalW = parseInt(sprite.total_width)/2;
                let totalH = parseInt(sprite.total_height)/2;
                if(totalW.toString().indexOf(".") !== -1){
                    if(sprite.x > 0){
                        sprite.x -= 0.5;
                    }
                    sprite.width += 1;
                }
                if(totalH.toString().indexOf(".") !== -1){
                    if(sprite.y > 0){
                        sprite.y -= 0.5;
                    }
                    sprite.height += 1;
                }

                /* 3. 将长宽位置都转变为整数 */
                let xFlag = false, yFlag = false;
                if(sprite.x.toString().indexOf(".") !== -1){
                    sprite.x = Math.floor(sprite.x);
                    xFlag = true;
                }
                if(xFlag){
                    if(sprite.width.toString().indexOf(".") !== -1){
                        sprite.width = Math.ceil(sprite.width);
                    }else{
                        sprite.width += 1;
                    }
                }else{
                    sprite.width = Math.ceil(sprite.width);
                }
                if(sprite.y.toString().indexOf(".") !== -1){
                    sprite.y = Math.floor(sprite.y);
                    yFlag = true;
                }
                if(yFlag){
                    if(sprite.height.toString().indexOf(".") !== -1){
                        sprite.height = Math.ceil(sprite.height);
                    }else{
                        sprite.height += 1;
                    }
                }else{
                    sprite.height = Math.ceil(sprite.height);
                }
            }
        }
    };

    /* icheckbox、iradio 参数 */
    let iChoiceConfig = {
        spriteSrc: 'ichoice/',
        spriteDist: 'ichoice-out/',
        spriteOptions: {
            imgName: 'images/sprite.png', //保存合并后图片的地址
            cssName: 'iChoice.css', //保存合并后对于css样式的地址
            padding: 10, //合并时两个图片的间距
            cssTemplate: 'gulp/iChoice.handlebars', // 输出雪碧图css模板
            cssVarMap: function (sprite) {
                // checked- -> .checked    ||     -disabeld  -> .disabled       ||       -checked-disabled -> .checked.disabled
                let checked = ".checked";
                let disabled = ".disabled";
                let cName = "";

                let beginName = sprite.name;
                if (beginName.indexOf('-checked') !== -1) {
                    cName = beginName.replace(/-checked/gi, checked);
                }
                if (beginName.indexOf('-disabled') !== -1) {
                    cName = beginName.replace(/-disabled/gi, disabled);
                }

                if (cName !== "") {
                    sprite.name = cName;
                }
            }
        }
    };

    // 清除 参数 --------------------------------------------------------
    let cleanConfig = { // 清除目录
        src: dist === publish ? [basePath + "dist", basePath + "publish/*.*",  basePath + "publish/js",  basePath + "publish/css", "!" + basePath + "publish/.svn"] : basePath + "dist"
    };

	// 其他文件拷贝 参数 --------------------------------------------------------
	let others = {
		src: [src + "/**/**",
			"!" + src + "/*.html",
			"!" + src + "/js",
			"!" + src + "/js/**/**",
			"!" + src + "/images",
			"!" + src + "/images/**/**",
			"!" + src + "/css",
			"!" + src + "/css/**/**",
			"!" + src + "/pug",
			"!" + src + "/pug/**/**",
			"!" + src + "/modulepug",
			"!" + src + "/modulepug/**/**",
			"!" + src + "/module",
			"!" + src + "/module/**/**",
			"!" + src + "/icons",
			"!" + src + "/icons/**/**",
			"!" + src + "/iconsphone",
			"!" + src + "/iconsphone/**/**"
		],
		dist: dist
	};

    /* 动态设置 */
    // 用于手机端同时包含字体图标、雪碧图
    function fsExistsSync(path) {
        try{
            fs.accessSync(path,fs.F_OK);
        }catch(e){
            return false;
        }
        return true;
    }

    if(!fsExistsSync(basePath + "src/sprite")){
        //web端雪碧图目录sprite不存在，则为纯手机端（只包含字体图标、手机端雪碧图）
        phoneSprite.spriteOptions.cssTemplate = './gulp/phoneFontCss.handlebars';
    }

    return {
        src: src,
        dist: dist,
        browserSync: browserConfig,
        cssConfig: cssConfig,
	    scssConfig: scssConfig,
        scriptConfig: scriptConfig,
	    spriteConfig: spriteConfig,
        iChoiceConfig: iChoiceConfig,
        phoneSprite: phoneSprite,
        htmlConfig: htmlConfig,
        pugConfig: pugConfig,
        imagesConfig: imagesConfig,
        cleanConfig: cleanConfig,
	    others: others,
        debug: false
    }
};
