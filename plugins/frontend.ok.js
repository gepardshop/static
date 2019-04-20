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
        'jquery.lazyload': ['jquery/jquery.lazyload'],
        'jquery.downCount': ['jquery/jquery.downCount'],
        'jquery.counterup': ['jquery/jquery.counterup'],
        'jquery.waypoints': ['jquery/jquery.waypoints.min'],
        'jquery-migrate': ['jquery/jquery-migrate'],
        'jquery.easing': ['jquery/jquery.easing'],
        'jquery.fancybox': ['fancybox/jquery.fancybox'],
        'jquery.smooth': ['smooth-scroll/jquery.smooth-scroll'],
        'wow': ['jquery/wow'],
        'typed': ['jquery/typed'],
        'jquery.requestAnimationFrame': ['ilightbox/js/jquery.requestAnimationFrame'],
        'jquery.mousewheel': ['ilightbox/js/jquery.mousewheel'],
        'ilightbox.packed': ['ilightbox/js/ilightbox.packed'],
        'isotope.pkgd': ['isotope/isotope.pkgd.min'],
        'imagesloaded.pkgd': ['isotope/imagesloaded.pkgd.min'],
        'packery-mode.pkgd': ['isotope/packery-mode.pkgd.min'],
        'layout-mode': ['isotope/js/layout-mode'],
        //动画插件
        'jquery.themepunch.tools': ['revo-slider/js/jquery.themepunch.tools.min'],
        'jquery.themepunch.revolution': ['revo-slider/js/jquery.themepunch.revolution.min'],
        'revolution.extension.slideanims': ['revo-slider/js/extensions/revolution.extension.slideanims.min'],
        'revolution.extension.layeranimation': ['revo-slider/js/extensions/revolution.extension.layeranimation.min'],
        'revolution.extension.navigation': ['revo-slider/js/extensions/revolution.extension.navigation.min'],
        'revolution.extension.video': ['revo-slider/js/extensions/revolution.extension.video.min'],
        'revolution.extension.parallax': ['revo-slider/js/extensions/revolution.extension.parallax.min'],
        'jquery.cubeportfolio': ['cubeportfolio/js/jquery.cubeportfolio.min'],
        'extended-portfolio': ['cubeportfolio/js/extended-portfolio'],
        'owl.carousel': ['owl-carousel/owl.carousel.min'],

        // bootstrap
        'bootstrap': ['bootstrap/js/bootstrap'],
        'bootstrap.typeahead': ['bootstrap/js/bootstrap3-typeahead.min'],
        'bootstrap-slider': ['slider-for-bootstrap/js/bootstrap-slider'],
        'bootstrap.multiselect': ['bootstrap-multiselect/bootstrap-multiselect'],
        // distpicker
        'distpicker': ['distpicker/distpicker'],

        //npm
        'get-size/get-size': ['get-size/get-size'],
        'outlayer/outlayer': ['outlayer/outlayer'],
        'item': ['outlayer/item'],
        //自定义模块
        'frontendapp': ['awaking/frontendapp'],
    },
    shim: {
        // open-source
        'websocket': {deps: [baseRoot + 'socket/swfobject.min.js']},
        // jquery
        'jquery.ztree': {deps: ['css!' + baseRoot + 'ztree/zTreeStyle/zTreeStyle.css']},
        // bootstrap
        'bootstrap.typeahead': {deps: ['bootstrap']},
        'bootstrap.multiselect': {deps: ['bootstrap', 'css!' + baseRoot + 'bootstrap-multiselect/bootstrap-multiselect.css']},
        'distpicker': {deps: [baseRoot + 'distpicker/distpicker.data.js']},
        'ueditor': ['ueditor.config', 'ZeroClipboard'],
        'jquery.counterup': ['jquery.waypoints'],
        'bootstrap': ['jquery'],
        'extended-portfolio': ['jquery.cubeportfolio'],
        'ilightbox.packed': ['jquery'],
        'packery-mode.pkgd': ['layout-mode', 'imagesloaded.pkgd'],
        'layout-mode': ['get-size/get-size', 'outlayer/outlayer'],
        'outlayer': ['get-size/get-size'],
        // 'item': ['get-size/get-size'],
        'get-size/get-size': ['item'],
        'owl.carousel': ['jquery'],
        'frontendapp': ['jquery', 'bootstrap'],
        'jquery.fancybox': ['jquery'],
        'jquery.cubeportfolio': ['jquery'],
        'jquery.themepunch.revolution': ['jquery', 'jquery.themepunch.tools'],
        'revolution.extension.parallax': ['jquery', 'jquery.themepunch.revolution'],
        'revolution.extension.slideanims': ['jquery', 'jquery.themepunch.revolution'],
        'revolution.extension.layeranimation': ['jquery', 'jquery.themepunch.revolution'],
        'revolution.extension.navigation': ['jquery', 'jquery.themepunch.revolution'],
        'revolution.extension.video': ['jquery', 'jquery.themepunch.revolution'],
    },
    deps: ['json', 'bootstrap'],

    // 开启debug模式，不缓存资源
    // urlArgs: "ver=" + (new Date()).getTime()
});

// UI框架初始化
PageLayout.call(this);

// UI框架布局函数
function PageLayout(callback, custom) {
    window.WEB_SOCKET_SWF_LOCATION = baseRoot + "socket/WebSocketMain.swf";
    require(custom || [], callback || false);
}