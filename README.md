# webGulpCom文档说明
---
gulp的引入目的在于提高前端代码的编写效率（注：本环境基于[nodejs](https://nodejs.org/en/)，所以请先安装好nodejs再运行本工程）。
## 使用说明
    第一步： 如果没有安装过插件执行运行webGulpCom下的install.cmd进行安装，如果安装过，忽略第一步。
    第二步： 运行preject/demo中的run.cmd即可跑工程。

## 重点关注的文件
    gulpfile.js                 gulp运行入口文件
    config.js                   环境的所有配置信息都在这
    install.cmd                 安装环境所有依赖插件
    run.cmd                     启动gulp工程，开启服务器
    publish.cmd                 发布工程到publish目录文件
    clean.cmd                   清除生成的目标文件

## 环境目录结构
    |– gulp                         gulp相关的所有任务、配置文件信息
         |- tasks                    gulp的所有任务文件目录
              |- cssTask.js          css生成、修改、删除的相关任务
              |- htmlTask.js         html生成、修改、删除的相关任务
              |- imagesTask.js       图片生成、修改、删除的相关任务
              |- scriptsTask.js      JavaScript生成、修改、删除的相关任务
              |- sprinteTask.js      雪碧图相关任务（包括web、手机端）
              |- pugTask.js          将所有pug文件编译成html文件
              |- scssTask.js         编译scss文件为css文件(所有文件合并到main.scss，然后编译成main.css)
              |- othersTask.js       为除以上文件目录外的所有目录提供文件拷贝功能
              |- util.js             消息提示等工具任务
         |- config.js                配置文件（工程所有配置信息都在这）
         |- css.handlebars           web端雪碧图生成格式文件
         |- phoneCss.handlebars      手机端端雪碧图生成格式文件
         |- phoneFontCss.handlebars  纯手机端端雪碧图生成格式文件
         |- iChoice.handlebars       ichoice任务雪碧图生成格式文件
    |- node-modules                  node自动生成目录（所有安装本地插件都在这）
    |- project                       工程放置位置
    |- .csscomb.json                 css格式化格式(csscomb插件配置文件，可在官网直接生成，插件会自动调用，不需管)
    |- gulpfile.js                   gulp运行入口文件
    |- install.cmd                   插件安装运行文件
    |- package.json                  node工程依赖插件关系包
    |- postcss.config.js             postcss配置文件
    |- README.md                     说明文档
    |- README_plugins.MD             插件说明文档

## 单个工程目录结构(demo工程为例)
    demo
    |- src                           源文件目录
        |- *.html                    所有html文件
        |- module                    html模块目录
        |- js                        工程相关js文件目录
        |- images                    图片目录
        |- icons                     web端雪碧图源文件存放目录
        |- iconsphone                手机端雪碧图源文件存放目录(纯手机端也放在此目录下)
        |- css                       样式文件目录（包括css、scss）
        |- 其他                      支持其他目录创建（比如字体图标目录font）
    |- clean.cmd                     清除生成的目标文件
    |- publish.cmd                   发布工程到publish目录文件
    |- run.cmd                       启动gulp工程，开启服务器
        
          
## License
MIT © jiaolong
