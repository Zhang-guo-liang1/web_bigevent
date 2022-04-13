$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value >= 6) {
                return '昵称长度必须在1 ~ 6 个字符之间！'
            }
        }

    })

    initUserInfo()
    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')

                }
                console.log(res);
                //调用form.val快速给表单赋值
                form.val('formUserInfo', res.data)

            }
        })
    }

    //重置表单的数据
    $('#btnReset').on('click', function (e) {
        //阻止表单默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    //监听表单的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')

                }

               layer.msg('更新用户信息成功！')

                //调用父页面的获取用户信息的方法，重新渲染用户头像和用户信息
                //子页面在iframe,父页面在窗口

                window.parent.getUserInfo()




            }
        }
        )
    })
})