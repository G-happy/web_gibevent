// 每次调用 $.get()  $.post()  $.ajsx() 的时候
// 会先调用ajaxPrefilter()函数
// options : 为 Ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // // 提交登录表单
    // console.log(options.url); ///api/login


    // 发起真正的Ajax请求前,统一拼接请求的根路径
    options.url = "http://www.liulongbin.top:3007" + options.url;
})