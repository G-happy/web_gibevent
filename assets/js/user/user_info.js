$(function() {
    let form = layui.form;
    let layer = layui.layer;

    // 表单信息校验
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在 1 ~ 6 个字符之间";
            }
        },
    });
    initUserInfo();

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取信息失败!");
                } else {
                    // console.log(res);
                    // 调用form.val() 为表单赋值
                    form.val("formUserInfo", res.data);
                }
            },
        });
    }

    // 重置按钮
    $("#resetBtn").on("click", function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        initUserInfo();
    });

    // 提交更新表单
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    layer.msg("更新用户信息失败!");
                } else {
                    window.parent.getUserInfo();
                }
            },
        });
    });
});