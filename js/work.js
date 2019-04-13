$('#send_verify_button').click(function(){
    var url = $('.form-widget').find('form').attr('notify_api');
    var mobile = $('.form-widget').find('input[name*="mobile"]').val();

     var data = {mobile:mobile,type:'mobile'}
        console.log(data);

    $.post(url,data,function(result){
        console.log(result);
        if(result.code == 200){
            alert(result.msg)
        }else{
            alert(result.msg)
        }

    },"json");


});