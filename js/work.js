$('#send_verify_button').click(function(){
    var url = $('.form-widget').find('form').attr('');
    var mobile = $('.form-widget').find('.mobile').val();
    var type = 'moblie';
    var data ={'mobile':mobile,'type':type};

    $.post(url,data,function(result){
        console.log(result);
        if(result.status == 1){
            alert(result.msg)
        }else{
            alert(result.msg)
        }

    });


});