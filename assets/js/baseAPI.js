
//每次发起请求的时候，会先调用这个函数
$.ajaxPrefilter(function(options){

options.url='http://api-breakingnews-web.itheima.net'+options.url

})