var DomOutline = function(options) {
    options = options || {};
    var pub = {};
    var self = {
        opts: {
            namespace: options.namespace || 'DomOutline',
            borderWidth: options.borderWidth || 2,
            onClick: options.onClick || false,
            filter: options.filter || false
        },
        keyCodes: {
            BACKSPACE: 8,
            ESC: 27,
            DELETE: 46
        },
        active: false,
        initialized: false,
        elements: {}
    };
    function writeStylesheet(css) {
        var element = document.createElement('style');
        element.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(element);

        if (element.styleSheet) {
            element.styleSheet.cssText = css; /*IE*/
        } else {
            element.innerHTML = css;  /*Non-IE*/
        }
    }

    function initStylesheet() {
        if (self.initialized !== true) {
            var css = '' +
                '.' + self.opts.namespace + ' {' +
                '    background: #09c;' +
                '    position: absolute;' +
                '    z-index: 1000000;' +
                '}' +
                '.' + self.opts.namespace + '_label {' +
                '    background: #09c;' +
                '    border-radius: 2px;' +
				'	 cursor:pointer;'+
                '    color: #fff;' +
				'	 height:20px;'+
				'	 line-height:20px;'+
                '    font: bold 12px/12px Helvetica, sans-serif;' +
                '    padding: 4px 6px;' +
                '    position: absolute;' +
                '    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);' +
                '    z-index: 1000001;' +
                '}';

            writeStylesheet(css);
            self.initialized = true;
        }
    }

    function createOutlineElements() {
        self.elements.label = jQuery('<div></div>').addClass(self.opts.namespace + '_label').attr('id', 'DomOutline_label').appendTo('body');
		self.elements.top = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.bottom = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.left = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
        self.elements.right = jQuery('<div></div>').addClass(self.opts.namespace).appendTo('body');
    }

    function removeOutlineElements() {
        jQuery.each(self.elements, function(name, element) {
            element.remove();
        });
    }

    function compileLabelText(element, width, height) {
        var label = element.tagName.toLowerCase();
        if (element.id) {
            label += '#' + element.id;
        }
        if (element.className) {
            label += ('.' + jQuery.trim(element.className).replace(/ /g, '.')).replace(/\.\.+/g, '.');
        }
        return label + ' (' + Math.round(width) + 'x' + Math.round(height) + ')';
    }

    function getScrollTop() {
        if (!self.elements.window) {
            self.elements.window = jQuery(window);
        }
        return self.elements.window.scrollTop();
    }

    function updateOutlinePosition(e) {
		if(!$(e.target).hasClass("DomOutline_label")){
				uengager_dompath_xxx = $(e.target).fullSelector();
		}
        if (e.target.className.indexOf(self.opts.namespace) !== -1) {
            return;
        }
        if (self.opts.filter) {
            if (!jQuery(e.target).is(self.opts.filter)) {
                return;
            }
        }
        pub.element = e.target;

        var b = self.opts.borderWidth;
        var scroll_top = getScrollTop();
        var pos = pub.element.getBoundingClientRect();
        var top = pos.top + scroll_top;

        var label_text = compileLabelText(pub.element, pos.width, pos.height);
        var label_top = Math.max(0, top - 20 - b, scroll_top);
        var label_left = Math.max(0, pos.left - b);

        self.elements.label.css({ 
			top: label_top+ 20, 
			left: label_left 
		}).text("点击选中");
        self.elements.top.css({
            top: Math.max(0, top - b),
            left: pos.left - b,
            width: pos.width + b,
            height: b
        });
        self.elements.bottom.css({
            top: top + pos.height,
            left: pos.left - b,
            width: pos.width + b,
            height: b
        });
        self.elements.left.css({
            top: top - b,
            left: Math.max(0, pos.left - b),
            width: b,
            height: pos.height + b
        });
        self.elements.right.css({
            top: top - b,
            left: pos.left + pos.width,
            width: b,
            height: pos.height + (b * 2)
        });
    }

    function stopOnEscape(e) {
        if (e.keyCode === self.keyCodes.ESC || e.keyCode === self.keyCodes.BACKSPACE || e.keyCode === self.keyCodes.DELETE) {
            pub.stop();
        }

        return false;
    }

    function clickHandler(e) {
        pub.stop();
        self.opts.onClick(pub.element);

        return false;
    }

    $.fn.fullSelector = function() {
        var path = this.parents().addBack();
        var quickCss = path.get().map(function(item) {
            var self = $(item),
                name = item.nodeName.toLowerCase();
                index = self.siblings(name).length ? ':nth-child(' + (self.index() + 1) + ')' : '';

            if (name === 'html' || name === 'body') {
                return name;
            }
            return name + index;

        }).join(' > ');
        return quickCss;
    };

    pub.start = function() {
        initStylesheet();
        if (self.active !== true) {
            self.active = true;
            createOutlineElements();
            jQuery('body').on('mousemove.' + self.opts.namespace, updateOutlinePosition);
            jQuery('body').on('keyup.' + self.opts.namespace, stopOnEscape);
            if (self.opts.onClick) {
                setTimeout(function() {
                    jQuery('body').on('click.' + self.opts.namespace, function(e) {
                        if (self.opts.filter) {
                            if (!jQuery(e.target).is(self.opts.filter)) {
                                return false;
                            }
                        }
                        clickHandler.call(this, e);
                    });
                }, 50);
            }
        }
    };

    pub.stop = function() {
        self.active = false;
        removeOutlineElements();
        jQuery('body').off('mousemove.' + self.opts.namespace)
            .off('keyup.' + self.opts.namespace)
            .off('click.' + self.opts.namespace);
    };

    return pub;
};
var myExampleClickHandler = function(element) {
    return false;
};
uengager_myDomOutline = DomOutline({
    onClick: myExampleClickHandler,
    hideLabel: false
});
function addStyleString(str) {
	var node = document.createElement('style');
	node.innerHTML = str;
	document.body.appendChild(node);
}
function addcss() {
	addStyleString(".introjs-helperLayer,.introjs-overlay{-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;box-sizing:content-box}.introjs-overlay{position:absolute;z-index:999999;background-color:#000;opacity:0;background:-moz-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,rgba(0,0,0,.4)),color-stop(100%,rgba(0,0,0,.9)));background:-webkit-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-o-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-ms-radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:radial-gradient(center,ellipse cover,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr='#66000000',endColorstr='#e6000000',GradientType=1)\";-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\";filter:alpha(opacity=50);transition:all .3s ease-out}.introjs-fixParent{z-index:auto!important;opacity:1!important;-webkit-transform:none!important;-moz-transform:none!important;-ms-transform:none!important;-o-transform:none!important;transform:none!important}.introjs-showElement,tr.introjs-showElement>td,tr.introjs-showElement>th{z-index:9999999!important}.introjs-disableInteraction{z-index:99999999!important;position:absolute;background-color:#fff;opacity:0;filter:alpha(opacity=0)}.introjs-relativePosition,tr.introjs-showElement>td,tr.introjs-showElement>th{position:relative}.introjs-helperLayer{position:absolute;z-index:9999998;background-color:#FFF;background-color:rgba(255,255,255,.9);border:1px solid #777;border:1px solid rgba(0,0,0,.5);border-radius:4px;box-shadow:0 2px 15px rgba(0,0,0,.4);transition:all .3s ease-out}.introjs-tooltipReferenceLayer{box-sizing:content-box;position:absolute;visibility:hidden;z-index:10000000;background-color:transparent;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.introjs-helperLayer *,.introjs-helperLayer :after,.introjs-helperLayer :before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;-ms-box-sizing:content-box;-o-box-sizing:content-box;box-sizing:content-box}.introjs-bullets ul li,.introjs-bullets ul li a,.introjs-button,.introjs-helperNumberLayer,.introjs-hint,.introjs-progress,.introjs-progressbar,.introjs-skipbutton,.introjs-tooltip{box-sizing:content-box}.introjs-helperNumberLayer{position:absolute;visibility:visible;top:-16px;left:-16px;z-index:9999999999!important;padding:2px;font-family:Arial,verdana,tahoma;font-size:13px;font-weight:700;color:#fff;text-align:center;text-shadow:1px 1px 1px rgba(0,0,0,.3);background:#ff3019;background:-webkit-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#ff3019),color-stop(100%,#cf0404));background:-moz-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-ms-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-o-linear-gradient(top,#ff3019 0,#cf0404 100%);background:linear-gradient(to bottom,#ff3019 0,#cf0404 100%);width:20px;height:20px;line-height:20px;border:3px solid #fff;border-radius:50%;filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3019', endColorstr='#cf0404', GradientType=0)\";filter:\"progid:DXImageTransform.Microsoft.Shadow(direction=135, strength=2, color=ff0000)\";box-shadow:0 2px 5px rgba(0,0,0,.4)}.introjs-arrow{border:5px solid #fff;content:'';position:absolute}.introjs-arrow.top,.introjs-arrow.top-middle,.introjs-arrow.top-right{top:-10px;border-color:transparent transparent #fff}.introjs-arrow.top-right{right:10px}.introjs-arrow.top-middle{left:50%;margin-left:-5px}.introjs-arrow.left,.introjs-arrow.right{top:10px}.introjs-arrow.right,.introjs-arrow.right-bottom{right:-10px;border-color:transparent transparent transparent #fff}.introjs-arrow.right-bottom{bottom:10px}.introjs-arrow.bottom{bottom:-10px;border-color:#fff transparent transparent}.introjs-arrow.left,.introjs-arrow.left-bottom{left:-10px;border-color:transparent #fff transparent transparent}.introjs-arrow.left-bottom{bottom:10px}.introjs-tooltip{position:absolute;visibility:visible;padding:10px;background-color:#fff;min-width:200px;max-width:300px;border-radius:3px;box-shadow:0 1px 10px rgba(0,0,0,.4);-webkit-transition:opacity .1s ease-out;-moz-transition:opacity .1s ease-out;-ms-transition:opacity .1s ease-out;-o-transition:opacity .1s ease-out;transition:opacity .1s ease-out}.introjs-tooltipbuttons{text-align:right;white-space:nowrap}.introjs-button{position:relative;overflow:visible;display:inline-block;padding:.3em .8em;margin:10px 0 0;text-decoration:none;white-space:nowrap;cursor:pointer;outline:0;border-radius:.2em;zoom:1}.introjs-button::-moz-focus-inner{padding:0;border:0}.introjs-skipbutton{margin-right:5px;color:#7a7a7a}.introjs-prevbutton{-webkit-border-radius:.2em 0 0 .2em;-moz-border-radius:.2em 0 0 .2em;border-radius:.2em 0 0 .2em;border-right:none}.introjs-prevbutton.introjs-fullbutton{border:1px solid #d4d4d4;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-nextbutton{-webkit-border-radius:0 .2em .2em 0;-moz-border-radius:0 .2em .2em 0;border-radius:0 .2em .2em 0}.introjs-nextbutton.introjs-fullbutton{-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-disabled,.introjs-disabled:focus,.introjs-disabled:hover{color:#9a9a9a;border-color:#d4d4d4;box-shadow:none;cursor:default;background-color:#f4f4f4;background-image:none;text-decoration:none}.introjs-hidden{display:none}.introjs-bullets{text-align:center}.introjs-bullets ul{box-sizing:content-box;clear:both;margin:15px auto 0;padding:0;display:inline-block}.introjs-bullets ul li{list-style:none;float:left;margin:0 2px}.introjs-bullets ul li a{display:block;width:6px;height:6px;background:#ccc;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;text-decoration:none;cursor:pointer}.introjs-bullets ul li a.active,.introjs-bullets ul li a:hover{background:#999}.introjs-progress{overflow:hidden;height:10px;margin:10px 0 5px;border-radius:4px;background-color:#ecf0f1}.introjs-progressbar{float:left;width:0;height:100%;font-size:10px;line-height:10px;text-align:center;background-color:#08c}.introjsFloatingElement{position:absolute;height:0;width:0;left:50%;top:50%}.introjs-fixedTooltip{position:fixed}.introjs-hint{position:absolute;background:0 0;width:20px;height:15px;cursor:pointer}.introjs-hint:focus{border:0;outline:0}.introjs-hidehint{display:none}.introjs-fixedhint{position:fixed}.introjs-hint-dot,.introjs-hint-pulse{box-sizing:content-box;position:absolute}.introjs-hint:hover>.introjs-hint-pulse{border:5px solid rgba(60,60,60,.57)}.introjs-hint-pulse{width:10px;height:10px;border:5px solid rgba(60,60,60,.27);-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;background-color:rgba(136,136,136,.24);z-index:10;-webkit-transition:all .2s ease-out;-moz-transition:all .2s ease-out;-ms-transition:all .2s ease-out;-o-transition:all .2s ease-out;transition:all .2s ease-out}.introjs-hint-no-anim .introjs-hint-dot{-webkit-animation:none;-moz-animation:none;animation:none}.introjs-hint-dot{border:10px solid rgba(146,146,146,.36);background:0 0;-webkit-border-radius:60px;-moz-border-radius:60px;border-radius:60px;height:50px;width:50px;-webkit-animation:introjspulse 3s ease-out;-moz-animation:introjspulse 3s ease-out;animation:introjspulse 3s ease-out;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;animation-iteration-count:infinite;top:-25px;left:-25px;z-index:1;opacity:0}@-moz-keyframes introjspulse{0%{-moz-transform:scale(0);opacity:0}25%{-moz-transform:scale(0);opacity:.1}50%{-moz-transform:scale(.1);opacity:.3}75%{-moz-transform:scale(.5);opacity:.5}100%{-moz-transform:scale(1);opacity:0}}@-webkit-keyframes introjspulse{0%{-webkit-transform:scale(0);opacity:0}25%{-webkit-transform:scale(0);opacity:.1}50%{-webkit-transform:scale(.1);opacity:.3}75%{-webkit-transform:scale(.5);opacity:.5}100%{-webkit-transform:scale(1);opacity:0}}");
	addStyleString(".introjs-helperLayer,.introjs-tooltipReferenceLayer {box-sizing:content-box;background-color:transparent}");
	/*background*/
	addStyleString(".introjs-overlay{background-color:"+guideconfig['backgroundcolor']+"}");
	/*button*/
	var style_button = ".introjs-button{border:1px solid "+guideconfig['btnborder']+";color:"+guideconfig['btncolor']+";background-color:"+guideconfig['btnbackground']+";background-image:-webkit-gradient(linear,0 0,0 100%,from("+guideconfig['btnbackground']+"),to("+guideconfig['btnbackground']+"));background-image:-moz-linear-gradient("+guideconfig['btnbackground']+","+guideconfig['btnbackground']+");background-image:-o-linear-gradient("+guideconfig['btnbackground']+","+guideconfig['btnbackground']+");background-image:linear-gradient("+guideconfig['btnbackground']+","+guideconfig['btnbackground']+");-webkit-background-clip:padding;-moz-background-clip:padding;-o-background-clip:padding-box;-webkit-border-radius:.2em;-moz-border-radius:.2em;font-size:"+guideconfig['btnsize']+"px}"
	+".introjs-button:hover{border-color:#bcbcbc;box-shadow:0 1px 1px #e3e3e3}"
	+".introjs-button:active,.introjs-button:focus{background-image:-webkit-gradient(linear,0 0,0 100%,from(#ececec),to(#f4f4f4));background-image:-moz-linear-gradient(#ececec,#f4f4f4);background-image:-o-linear-gradient(#ececec,#f4f4f4);background-image:linear-gradient(#ececec,#f4f4f4)}";
	addStyleString(style_button);
};

function strToJson(str){ 
	var json = (new Function("return " + str))(); 
	return json; 
};
STEP = null;
start_step = false;
stepnumber = 0;
var UELWM = false;

var GUIDE;
function uengager_editor_init(){
	UELWM = false;
	start = false;
	$.ajax({
		type: "GET",
		dataType: 'text',
		processData: true,
		url: UENGAGER_BASE_URL+"walk/index/getWalk?callback=?",
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: {
			utoken: UENGAGER_USER_TOKEN,
		}
	}).done(function(data) {
		var da = jQuery.parseJSON(data);
		if(da.status == 10000){
			var guide = da.guide;
			GUIDE = guide;
			if(da.language == "cn"){
				var html = "<div id='uengager_editor' class='uengager_editor'>"
					+"<div class='uengager_editor_content'>"	
					+"<select class='uengager_editor_select'>"
					+"</select>"
					+"<div class='uengager_editor_button_blue uengager_editor_edit'>修改</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_delete'>删除</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_prevew'>预览</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_insert'>插入</div>"
					+"<div class='uengager_editor_button' id='add_step'>添加</div>"
					+"</div>"
					+"</div>";
					
				if(guide.guide_type == "step"){
					html += "<div class='uengager_editor_add_all hidden'>"
						+"<div class='uengager_editor_add_window'>"
						+"<div style='margin-left:20px;margin-top:30px;'>显示类型:</div>"
						+"<select id='uengager_editor_style' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>文字</option>"
						+"	<option value='1'>图片</option>"
						+"	<option value='2'>音频</option>"
						+"	<option value='3'>视频</option>"
						+"</select>"
						+"<input placeholder='图片地址' type='text' id='uengager_editor_style_value' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>"
						+"<div style='margin-left:20px;;margin-top:10px;'>显示位置:</div>"
						+"<select id='uengager_editor_position' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='auto'>自适应</option>"
						+"	<option value='top'>上部</option>"
						+"	<option value='bottom'>下部</option>"
						+"	<option value='left'>左部</option>"
						+"	<option value='right'>右部</option>"
						+"</select>"
						+"<div style='margin-left:20px;margin-top:10px;'>引导下一步位置:</div>"
						+"<select id='uengager_editor_nextpage' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>当前页面</option>"
						+"	<option value='1'>其他页面</option>"
						+"</select>"
						+"<input placeholder='下一页地址' type='text' id='uengager_editor_nextpage_url' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>";
				}else if(guide.guide_type == "hint"){
					html += "<div class='uengager_editor_add_all hidden'>"
						+"<div class='uengager_editor_add_window'>"
						+"<div style='margin-left:20px;margin-top:30px;'>显示类型:</div>"
						+"<select id='uengager_editor_style' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>文字</option>"
						+"	<option value='1'>图片</option>"
						+"	<option value='2'>音频</option>"
						+"	<option value='3'>视频</option>"
						+"</select>"
						+"<input placeholder='图片地址' type='text' id='uengager_editor_style_value' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>"
						+"<div style='margin-left:20px;;margin-top:10px;'>显示位置:</div>"
						+"<select id='uengager_editor_position' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='auto'>自适应</option>"
						+"	<option value='top'>上部</option>"
						+"	<option value='bottom'>下部</option>"
						+"	<option value='left'>左部</option>"
						+"	<option value='right'>右部</option>"
						+"</select>";
				}
					
				html += "<div style='width:150px;margin-left:140px;margin-top:10px;'>"
					+"	<div class='uengager_editor_button_blue' id='uengager_editor_add_true' style='float:left'>确定</div>"
					+"	<div class='uengager_editor_button_gray' id='uengager_editor_add_false' style='float:left'>取消</div>"
					+"</div>"
					+"</div>"
					+"</div>"
				$("body").append(html);
			}else if(da.language == "en"){
				var html = "<div id='uengager_editor' class='uengager_editor'>"
					+"<div class='uengager_editor_content'>"	
					+"<select class='uengager_editor_select'>"
					+"</select>"
					+"<div class='uengager_editor_button_blue uengager_editor_edit'>Edit</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_delete'>Delete</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_prevew'>Preview</div>"
					+"<div class='uengager_editor_button_blue uengager_editor_insert'>Insert</div>"
					+"<div class='uengager_editor_button' id='add_step'>Add</div>"
					+"</div>"
					+"</div>";
					
				if(guide.guide_type == "step"){
					html += "<div class='uengager_editor_add_all hidden'>"
						+"<div class='uengager_editor_add_window'>"
						+"<div style='margin-left:20px;margin-top:30px;'>Guide Style:</div>"
						+"<select id='uengager_editor_style' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>Text</option>"
						+"	<option value='1'>Picture</option>"
						+"	<option value='2'>Audio</option>"
						+"	<option value='3'>Video</option>"
						+"</select>"
						+"<input placeholder='Picture urls' type='text' id='uengager_editor_style_value' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>"
						+"<div style='margin-left:20px;;margin-top:10px;'>Display position:</div>"
						+"<select id='uengager_editor_position' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='auto'>Auto</option>"
						+"	<option value='top'>Top</option>"
						+"	<option value='bottom'>Bottom</option>"
						+"	<option value='left'>Left</option>"
						+"	<option value='right'>Right</option>"
						+"</select>"
						+"<div style='margin-left:20px;margin-top:10px;'>Next page:</div>"
						+"<select id='uengager_editor_nextpage' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>Current page</option>"
						+"	<option value='1'>Other page</option>"
						+"</select>"
						+"<input placeholder='Other page url' type='text' id='uengager_editor_nextpage_url' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>";
				}else if(guide.guide_type == "hint"){
					html += "<div class='uengager_editor_add_all hidden'>"
						+"<div class='uengager_editor_add_window'>"
						+"<div style='margin-left:20px;margin-top:30px;'>显示类型:</div>"
						+"<select id='uengager_editor_style' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='0'>文字</option>"
						+"	<option value='1'>图片</option>"
						+"	<option value='2'>音频</option>"
						+"	<option value='3'>视频</option>"
						+"</select>"
						+"<input placeholder='图片地址' type='text' id='uengager_editor_style_value' style='cursor: pointer;height:24px;width:260px;margin-left:20px;margin-top:10px;' class='hidden'/>"
						+"<div style='margin-left:20px;;margin-top:10px;'>显示位置:</div>"
						+"<select id='uengager_editor_position' style='cursor: pointer;margin-left:20px;height:30px;width:260px;'>"
						+"	<option value='auto'>自适应</option>"
						+"	<option value='top'>上部</option>"
						+"	<option value='bottom'>下部</option>"
						+"	<option value='left'>左部</option>"
						+"	<option value='right'>右部</option>"
						+"</select>";
				}
					
				html += "<div style='width:150px;margin-left:140px;margin-top:10px;'>"
					+"	<div class='uengager_editor_button_blue' id='uengager_editor_add_true' style='float:left'>Ensure</div>"
					+"	<div class='uengager_editor_button_gray' id='uengager_editor_add_false' style='float:left'>Cancel</div>"
					+"</div>"
					+"</div>"
					+"</div>"
				$("body").append(html);
			}
			
			var xx = 1;
			var step = guide.step;
			if (step != null) {
				for (var i = 0; i < step.length; i++) {
					var content;
					if(step[i].content != null){
						content = strToJson(step[i].content);
					}
					if (content != null && content.length > 0) {
						for (var j = 0; j < content.length; j++) {
							$('.uengager_editor_select').append('<option value="'+xx+'">步骤'+xx+'</option>');
							xx++;
						}
					}
				}
			}
			uengager_editor_guide_id = da.guide.id;
			uengager_guide_on = guide;
			guideconfig = uengager_guide_on.config;
			addcss();
			stepnumber = xx;
		}else{
			alert(da.msg);
		}
	});
}

uengager_editor_init();
var uengager_dompath_xxx;
var uengager_step_add = false;
var result = "";
var start1 = false;
var Steps = "";
function startEditor(dompath, position) {
  var editor = introJs();
	try{
		var add = "";
		if(STEP_STYLE > 0){
			switch(STEP_STYLE){
				case '1':add = '<div class="uengager_play_ask_button_a" style="height:140px;"><img style="width:100%;overfollow:inherit;padding-top:0" src="'+STEP_STYLE_VALUE+'"/></div>';break;
				case '2':add='<div class="uengager_play_ask_button_a" style="height:30px;"><input style="float:left;width:50px;margin-left:20px;" type="button" class="mp3play btn btn-success" value="播放" title="播放"/><audio id="mp3play" src="'+STEP_STYLE_VALUE+'"></audio></div>';break;
				case '3':add='<div class="uengager_play_ask_button_a" style="height:100px;"><video class="margin" controls="controls" width=200 height=200 autoplay="autoplay"><source src="'+STEP_STYLE_VALUE+'" type="video/mp4" /></video></div>';break;
			}
		};
		editor.setOptions({
			hidePrev: true,
			hideNext: true,
			showStepNumbers: false,
			disableInteraction: false,
			exitOnOverlayClick: false,
			hintAnimation: false,
			showProgress: false,
			showBullets: false,
			showButton: false,
			overlayOpacity: guideconfig.background,
			doneLabel: '保存',
			onClick: myExampleClickHandler,
			steps: [{
				element: document.querySelector(dompath),
				intro: '<input style="border:solid gray 1px;width:100%;" class="ue-input" type="text">'+add,
				position: position
			}]
		});
		editor.start();
	}catch(e){
		alert("1005错误，请重新打开引导并刷新页面重试");
		alert(e.message);
	};
}

function startEditor1(step, elemen, position, intro) {
	  var editor = introJs();
		try{
			editor.setOptions({
				hidePrev: true,
				hideNext: true,
				showStepNumbers: false,
				disableInteraction: false,
				exitOnOverlayClick: false,
				hintAnimation: false,
				showProgress: false,
				showBullets: false,
				showButton: false,
				overlayOpacity: uengager_guide_on.config.background,
				doneLabel: '完成',
				steps: [{
					element: elemen,
					intro: '<input style="border:solid gray 1px;width:100%;" class="ue-edit-input" type="text" value="'+intro+'">',
					position: position
				}]
			});
			editor.start();
			return;
		}catch(e){
			alert("1001错误，请重新打开引导并刷新页面重试");
		}
	}
function startEditorprevew(step) {
  var editor = introJs();
	try{
		editor.setOptions({
			hidePrev: true,
			hideNext: true,
			showStepNumbers: false,
			disableInteraction: false,
			exitOnOverlayClick: false,
			hintAnimation: false,
			showProgress: false,
			showBullets: false,
			showButton: false,
			overlayOpacity: uengager_guide_on.config.background,
			doneLabel: '完成',
			steps: [eval('(' + step + ')')]
		});
		editor.start();
		return;
	}catch(e){
			alert("1002错误，请重新打开引导并刷新页面重试");
	};
}
function startEditor_en(dompath, position) {
  var editor = introJs();
	try{
		var add = "";
		if(STEP_STYLE > 0){
			switch(STEP_STYLE){
				case '1':add = '<div class="uengager_play_ask_button_a" style="height:140px;"><img style="width:100%;overfollow:inherit;padding-top:0" src="'+STEP_STYLE_VALUE+'"/></div>';break;
				case '2':add='<div class="uengager_play_ask_button_a" style="height:30px;"><input style="float:left;width:50px;margin-left:20px;" type="button" class="mp3play btn btn-success" value="播放" title="播放"/><audio id="mp3play" src="'+STEP_STYLE_VALUE+'"></audio></div>';break;
				case '3':add='<div class="uengager_play_ask_button_a" style="height:100px;"><video class="margin" controls="controls" width=200 height=200 autoplay="autoplay"><source src="'+STEP_STYLE_VALUE+'" type="video/mp4" /></video></div>';break;
			}
		};
		editor.setOptions({
			hidePrev: true,
			hideNext: true,
			showStepNumbers: false,
			disableInteraction: false,
			exitOnOverlayClick: false,
			hintAnimation: false,
			showProgress: false,
			showBullets: false,
			showButton: false,
			overlayOpacity: guideconfig.background,
			doneLabel: 'Save',
			onClick: myExampleClickHandler,
			steps: [{
				element: document.querySelector(dompath),
				intro: '<input style="border:solid gray 1px;width:100%;" class="ue-input" type="text">'+add,
				position: position
			}]
		});
		editor.start();
	}catch(e){
		alert("1005错误，请重新打开引导并刷新页面重试");
		alert(e.message);
	};
}

function startEditor1_en(step, elemen, position, intro) {
	  var editor = introJs();
		try{
			editor.setOptions({
				hidePrev: true,
				hideNext: true,
				showStepNumbers: false,
				disableInteraction: false,
				exitOnOverlayClick: false,
				hintAnimation: false,
				showProgress: false,
				showBullets: false,
				showButton: false,
				overlayOpacity: uengager_guide_on.config.background,
				doneLabel: 'Save',
				steps: [{
					element: elemen,
					intro: '<input style="border:solid gray 1px;width:100%;" class="ue-edit-input" type="text" value="'+intro+'">',
					position: position
				}]
			});
			editor.start();
			return;
		}catch(e){
			alert("1001错误，请重新打开引导并刷新页面重试");
		}
	}
function startEditorprevew_en(step) {
  var editor = introJs();
	try{
		editor.setOptions({
			hidePrev: true,
			hideNext: true,
			showStepNumbers: false,
			disableInteraction: false,
			exitOnOverlayClick: false,
			hintAnimation: false,
			showProgress: false,
			showBullets: false,
			showButton: false,
			overlayOpacity: uengager_guide_on.config.background,
			doneLabel: 'Done',
			steps: [eval('(' + step + ')')]
		});
		editor.start();
		return;
	}catch(e){
			alert("1002错误，请重新打开引导并刷新页面重试");
	};
}

$(document).on('change', '.ue-edit-input', function() {
    step_result = $(".ue-edit-input").val();
})
var uengager_editor_style = 0;
$(document).on("click","#add_step", function(){
	$("#uengager_editor_style").val("0");
	$("#uengager_editor_style_value").val("");
	$("#uengager_editor_style_value").addClass("hidden");
	if(uengager_guide_on.guide_type == "step"){
		$(".uengager_editor_add_window").css("height","280px");
		$("#uengager_editor_nextpage_url").val("");
		$("#uengager_editor_nextpage").val("0");
		$("#uengager_editor_nextpage_url").addClass("hidden");
	}else if(uengager_guide_on.guide_type == "hint"){
		$(".uengager_editor_add_window").css("height","210px");
	}
	NEXT_PAGE_URL = null;
	uengager_editor_style = 0;
	$(".uengager_editor_add_all").removeClass("hidden");
	
});
var regexurl = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i
$(document).on("click","#uengager_editor_add_true",function(){
	if($("#uengager_editor_nextpage").val() == 1){
		NEXT_PAGE_URL = $("#uengager_editor_nextpage_url").val();
		if (!regexurl.test(NEXT_PAGE_URL.trim())) {
			alert("下一页链接格式错误");	
			return;
	    }
	}
	STEP_POSITION = $("#uengager_editor_position").val();
	STEP_STYLE = $("#uengager_editor_style").val();
	STEP_STYLE_VALUE = $("#uengager_editor_style_value").val();
	if(STEP_STYLE != null && STEP_STYLE > 0){
		if(STEP_STYLE_VALUE == null || STEP_STYLE_VALUE.trim().length <= 0){
			alert("显示类型参数错误");
			return;
		}
	}
	$(".uengager_editor_add_all").remove();
	$("#uengager_editor").html("");
	$("#uengager_editor").removeClass("uengager_editor");
	$("#uengager_editor").addClass("uengager_editor_left");
	$("#uengager_editor").html("<div id='uengager_editor_left_word' style='font-size:12px;color:#FFFFFF;margin-top:30px;line-height:15px;width:20px;height:135px;'>按Esc键取消当前操作</div>");
	uengager_myDomOutline.start();
	uengager_step_add = true;
	UELWM = true;
	ESC();
});
function ESC(){
	if(!UELWM)return;
	setTimeout(function(){
		var uelwm = parseInt($("#uengager_editor_left_word").css("margin-top"));
		if(uelwm > -120){
			uelwm -= 1;
		}else{
			uelwm = 30;
		}
		$("#uengager_editor_left_word").css("margin-top",uelwm+"px");
		ESC();
	},50);
}
$(document).on("click","#uengager_editor_add_false",function(){
	$(".uengager_editor_add_all").addClass("hidden");
});
$(document).on("click", ".uengager_editor_left", function(){
	$("#uengager_editor").remove();
	uengager_editor_init();
});
$(document).on("change", "#uengager_editor_nextpage", function(){
	var pageurl = $("#uengager_editor_nextpage").val();
	if(pageurl == 0){
		$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()-40);
		$("#uengager_editor_nextpage_url").addClass("hidden");
	}else{
		$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()+40);
		$("#uengager_editor_nextpage_url").val("");
		$("#uengager_editor_nextpage_url").removeClass("hidden");
	}
});
function startEditor_hint(dompath, position) {
	var editor = introJs();
	try{
		var add = "";
		editor.setOptions({
			hidePrev: true,
			hideNext: true,
			showStepNumbers: false,
			disableInteraction: false,
			exitOnOverlayClick: false,
			hintAnimation: false,
			showProgress: false,
			showBullets: false,
			showButton: false,
			overlayOpacity: guideconfig.background,
			doneLabel: '保存',
			onClick: myExampleClickHandler,
			steps: [{
				element: document.querySelector(dompath),
				intro: '<input style="border:solid gray 1px;width:100%;" class="ue-input" type="text">',
				position: position
			}]
		});
		editor.start();
	}catch(e){
		alert("1005错误，请重新打开引导并刷新页面重试");
		alert(e.message);
	};
	  /*var editor = introJs();
		try{
			editor.setOptions({
				hidePrev: false,
				hideNext: false,
				showStepNumbers: false,
				disableInteraction: true,
				showProgress: false,
				showBullets: false,
				showButton: false,
				hintButtonLabel: '保存',
				onClick: myExampleClickHandler,
				hints: [
					{
					  element: document.querySelector(dompath),
					  hint: '<input style="border:solid gray 1px;width:100%;" class="ue-input" type="text">',
					  hintPosition: 'top'
					}
				  ]
			});
			editor.addHints();
			$(".introjs-hint").click();
		}catch(e){
			alert(e.message);
			alert("1004错误，请重新打开引导并刷新页面重试");
		};*/
	}
$(document).on("change", "#uengager_editor_style", function(){
	var pageurl = $("#uengager_editor_style").val();
	if(pageurl == 0){
		if(uengager_editor_style > 0){
			$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()-38);
		}
		$("#uengager_editor_style_value").addClass("hidden");
		uengager_editor_style = 0;
	}else{
		if(uengager_editor_style == 0){
			$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()+38);
		}
		uengager_editor_style = pageurl;
		$("#uengager_editor_style_value").val("");
		switch(pageurl){
			case "1":$("#uengager_editor_style_value").attr("placeholder","图片url地址");break;
			case "2":$("#uengager_editor_style_value").attr("placeholder","音频url地址");break;
			case "3":$("#uengager_editor_style_value").attr("placeholder","视频url地址");break;
			default:break;
		}
		
		$("#uengager_editor_style_value").removeClass("hidden");
	}
});
$(document).on("change", "#uengager_editor_nextpage", function(){
	var pageurl = $("#uengager_editor_nextpage").val();
	if(pageurl == 0){
		$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()-38);
		$("#uengager_editor_nextpage_url").addClass("hidden");
	}else{
		$(".uengager_editor_add_window").css("height",$(".uengager_editor_add_window").height()+38);
		$("#uengager_editor_nextpage_url").val("");
		$("#uengager_editor_nextpage_url").removeClass("hidden");
	}
});
$(document).on('change', '.ue-input', function() {
    result = $(".ue-input").val();
});
function previewstep(){
	browser.tabs.executeScript(null, {file: "js/jquery.min.js"});
	var code = "document.cookie='step_uengagerxxxx_edit=" + JSON.stringify(step) + "';$('script[src=\"moz-extension/data/js/dom_step.js\"]').remove();";
	browser.tabs.executeScript({code: code});
	browser.tabs.executeScript(null, {file: "js/dom_step.js"});
}
function editstep(stepnumber, steptype){	
	if(steptype == 1){
		$.ajax({
			type: "POST",
			dataType: 'text',
			url: UENGAGER_BASE_URL+"Walk/Index/priviewWalk",
			data:{id:uengager_guide_on.id,stepnumber:stepnumber,steptype:steptype}
		  }).done(function(data) {
			  var da = jQuery.parseJSON(data);
			  if(da.status == 10000){
				  alert("删除成功");
				  $("#uengager_editor").remove();
				  uengager_editor_init();
			  }else{
				  alert(da.msg);
			  }
		});
		return;
	}else if(steptype == 4){
		$.ajax({
			type: "POST",
			dataType: 'text',
			url: UENGAGER_BASE_URL+"Walk/Index/priviewWalk",
			data:{id:uengager_guide_on.id,stepnumber:stepnumber,steptype:steptype}
		  }).done(function(data) {
			  var da = jQuery.parseJSON(data);
			  if(da.status == 10000){
				  if(GUIDE.language == "cn"){
					  startEditorprevew(da.step);
				  }else if(GUIDE.language == "en"){
					  startEditorprevew_en(da.step);
				  }
			  }else{
				  alert(da.status+"|"+da.msg);
			  }
		});
	}else if(steptype == 2){
		start_step = true;
		$.ajax({
			type: "POST",
			dataType: 'text',
			url: UENGAGER_BASE_URL+"Walk/Index/priviewWalk",
			data:{id:uengager_guide_on.id,stepnumber:stepnumber,steptype:4}
		  }).done(function(data) {
			  var da = jQuery.parseJSON(data);
			  if(da.status == 10000){
				  edit_step = da.step;
				  var st = eval('(' + da.step + ')');	
				  STEP = {stepnumber:stepnumber,steptype:steptype}
				  if(GUIDE.language == "cn"){
					  startEditor1(da.step, st.element, st.position, st.intro);
				  }else if(GUIDE.language == "en"){
					  startEditor1_en(da.step, st.element, st.position, st.intro);
				  }
				  step_result = st.intro;
			  }else{
				  alert(da.status+"|"+da.msg);
			  }
		});
	}else if(steptype == 3){
		STEP = {stepnumber:stepnumber,steptype:steptype};
		$("#add_step").click();
	}
	
}
$(document).on("click", ".uengager_editor_button_blue", function(e){
	if($(e.target).hasClass("uengager_editor_edit")){
		editstep($(".uengager_editor_select").val(),2);
	}else if($(e.target).hasClass("uengager_editor_delete")){
		editstep($(".uengager_editor_select").val(),1);
	}else if($(e.target).hasClass("uengager_editor_prevew")){
		editstep($(".uengager_editor_select").val(),4);
	}else if($(e.target).hasClass("uengager_editor_insert")){
		editstep($(".uengager_editor_select").val(),3);
	}
});

$(document).on('click', '*', function() {
	if(uengager_step_add && uengager_dompath_xxx != null && uengager_dompath_xxx != ""){
		uengager_step_add = false;
		result = "";
		Steps = "document.querySelector(\'"+uengager_dompath_xxx+"\')";
		if(uengager_guide_on.guide_type == "step"){
			if(GUIDE.language == "cn"){
				startEditor(uengager_dompath_xxx, STEP_POSITION);
			}else if(GUIDE.language == "en"){
				startEditor_en(uengager_dompath_xxx, STEP_POSITION);
			}
		}else if(uengager_guide_on.guide_type == "hint"){
			if(GUIDE.language == "cn"){
				startEditor_hint(uengager_dompath_xxx, STEP_POSITION);
			}else if(GUIDE.language == "en"){
				startEditor_hint(uengager_dompath_xxx, STEP_POSITION);
			}
		}
		uengager_dompath_xxx = "";
		start1 = true;
	}
});
$(document).on("click", '.introjs-button', function(){
	if(STEP != null && start_step && STEP.steptype == 2){
		start_step = false;
		$.ajax({
			type: "POST",
			dataType: 'text',
			url: UENGAGER_BASE_URL+"Walk/Index/priviewWalk",
			data:{id:uengager_guide_on.id,stepnumber:STEP.stepnumber,steptype:STEP.steptype,step:step_result}
		  }).done(function(data) {
			  STEP = null;
			  var da = jQuery.parseJSON(data);
			  if(da.status == 10000){
				  alert("修改成功");
			  }else{
				  alert(da.status+"|"+da.msg);
			  }
		});
	}else {
		if(!start1)return;
		start1 = false;
		var mySteps;
		if(STEP_STYLE > 0){
			switch(STEP_STYLE){
				case '1':result += '<div class="uengager_play_ask_button_a" style="height:140px;"><img style="width:100%;overfollow:inherit;padding-top:0" src='+STEP_STYLE_VALUE+' /></div>';break;
				case '2':result +='<div class="uengager_play_ask_button_a" style="height:30px;"><input style="float:left;width:50px;margin-left:20px;" type="button" class="mp3play btn btn-success" value="播放" title="播放"/><audio id="mp3play" src="'+STEP_STYLE_VALUE+'"></audio></div>';break;
				case '3':result +='<div class="uengager_play_ask_button_a" style="height:100px;"><video class="margin" controls="controls" width=200 height=200 autoplay="autoplay"><source src="'+STEP_STYLE_VALUE+'" type="video/mp4" /></video></div>';break;
			}
		}
		if(uengager_guide_on.guide_type == "step"){
			mySteps = {
				      "element": Steps,
				      "intro": "'"+result+"'",
				      "position": "'"+STEP_POSITION+"'"
				  };
		}else if(uengager_guide_on.guide_type == "hint"){
			mySteps = {
				      "element": Steps,
				      "hint": "'"+result+"'",
				      "hintPosition": "'"+STEP_POSITION+"'"
				  };
		}
		
	
	    	  var usteps = [];
			  usteps.push(mySteps);
			  var steptype = 999;
			  if(STEP != null && STEP.steptype == 3){
				  steptype = STEP.steptype;
				  stepnumber = STEP.stepnumber;
				  STEP = null;
			  }
	    	  $.ajax({
	    	      type: "GET",
	    	      dataType: 'text',
	    	      processData: true,
	    	      url: UENGAGER_BASE_URL+"walk/index/updateWalk?callback=?",
	    	      contentType: "application/x-www-form-urlencoded;charset=utf-8",
	    	      data: {
	    	          id: uengager_guide_on.id,
	    	          step: JSON.stringify(usteps),
	    	          position:STEP_POSITION,
					  steptype:steptype,
					  guideUrl:window.location.href,
					  utoken:UENGAGER_USER_TOKEN,
					  nextpage:NEXT_PAGE_URL,
					  stepnumber:stepnumber,
					  stepstyle:STEP_STYLE,
					  stepstylevalue:STEP_STYLE_VALUE
	    	      }
	    	  }).done(function(data) {
	    		  var da = jQuery.parseJSON(data);
	    	      if(da.status == 10000){
	    	    	  alert("success");
	    	      }else{
	    	        alert(da.msg);
	    	        alert(da.status);
	    	      }
	    	      
	    	  });
	}
	return false;
})