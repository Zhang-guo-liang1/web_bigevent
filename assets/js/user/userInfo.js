$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '输入用户昵称的长度必须在1-6位之间';
            }
        }
    })
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                form.val('formUserInfo', res.data);
            }
        })
    }
    $('#btn_reset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                window.parent.getUserInfo();
            }
        })
    })
})
