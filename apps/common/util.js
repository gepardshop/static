window.addEventListener("load", function(){
    if(Notification && Notification.permission !== "granted"){
        Notification.requestPermission(function(status){
            if(Notification.permission !== status){
                Notification.permission = status;
            }
        });
    }

});
function notice_user(icon,content){
    var t = new Date().toLocaleString();
    var options={
        dir: "ltr",
        lang: "utf-8",
        icon: icon,
        body: content
    };
    if(Notification && Notification.permission === "granted"){
        var n = new Notification("消息提醒", options);
        n.onshow = function(){
            console.log("You got me!");
            $('audio').remove();
            audioElementHovertree = document.createElement('audio');
            audioElementHovertree.setAttribute('src', 'http://w.qq.com/audio/classic.mp3');
            audioElementHovertree.setAttribute('autoplay', 'autoplay'); //打开自动播放
            //audioElement.load();
        };
        n.onclick = function() {
            alert("You clicked me!");
            window.location = "/";
        };
        n.onclose = function(){
            console.log("notification closed!");
        };
        n.onerror = function() {
            console.log("An error accured");
        }
        setTimeout(n.close.bind(n), 5000);//auto clear notifications
    }else if(Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status){
            if(Notification.permission !== status){
                Notification.permission = status;
            }

            if(status === "granted"){
                for(var i = 0; i < 3; i++){
                    var n = new Notification("Hi! " + i, {
                        tag: "Beyoung",
                        icon: "http://ihuster.com/static/avatar/b_default.png",
                        body: "你好呀，我是第" + i +"条消息啦！"
                    });
                }
            }
        });
    }else{
//            alert("Hi!");
    }
}