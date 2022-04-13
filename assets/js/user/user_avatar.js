$(function () {

    var layer = layui.layer

    //获取裁剪区域的dom元素
    var $image = $('#image')
    //配置选项
    const options = {
        //纵横比
        aspectRatio: 1,
        //指定预览区域
        preview: '.img-preview'
    }

    //创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {

        //上传文件
        $('#file').click()
    })

    //为文件选择框绑定change事件
    $('#file').on('change', function (e) {

        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片！')
        }

        //拿到用户选择的文件
        var file = e.target.files[0]

        //将文件转为路径
        var imgurl = URL.createObjectURL(file)

        //重新初始化裁剪区域
        $image.cropper('destroy').attr('src', imgurl).cropper(options)//销毁旧的区域,设置图片路径，重新初始化
    })


    //为确定按钮绑定单击事件
    $('#btnUpload').on('click', function () {

        //要拿到用户裁剪后的头像  将图像转化成base64格式的
        var dataURL = $image.cropper('getCroppedCanvas', {
            //创建一个Canvas画布
            width: 100,
            height: 100
        }).toDataURL('image/png')
        //发起ajax请求，把头像上传服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {

                if (res.status!== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功！')

                //调用父页面的获取用户信息方法，给父页面的个人中心的头像也渲染
                window.parent.getUserInfo()
            }
        })
    }) 
})