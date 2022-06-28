$(function() {
    const layer = layui.layer;
    let form = layui.form;
    // 美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);

        let year = dt.getFullYear();
        let month = dt.getMonth() + 1;
        let days = dt.getDate();

        let hour = dt.getHours();
        let minutes = dt.getMinutes();
        let second = dt.getSeconds();

        // 补 0
        month = month >= 10 ? month : "0" + month;
        days = days >= 10 ? days : "0" + days;
        hour = hour >= 10 ? hour : "0" + hour;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
        second = second >= 10 ? second : "0" + second;
        return (
            year + "-" + month + "-" + days + " " + hour + ":" + minutes + ":" + second
        );
    };
    // 定义一个查询对象，将来请求参数的时候，需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据,默认为 2
        cate_id: "", //	文章分类的 Id
        state: "", // 文章的状态，可选值有：已发布、草稿
    };
    initTable();
    initCate();
    // 获取文章列表数据，并渲染到界面上
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                // 使用模板引擎渲染界面
                let htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);

                // 调用渲染分页的函数
                renderPage(res.total);
            },
        });
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！");
                }

                // 调用模板引擎渲染分类的可选项
                const htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通知 layui 重新渲染表单结构UI区域
                form.render();
            },
        });
    }

    // 为表单绑定 submit 事件
    $("#form-search").on("submit", function(e) {
        e.preventDefault();

        // 获取表单选中项的值
        let getCate_id = $("[name=cate_id]").val();
        let getState = $("[name=state]").val();

        // 为查询参数对象 q 中的对应的参数赋值
        q.cate_id = getCate_id;
        q.state = getState;

        // 根据最新的查询条件，查询渲染界面
        initTable();
    });

    // 分页
    function renderPage(total) {
        var laypage = layui.laypage;
        laypage.render({
            elem: "pageBox", // 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数。
            curr: q.pagenum, // 起始页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            // 分页发生切换时执行的回调函数
            /**
             * 触发 jump 回调的两种方式：
             * 1.点击页码的时候，触发 jump 回调
             * 2.只要调用了 laypage.render 方法，就会触发 jump 回调
             *
             * 第一种方式触发 jump 回调，first 的值为 undefined
             * 第二种方式触发 jump 回调，first 的值为 true
             *
             */
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值，赋值给 q 这个查询对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值给 q 这个查询对象中
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }
            },
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $("body").on("click", ".delete-btn", function() {
        // 获取删除按钮的个数
        let delBtnNum = $(".delete-btn").length;
        let id = $(this).attr("data-id");

        // 删除弹窗
        layer.confirm("确认删除?", { icon: 3, title: "提示" }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg("删除失败！");
                    }
                    // 当前页已经没有数据
                    if (delBtnNum === 1) {
                        // 页码值最小为 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                },
            });
            layer.close(index);
        });
    });
});