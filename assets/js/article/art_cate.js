$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    //获取文章分类列表
    function initArtCateList() {

        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                //获取拿到的数据
                var htmlstr = template('tpl-table', res)
                //放入tbody里面
                $('tbody').html(htmlstr)
            }
        })
    }
    var indexAdd = null;
    //添加按钮点击事件
    $('#btnAddCate').on('click', function () {

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })
    //通过代理的形式 为form-add绑定 submit事件
    $('body').on('submit', '#form-add', function (e) {

        e.preventDefault()

        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //根据索引关闭对应的弹出层
                layer.close(indexAdd)

            }
        })
    })


    var indexEdit = null
    //通过代理的形式，为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });

        //获取当前点击按钮的 自定义id
        var id = $(this).attr('data-id')

        //发起请求获取对应的数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)

            }
        })
    })

    //通过代理形式，为修改分类的表单绑定submit事件

    $('body').on('submit', '#form-edit', function (e) {

        //阻止表单默认提交行为
        e.preventDefault()
        //发起请求提交数据
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('更新分类数据失败！')
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                //重新获取表格数据
                initArtCateList()
            }
        })
    })

    //通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的id
        var id = $(this).attr('data-id')
        // confirm确认框 提示用户是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            //向服务器发起ajax请求
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0)
                        return layer.msg('删除分类失败！')
                    layer.msg('删除分类成功')
                    //关闭确认框
                    layer.close(index);
                    //重新渲染表格数据
                    initArtCateList()
                }
            })
        })

    })
})