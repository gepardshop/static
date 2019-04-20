// 当前资源URL目录
var baseRoot = (function () {
    var scripts = document.scripts, src = scripts[scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

// 配置参数
require.config({
    waitSeconds: 60,
    baseUrl: baseRoot,
    map: {'*': {css: baseRoot + 'require/require.css.js'}},
    paths: {
        'template': ['template/template'],
        'pcasunzips': ['jquery/pcasunzips'],
        // openSource
        'json': ['jquery/json2.min'],
        'layui': ['layui/layui'],
        'ueditor.config': ['ueditor/ueditor.config'],
        'ueditor': ['ueditor/ueditor.all'],
        'ZeroClipboard': ['ueditor/third-party/zeroclipboard/ZeroClipboard'],
        'base64': ['jquery/base64.min'],
        'angular': ['angular/angular.min'],
        'ckeditor': ['ckeditor/ckeditor'],
        'websocket': ['socket/websocket'],
        'clipboard': ['clipboard/clipboard.min'],

        // jQuery
        'jquery': ['jquery/jquery.min'],
        'jquery.ztree': ['ztree/jquery.ztree.all.min'],
        'jquery.masonry': ['jquery/masonry.min'],
        'jquery.cookies': ['jquery/jquery.cookie'],
        'jquery.iconpicker': ['jquery/jquery.iconpicker'],
        'jquery.cityselect': ['jquery/jquery.cityselect'],
        'jqueryLazyload': ['jquery/jquery.lazyload'],
        'downCount': ['jquery/jquery.downCount'],
        'jquery.counterup': ['jquery/jquery.counterup'],
        'jquery.waypoints': ['jquery/jquery.waypoints.min'],
        'jquery-migrate': ['jquery/jquery-migrate'],
        'jquery.easing': ['jquery/jquery.easing.min'],
        'wow': ['jquery/wow'],
        // bootstrap
        'bootstrap': ['bootstrap/js/bootstrap'],
    },
    shim: {
        // open-source
        'websocket': {deps: [baseRoot + 'socket/swfobject.min.js']},
        // jquery
        'jquery.ztree': {deps: ['css!' + baseRoot + 'ztree/zTreeStyle/zTreeStyle.css']},
        // bootstrap
        'ueditor': ['ueditor.config', 'ZeroClipboard'],
        'jquery.counterup': ['jquery.waypoints'],
        'jqueryLazyload': ['jquery'],
    },
    deps: ['json', 'bootstrap'],

    // 开启debug模式，不缓存资源
    // urlArgs: "ver=" + (new Date()).getTime()
});

// 注册jquery到require模块
define('jquery', function () {
    return layui.$;
});

// UI框架初始化
PageLayout.call(this);

// UI框架布局函数
function PageLayout(callback, custom) {
    window.WEB_SOCKET_SWF_LOCATION = baseRoot + "socket/WebSocketMain.swf";
    require(custom || [], callback || false);
}