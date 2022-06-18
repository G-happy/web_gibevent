// 每次调用 $.get()  $.post()  $.ajsx() 的时候
// 会先调用ajaxPrefilter()函数
// options : 为 Ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // // 提交登录表单
    // console.log(options.url); ///api/login


    // 发起真正的Ajax请求前,统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url;


    // 统一为有权限的接口,设置 headers 请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || "",
        }
    }


    // 全局统一挂载 complete 回调
    options.complete = function(res) {
        console.log(res.responseJSON.status);
        console.log(res.responseJSON.message);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空 token
            localStorage.removeItem("token");
            // 强制跳转登录页
            location.href = "/login.html";
        }
    }


})