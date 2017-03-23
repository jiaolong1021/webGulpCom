/*********************************************************
*      功能： 通用工具
*             包括： 错误处理、消息提示、阻止pipe中断
*
*      主要插件：
*           1. gulp-notify          ---     产生错误时发送消息提示
*           2. gulp-plumber         ---     阻止插件错误引起的pipe中断（放在源码后）
*           3. loadsh.assign        ---     合并多个json对象
*
* *********************************************************/

var notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    assign = require("lodash.assign");

// 错误提示处理
function errorsHandle() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: '编译错误',
        message: '<%=error.message%>'
    }).apply(this, args).emit();
}

// 插件错误阻止pipe中断处理
function plumberHandle(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "编译有错误",
            message: "<%=error.message%>"
        })
    });
}

// 消息提示
function msgTipHandle(message) {
    var settings = {
        title: "编译提示",
        message: '[<%= file.relative%>]' + '任务完成'
    };

    assign(settings, message);
    return notify(settings);
}

/* 模块导入 */
module.exports = {
    errorHandle: errorsHandle,
    plumberHandle: plumberHandle,
    msgTipHandle: msgTipHandle
};