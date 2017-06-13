
$(function () {
    $('[data-toggle="tooltip"]').tooltip();  //开启tooltip功能
});
    //详细信息提交电影
// $('#inputTitle').blur(function(e){

//     $.ajax({
//         type:'GET',
//         url:'/admin/verify?title='+$(e.target).val().split('').join(' ')+'&form=1',
//         dateType:'json',
//         success:function(data){
//             if(!data.state) {
//                 $('#errorTitle').css({display: 'block'});
//                 $('#explicit-info .btn-primary').attr({disabled:true});
//             }
//         }
//     });
// }).focus(function(e){
//     $('#errorTitle').css({display:'none'});
//     $('#explicit-info .btn-primary').attr({disabled:false});
// });

var form=new FormData();  //承载图片数据
var flag=false;
$('#uploadPoster').change(function(e){

    var path=$(e.target).val(),
        fileType=path.slice(path.lastIndexOf('.')+1).toLowerCase();

    if(fileType!=='jpg'&&fileType!=='png') {
        alert('请上传jpg或者png格式的图片');
        return;
    };

    var reader=new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    form.append('postPic',e.target.files[0]);
    flag=true;
    reader.onload=function(e){
        $('#showPoster').css({backgroundImage:'url('+e.target.result+')'});
    };
});

$('#explicit-info form:eq(1) button').click(function(e){

    // if(!flag){
    //     alert('请上传图片');
    //     return false;
    // }

    if(!$('#explicit-info form:eq(1)')[0].checkValidity())
        return;

    if(!$('#explicit-info [type="checkbox"]:checked')[0]) {
        alert('请选择书籍类别');
        return false;
    }

        // $.ajax({
        //     type:'POST',
        //     url:'/admin/book/new',
        //     data:$('#explicit-info form:eq(1)').serialize(),
        //     success:function(data){
        //         alert(发送成功);

        //         $.ajax({   //先\交文本数据再提交图片数据
        //             type:'POST',
        //             data:form,
        //             url:'/admin/book/new',
        //             contentType:false,
        //             processData:false,
        //             dataType:'json',
        //             success:function(data){
        //                  location.href='/';
        //             }
        //         });

        //     },
        //     error: function(err) {
        //         console.log(err);
        //     }
        // });

    // return false;
});


 


