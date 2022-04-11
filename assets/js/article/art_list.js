$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data);
        var year = dt.getFullYear();
        var month = padZero(dt.getMonth() + 1);
        var day = padZero(dt.getDate());
        var hour = padZero(dt.getHours());
        var m = padZero(dt.getMinutes());
        var s = padZero(dt.getSeconds());
        return year + '-' + month + '-' + day + '  ' + hour + ':' + m + ':' + s;
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    var dataObj = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: dataObj,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                var htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                var htmlStr = template('tpl_cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $('#form_search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        dataObj.cate_id = cate_id;
        dataObj.state = state;
        initTable();
    })

    function renderPage(total) {
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: dataObj.pagesize,
            curr: dataObj.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                dataObj.pagesize = obj.limit;
                dataObj.pagenum = obj.curr;
                if (!first) {
                    initTable();
                }
            }
        });
    }

    $('tbody').on('click', '.btn_del', function () {
        var id = $(this).attr('data-id');
        var len = $('.btn_del').length;
        layer.confirm('确认删除?', function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章成功！');
                    }
                    if (len === 1) {
                        dataObj.pagenum = dataObj.pagenum === 1? 1 : dataObj.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }

            })
        })


    })
})