// var car = document.getElementById("shopcar");
// car.onmousewheel=function(ev){
//     var event = ev||window.event;
//     ev.stopPropagation();
   
// }
// 


  $('.shoplist').on('click','.orderListDel',function(e){
    console.log(2222);
        var id=$(e.target).data('id');
        var li=$(".order-"+id);
        console.log(li);
        $.ajax({
            type:'DELETE',
            url:'/shopcar/list/delete?id='+id, 
            dataType:'json',
            success:(data)=>{
                console.log(data)
                if(data){
                
                    console.log(111);
                    li.remove();
                    var aa = parseInt($(".orderL").eq(1).text())-1;
                      var bb = parseInt($("#orderT").text())-data.data.price;
                      console.log(aa+"333"+bb)
                     $(".orderL").html(aa);
                     $("#orderT").html(bb);
                }
                // else location.href='/refused';
        }
    });
    });

//signin
$('#signinModal .btn-success').click(function(e){

    if(!$('#signinModal form')[0].checkValidity())
        return;

    $.ajax({
        type:'POST',
        url:'/user/signin',
        data:$('#signinModal form').serialize(),
        dataType:'json',
        success:function(data){
            console.log(data.state);
            switch(data.state){
                case 1:$('#errorName').css({opacity:1});break;
                case 2:$('#errorPassword').css({opacity:1});break;
                case 3:break;
                case 4:
                    sessionStorage.setItem('name',data.user.name);
                    sessionStorage.setItem('id',data.user._id);
                    location.reload();
                    break;
                case 5: $('#signinModal .errorCaptcha').css({display:'block'});
                        $('#signinModal .switchCaptcha')[0].click();
                        $('#signinModal .captcha').val('');
                }
            }
        });

    return false;
});

//sign up
$('#signupModal .btn-success').click(function(e){

    if(!$('#signupModal form')[0].checkValidity())
        return;

    $.ajax({
        type:'POST',
        url:'/user/signup',
        data:$('#signupModal form').serialize(),
        dataType:'json',
        success:function(data){
            if(data.state) location.href='/';
            else {
                $('#signupModal .errorCaptcha').css({display:'block'});
                $('#signupModal .switchCaptcha')[0].click();
                $('#signupModal .captcha').val('');
            }
        }
    });

    return false;
});


//隐藏登陆错误信息
$('#signinModal input').focusin(function(){
    $('#errorName').css({opacity:0}).text('账户有误');
    $('#errorPassword').css({opacity:0});
});

var flags=[true,true];//用于账户和邮箱有一个不通过时提交按钮不可点击

//注册验证用户名
$('.username').blur(function(e){
    $.ajax({
    type:'GET',
    url:'/verify?name='+e.target.value,
    dataType:'json',
    success:function(data){
        if(!data.state) {
            $('.errorAlert:eq(0)').css({display: 'inline'});
            flags[0]=false;
            $('#signupModal .btn-success').attr({disabled: true});
        }
        else {
                $('.errorAlert:eq(0)').css({display:'none'});
                flags[0]=true;
                if(flags.every(function(ele){return ele;}))
                    $('#signupModal .btn-success').attr({disabled:false});
            }
    }
})
});

//注册验证邮箱
$('#signupEmail').blur(function(e){

    if(/\.com$/.test(e.target.value)){
        $.ajax({
            type:'GET',
            url:'/verify?email='+e.target.value,
            dataType:'json',
            success:function(data){
                if(!data.state) {
                    $('.errorAlert:eq(1)').css({display: 'inline'});
                    flags[1]=false;
                    $('#signupModal .btn-success').attr({disabled: true});
                }
                else
                {
                    $('.errorAlert:eq(1)').css({display:'none'});
                    flags[1]=true;
                    if(flags.every(function(ele){return ele;}))
                        $('#signupModal .btn-success').attr({disabled:false});
                }
            }
    });
}});

//个人空间登陆验证
    $('.navbar-nav li:eq(2)').click(function(e){
        if(sessionStorage.getItem('id'))
            return;
        else
            $('.sign a:eq(0)').click();

    });



//登出
$('.logout').click(function(e){
    sessionStorage.clear();  //清除session
    location.href='/logout';
    
});

//分享设置 百度分享
// window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"49"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];





