$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        });
    });
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！');
                }
                initArtCateList();
                layer.msg('新增文章分类成功！');
                layer.close(indexAdd);
            }
        });
    });
    var indexEdit = null;
    $('tbody').on('click', '.form_edit',function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form_edit', res.data);
            }
        });
    });
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                layer.msg('更新分类信息成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });
    $('tbody').on('click', '.form_del', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    initArtCateList();
                    return layer.msg('删除成功！');
                    layer.close(index);

                }
            });
        });
    });
});