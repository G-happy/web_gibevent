$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $("#image");
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: ".img-preview",
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 上传按钮
    $("#uploadBtn").on("click", function() {
        $("#file").click();
    });

    // 为文件选择框绑定 change 事件
    $("#file").on("change", function(e) {
        // console.log(e.target.files);
        console.log(e);
        // 获取用户选择的文件(伪数组)
        const fileList = e.target.files;
        if (fileList.length === 0) {
            return layer.msg("请选择图片");
        } else {
            // 1.获取用户选择的文件
            let file = fileList[0];
            // 2.将文件转化为路径
            let imgUrl = URL.createObjectURL(file);
            // 3.重新初始化裁剪区域
            $image
                .cropper("destroy") // 销毁旧的裁剪区域
                .attr("src", imgUrl) // 重新设置图片路径
                .cropper(options); // 重新初始化裁剪区域
        }
    });
    $("#notarizeBtn").on("click", function() {
        // 1.拿到用户裁剪后的头像
        var dataURL = $image
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.将头像上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败!");
                }
                layer.msg("更换头像成功!");
                window.parent.getUserInfo();
            },
        });
    });
});