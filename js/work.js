$('#send_verify_button').click(function(){
    var url = $('.form-widget').find('form').attr('notify_api');
    var mobile = $('.form-widget').find('.mobile').val();
     console.log(mobile);


    $.post(url,{mobile:'mobile',type:'moblie'},function(result){
        console.log(result);
        if(result.code == 1){
            alert(result.msg)
        }else{
            alert(result.msg)
        }

    },"json");


});