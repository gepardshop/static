$task_content_inner = null;
$mainiframe=null;
var tabwidth=118;
$loading=null;
$nav_wraper=jq142("#nav_wraper");
jq142(function () {
	$mainiframe=jq142("#mainiframe");
	$content=jq142("#content");
	$loading=jq142("#gepard-loading");
	var headerheight=86;
	$content.height(jq142(window).height()-headerheight);


	$nav_wraper.height(jq142(window).height()-45);
	//$nav_wraper.css("overflow","auto");
	//$nav_wraper.niceScroll();
	jq142(window).resize(function(){
		$nav_wraper.height(jq142(window).height()-45);
		$content.height(jq142(window).height()-headerheight);
		 calcTaskitemsWidth();
	});
    jq142("#content iframe").load(function(){
    	$loading.hide();
    });

    $task_content_inner = jq142("#task-content-inner");


    jq142("#searchMenuKeyWord").keyup(function () {
        var wd = jq142(this).val();
        //searchedmenus
        var $tmp = jq142("<div></div>");
        if (wd != "") {
            jq142("#allmenus a:contains('" + wd + "')").each(
        function () {
            $clone = jq142(this).clone().prepend('<img src="/images/left/01/note.png">');

            $clone.wrapAll('<div class="menuitemsbig"></div>').parent().attr("onclick", $clone.attr("onclick")).appendTo($tmp);

        }
        );
            jq142("#searchedmenus").html($tmp.html());
            jq142("#searchedmenus").show();
            jq142("#allmenus").hide();
            jq142("#defaultstartmenu").hide();
            jq142("#allmenuslink .menu_item_linkbutton").html("返回");
            isAllDefault = false;
            // jq142("#searchedmenus").html($tmp).show();

        }

    });



    jq142("#appbox  li .delete").click(function (e) {
        jq142(this).parent().remove();
        return false;
    });



    ///

    jq142(".apps_container li").live("click", function () {
        var app = '<li><span class="delete" style="display:inline">×</span><img src="" class="icon"><a href="#" class="title"></a></li>';
        var $app = jq142(app);
        $app.attr("data-appname", jq142(this).attr("data-appname"));
        $app.attr("data-appid", jq142(this).attr("data-appid"));
        $app.attr("data-appurl", jq142(this).attr("data-appurl"));
        $app.find(".icon").attr("src", jq142(this).attr("data-icon"));
        $app.find(".title").html(jq142(this).attr("data-appname"));
        $app.appendTo("#appbox");
        jq142("#appbox  li .delete").off("click");
        jq142("#appbox  li .delete").click(function () {
            jq142(this).parent().remove();
            return false;
        });
    });

    ///
    jq142("#tdshortcutsmor1").click(function () {
        jq142(".window").hide();
    });

    jq142(".task-item").live("click", function () {
        var appid = jq142(this).attr("app-id");
        var $app = jq142('#' + appid);
        showTopWindow($app);
    });

    jq142("#task-content-inner li").live("click", function () {
    	openapp(jq142(this).attr("app-url"), jq142(this).attr("app-id"), jq142(this).attr("app-name"));
    	return false;
    });

    jq142("#task-content-inner li").live("dblclick", function () {
    	closeapp(jq142(this));
    	return false;

    });
    jq142("#task-content-inner a.macro-component-tabclose").live("click", function () {
    	closeapp(jq142(this).parent());
        return false;
    });

    jq142("#task-next").click(function () {
        var marginleft = $task_content_inner.css("margin-left");
        marginleft = marginleft.replace("px", "");
        var width = jq142("#task-content-inner li").length * tabwidth;
        var content_width = jq142("#task-content").width();
        var lesswidth = content_width - width;
        marginleft = marginleft - tabwidth <= lesswidth ? lesswidth : marginleft - tabwidth;

        $task_content_inner.stop();
        $task_content_inner.animate({ "margin-left": marginleft + "px" }, 300, 'swing');
    });
    jq142("#task-pre").click(function () {
        var marginleft = $task_content_inner.css("margin-left");
        marginleft = parseInt(marginleft.replace("px", ""));
        marginleft = marginleft + tabwidth > 0 ? 0 : marginleft + tabwidth;
        // $task_content_inner.css("margin-left", marginleft + "px");
        $task_content_inner.stop();
        $task_content_inner.animate({ "margin-left": marginleft + "px" }, 300, 'swing');
    });

    jq142("#refresh_wrapper").click(function(){
    	var $current_iframe=jq142("#content iframe:visible");
    	$loading.show();
    	//$current_iframe.attr("src",$current_iframe.attr("src"));
    	$current_iframe[0].contentWindow.location.reload();
    	return false;
    });

    calcTaskitemsWidth();
});
function calcTaskitemsWidth() {
    var width = jq142("#task-content-inner li").length * tabwidth;
    jq142("#task-content-inner").width(width);
    if ((jq142(document).width()-200-tabwidth- 30 * 2) < width) {
        jq142("#task-content").width(jq142(document).width() -200-tabwidth- 30 * 2);
        jq142("#task-next,#task-pre").show();
    } else {
        jq142("#task-next,#task-pre").hide();
        jq142("#task-content").width(width);
    }
}

function close_current_app(){
	closeapp(jq142("#task-content-inner .current"));
}

function closeapp($this){
	if(!$this.is(".noclose")){
		$this.prev().click();
    	$this.remove();
    	jq142("#appiframe-"+$this.attr("app-id")).remove();
    	calcTaskitemsWidth();
    	jq142("#task-next").click();
	}

}





var task_item_tpl ='<li class="macro-component-tabitem">'+
'<span class="macro-tabs-item-text"></span>'+
'<a class="macro-component-tabclose" href="javascript:void(0)" title="点击关闭标签"><span></span><b class="macro-component-tabclose-icon">×</b></a>'+
'</li>';

var appiframe_tpl='<iframe style="width:100%;height: 100%;" frameborder="0" class="appiframe"></iframe>';

function openapp(url, appid, appname, refresh) {
    var $app = jq142("#task-content-inner li[app-id='"+appid+"']");
    jq142("#task-content-inner .current").removeClass("current");
    if ($app.length == 0) {
        var task = jq142(task_item_tpl).attr("app-id", appid).attr("app-url",url).attr("app-name",appname).addClass("current");
        task.find(".macro-tabs-item-text").html(appname).attr("title",appname);
        $task_content_inner.append(task);
        jq142(".appiframe").hide();
        $loading.show();
        $appiframe=jq142(appiframe_tpl).attr("src",url).attr("id","appiframe-"+appid);
        $appiframe.appendTo("#content");
        $appiframe.load(function(){
        	$loading.hide();
        });
        calcTaskitemsWidth();
    } else {
    	$app.addClass("current");
    	jq142(".appiframe").hide();
    	var $iframe=jq142("#appiframe-"+appid);
    	var src=$iframe.get(0).contentWindow.location.href;
    	src=src.substr(src.indexOf("://")+3);
    	/*if(src!=GV.HOST+url){
    		$loading.show();
    		$iframe.attr("src",url);
    		$appiframe.load(function(){
            	$loading.hide();
            });
    	}*/
    	if(refresh===true){//刷新
    		$loading.show();
    		$iframe.attr("src",url);
    		$iframe.load(function(){
            	$loading.hide();
            });
    	}
    	$iframe.show();
    	//$mainiframe.attr("src",url);
    }

    //
    var itemoffset= jq142("#task-content-inner li[app-id='"+appid+"']").index()* tabwidth;
    var width = jq142("#task-content-inner li").length * tabwidth;

    var content_width = jq142("#task-content").width();
    var offset=itemoffset+tabwidth-content_width;
    
    var lesswidth = content_width - width;
    
    var marginleft = $task_content_inner.css("margin-left");
   
    marginleft =parseInt( marginleft.replace("px", "") );
    var copymarginleft=marginleft;
    if(offset>0){
    	marginleft=marginleft>-offset?-offset:marginleft;
    }else{
    	marginleft=itemoffset+marginleft>=0?marginleft:-itemoffset;
    }
    
    if(-itemoffset==marginleft){
    	marginleft = marginleft + tabwidth > 0 ? 0 : marginleft + tabwidth;
    }
    
    //alert("cddd:"+(content_width-copymarginleft)+" dddd:"+(-itemoffset));
    if(content_width-copymarginleft-tabwidth==itemoffset){
    	marginleft = marginleft - tabwidth <= lesswidth ? lesswidth : marginleft - tabwidth;
    }
    
	$task_content_inner.animate({ "margin-left": marginleft + "px" }, 300, 'swing');
    
    
    
  
}

