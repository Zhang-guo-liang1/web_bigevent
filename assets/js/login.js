$(function () {
    //点击去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 从layui中获取form
    var form = layui.form
    var layer = layui.layer
    //通过form.verity()函数自定义校验规则
    form.verify({
        //自定义了pwd的校验规则  \S非空格字符 6到12
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能有空格！'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //c3属性选择器
            var pwd = $('.reg-box [name=password]').val()

            if (value !== pwd) {
                return '两次密码不一致';
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault()

        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg  [name=password]').val() }
        //向服务器发起post请求，注册用户
        $.post('/api/reguser', data, function (res) {

            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！请登录');
            //注册成功后，自动调用去登录链接
            $('#link_login').click();

        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {

        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            //快速获取表单的数据
            data: $(this).serialize(),
            success: function (res) {
              if(res.status!==0)
              {
                  return layer.msg('登录失败！')
              }           
              layer.msg('登录成功！')
               //将登录成功后获取的token值保存到localstorage中
               localStorage.setItem('token',res.token)
              //跳转到后台主页
             location.href='/index.html'

            }
        })

    })
})