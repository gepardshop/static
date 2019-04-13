$('#send_verify_button').click(function(){
    var url = $('.form-widget').find('form').attr();
    var mobile = $('.form-widget').find('.mobile').val();
    console.log(mobile);
    var type = 'moblie';
    var data ={'mobile':mobile,'type':type};

    $.post(url,{'mobile':'123123','type':'moblie'},function(result){
        console.log(result);
        if(result.code == 1){
            alert(result.msg)
        }else{
            alert(result.msg)
        }

    });


});