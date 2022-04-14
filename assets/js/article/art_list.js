$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {

        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d +' ' + hh + ':' + mm + ':' + ss
    }

    //定义补0函数

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }




    //定义一个查询的参数对象
    var q = {
        pagenum: 1,//页码值默认请求第一页的数据
        pagesize: 2,//每页显示几条数据默认每页显示两条
        cate_id: '',//文章分类id
        state: '',//文章的状态
    }
    //初始化表格数据
    initTable()
    //初始化分类类别数据
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);
                
                //使用模板引擎渲染数据
                var htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })

    }


    //获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                console.log(res);
                
                //使用模板引擎渲染数据
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr)
                //通知layui重新渲染表单区域的ui结构 
                form.render()

            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {

        e.preventDefault()
        //获取表单中选定的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //给q参数对象分类id和分类状态赋值 
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件，重新渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //触发jump切换页码的方法有两种
            //1.点击页码时，触发
            //2.只要调用了laypage.render()渲染方法就会触发  

            jump: function (obj, first) {

                //把最新的页码值赋值给查询对象
                q.pagenum = obj.curr

                //把最新的条目数，赋值到q上
                q.pagesize = obj.limit

                //调用render方法触发jump函数 first默认为ture ,否则为点击触发
                if (!first) {
                    //根据最新的q获取对应的列表数据并渲染表格
                    initTable()
                }

            }
        })
    }


    //通过动态代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {

        //获取每页中删除按钮的个数
        var len = $('.btn-delete').length

        //点击删除按钮获取对应的 文章的id
        var id = $(this).attr('data-id')
        //询问用户时候要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余数据                   
                    //如果没有，让页码值减1，在重新渲染表格数据

                    if (len === 1) {
                        q.pagenum = q.pagenum ===1 ? 1 : q.pagenum - 1
                    }
                    //重新渲染表格数据
                    initTable()
                  
                }
            })
            layer.close(index)
        })
    })
})


