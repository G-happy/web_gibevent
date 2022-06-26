$(function() {
    getUserInfo();

    let layer = layui.layer;
    // 退出功能
    $("#btnLogOut").on("click", function() {
        // 提示是否退出框
        layer.confirm(
            "确定退出登录?", { icon: 2, title: "提示" },
            function(index) {
                // 1.清除本地存储的 token
                localStorage.removeItem("token");
                // 2.跳转到登录页
                location.href = "/login.html";

                // // 3.关闭询问框,layui自带的功能
                layer.close(index);
            }
        );
    });
});

// 获取用户的基本信息函数
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败!");
            }
            renderAvator(res.data);
        },
        // // 成功或者失败都会调用这个 complete
        // complete: function(res) {
        // if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败!") {
        //     // 强制清空 token
        //     localStorage.removeItem("token");
        //     // 强制跳转登录页
        //     location.href = "/login.html";
        // }
        // console.log(res);
        // location.href = "/login.html";
        // }
    });
}

// 渲染用户头像
function renderAvator(userObj) {
    // console.log(userObj);
    // 1.设置欢迎用户的文本
    const name = userObj.nickname || userObj.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

    // 2.设置用户的头像
    if (userObj.user_pic !== null) {
        // 2.(1)图片头像
        $(".layui-nav-img").attr("src", userObj.user_pic).show();
        $(".text-ava").hide();
    } else {
        // 2.(2)文字头像
        $(".layui-nav-img").hide();
        // 用户名第一个字符转为大写
        let first = name[0].toUpperCase();
        $(".text-ava").html(first).show();
    }
}