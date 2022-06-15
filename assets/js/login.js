$(function() {
    // 跳转至"注册表单"
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });

    // 跳转至"登录表单"
    $("#link_login").on("click", function() {
        $(".reg-box").hide();
        $(".login-box").show();
    });

    // 从 Layui 中获取 form 对象
    let form = layui.form;
    let layer = layui.layer;
    // 自定义 密码 校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验密码是否是一致的
        repwd: function(value) {
            // 密码框中的值
            let pwd = $(".reg-box [name=userpassword]").val();

            if (pwd != value) {
                return "两次密码不一致";
            }
        }
    });

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();

        // 2.发起 Ajax 的 Post 请求
        $.post("/api/reguser", { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功!");

            // 模拟点击行为
            $("#link_login").click();
        })
    });

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),

            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登陆失败!");
                }
                layer.msg("登录成功!");
                // console.log(res.token);  
                // 跳转到后台主页
                location.href = "./index.html";
            }
        })
    })


})