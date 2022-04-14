$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()

    //初始化富文本编辑器
    initEditor()

    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                console.log(res);

                //调用模板引擎 渲染分类的下拉菜单
                var htmlstr = template('tpl-cate', res)
                //动态代理
                $('[name=cate_id]').html(htmlstr)
                //记得调用form.render()
                form.render()

            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //为选择封面的按钮点击事件处理函数
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })
    //监听coverfile的change事件，当选择文件之后， 
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })
    var art_state = '已发布'
    //为存为草稿绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于form表单，快速创建一个formdata对象 将表单的jQuery对象转化为dom对象
        var fd = new FormData($(this)[0])
        //将文章的发布状态，存到fd中
        fd.append('state', art_state)


        //将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {

            //创建一个canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            //将文件对象存储到fd中
            fd.append('cover_img', blob)
            //发起ajax请求
            publishArticle(fd)
        })

    })
    //定义 一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 如果提交的是formdata对象，必须添加两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //跳转到文章列表页面
              location.href='/article/art_list.html'
             

            }
        })
    }
})