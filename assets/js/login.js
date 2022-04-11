$(function () {
    $('#reg_link').on('click', function () {
        $('.log_box').hide();
        $('.reg_box').show();
    });
    $('#login_link').on('click', function () {
        $('.log_box').show();
        $('.reg_box').hide();
    });
    // 表单验证模块
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var psd = $(".reg_box input[name=password]").val();
            if (psd !== value) {
                return '两次密码不一致';
            }
        }
    })
    // 注册模块
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        let data = {
            username: $('#form_reg input[name=username]').val(),
            password: $('#form_reg input[name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！');
            $('#login_link').click();
        })
    })
    // 登录模块
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                localStorage.setItem('token', res.token);
                location.href = 'index.html';
            }
        })
    })
})