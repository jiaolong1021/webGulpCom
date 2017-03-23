###gulp插件说明
---
* stream-combiner2 ---> 将一系列的流合并成一个，**主要用于错误(error)监听**
* gulp-uglify ---> gulp中压缩文件
* vinyl-paths ---> 用在del中获取流中目录名
* watchify ---> 一个持续监视文件的改动，并且 只重新打包必要的文件 的 browserify 打包工具
* browserify --->
* vinyl-source-stream ---> 源码流(所有流合并后的目录)
* vinyl-buffer ---> 用于缓存数据
* gulp-util ---> gulp工具类(具有日志)
* gulp-sourcemaps --->  处理JS时，生成SourceMap
* lodash.assign ---> 合并json数据
* gulp-header ---> 流最前加入的数据
* gulp-footer ---> 流最后加入的数据
* gulp-concat ---> 合并gulp中的流
* gulp-jshint ---> js语法检测 安装（npm install jshint gulp-jshint --save-dev）
* gulp-cached ---> 缓存更改过的流
* gulp-remember ---> 将文件放回到流
* run-sequence ---> 依次运行一系列的gulp任务
* gulp-tap ---> 分流接头（能够过滤流、或对流进行处理。）
* event-stream --->
* gulp-changed ---> 只让更改过的文件传递过管道
* gulp-jscs ---> 校验JavaScript代码样式
* gulp-if ---> gulp流判断
* minimist ---> 解析参数选项
* gulp-sass ---> sass相关
* gulp-watch ---> 监控文件改变
* gulp-rename ---> 重命名
* merge-stream ---> 合并流
* browser-sync ---> 创建服务器(expand-range)
* gulp-coffee ---> 编译coffee代码为Js代码，使用coffeescript必备
* jshint-stylish ---> JSHint样式报告
* lazypipe ---> 合并一系列流
* require-dir ---> 任务分离到多个文件
* del ---> 删除文件以及文件夹
* coffee-script ---> gulpfile默认采用js后缀，如果要使用gulpfile.coffee来编写，那么需要此模块
* gulp-nodemon ---> 自动启动/重启你的node程序，开发node服务端程序必备
* yargs ---> 用于获取启动参数，针对不同参数，切换任务执行过程时需要
* gulp-less ---> 将sass预处理为css

* gulp-minify-css ---> 压缩css
* connect-history-api-fallback ---> 开发angular应用必须，用于支持HTML5 history API.

####HTML
---
* gulp-htmlmin ---> 用于压缩html成一行
* gulp-jade ---> 编译jade模板（需要安装jade,with）


####CSS
---
* gulp-autoprefixer ---> 使用Autoprefixer来补全浏览器兼容的css,为css样式添加前缀
* gulp-csscomb ---> 对css属性进行排序

#####JS
---

#####image
---
* gulp.spritesmith ---> 生成雪碧图

#####other
---
* gulp-notify ---> 错误提示
* gulp-plumber ---> 阻止gulp插件错误造成中断
* gulp-plumber-notifier ---> 阻止中断后通知
* gulp-content-includer ---> 在文件中引入另外文件
* gulp-html-replace ---> 替换html中的内容
* gulp-jsbeautifier ---> 美化html, css, js代码
* gulp-notify ---> 通知消息
* gulp-plumber ---> 阻止pipe中断