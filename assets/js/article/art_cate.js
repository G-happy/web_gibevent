$(function() {
    const layer = layui.layer;
    const form = layui.form;

    initArticleList();
    // 1.获取文章分类列表,并渲染到页面上
    function initArticleList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: (res) => {
                const htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        })
    }

    // 监听 "添加类别" 按钮点击事件
    var indexAdd = null;
    $("#addCateBtn").on("click", function() {
        // 弹出层
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
        });
    })

    // 通过代理的形式,为 form-add 表单绑定提交事件
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("新增文章分类失败！")
                }
                initArticleList();
                layer.msg("新增文章分类成功！");
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式,为 edit-btn 按钮绑定点击事件
    let indexEdit = null;
    $("body").on("click", ".edit-btn", function() {
        // 弹出层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
        });
        let id = $(this).attr("data-id");

        // 获取点击项的 Id 值
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: (res) => {
                // 为表单填充原有的值
                form.val("form-edit", res.data);
            }
        })
    })

    // 通过代理的形式,为 form-edit 表单绑定submit事件
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败！")
                }
                layer.msg("更新分类信息成功！");
                layer.close(indexEdit);
                initArticleList();
            }
        })
    })

    // 通过代理的形式,为 delete-btn 按钮绑定删除事件
    $("body").on("click", ".delete-btn", function() {
        const id = $(this).attr("data-id");
        // 提示删除框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败！");
                    }
                    layer.msg("删除文章分类成功！");
                    layer.close(index);
                    initArticleList();

                }
            })
        });
    })
})