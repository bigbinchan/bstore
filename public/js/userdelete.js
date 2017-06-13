$(function(){
    $('.del').on('click',function(e){
        var id=$(e.target).data('id');
        var tr=$('.user-id-'+id);

        $.ajax({
            type:'DELETE',
            url:'/admin/user/delete?id='+id,
            dataType:'json',
            success:(data)=>{

                if(data.state==1&&tr.length>0)
                    tr.remove();
                else location.href='/refused';
        }
    });
    });
   
     $('.check').on('click',function(e){
        var id=$(e.target).data('id');
        var ul = $("#xinxi")
        ul.remove();
        $.ajax({
            type:'GET',
            url:'/admin/user/check?id='+id,
            dataType:'json',
            success:(data)=>{

                if(data){
                    var main=$('#checkuser .modal-body');
                    var ul = "<ul id='xinxi'><li >用户名："+data.user.name+"</li><li>邮箱："+data.user.email+"</li><li>订单数"+data.user.order.length+"</li></ul>"
                        main.append(ul);
                }
                
        }
    });
    });
});