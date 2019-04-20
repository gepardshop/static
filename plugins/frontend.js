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
        'counterUp': ['counterup/jquery.counterUp'],
        'jquery.waypoints': ['waypoints/jquery.waypoints'],
        'jquery-migrate': ['jquery/jquery-migrate'],
        'jquery.easing': ['jquery/jquery.easing'],
        'jquery.fancybox': ['fancybox/jquery.fancybox'],
        'jquery.smooth': ['smooth-scroll/jquery.smooth-scroll'],
        'wow': ['jquery/wow'],
        'typed': ['jquery/typed'],
        'jquery.requestAnimationFrame': ['ilightbox/js/jquery.requestAnimationFrame'],
        'jquery.mousewheel': ['ilightbox/js/jquery.mousewheel'],
        'ilightbox': ['ilightbox/js/ilightbox'],
        'isotope': ['isotope/js/isotope'],
        'imagesLoaded': ['isotope/imagesLoaded.pkgd.min'],
        'packery-mode': ['isotope/packery-mode.pkgd.min'],
        'layout-mode': ['isotope/js/layout-mode'],
        'layout-modes/fit-rows': ['isotope/js/layout-modes/fit-rows'],
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
        'isotopeGallery': ['awaking/isotopeGallery'],
        'components': ['awaking/components'],
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
        'counterUp': ['jquery', 'jquery.waypoints'],
        'bootstrap': ['jquery'],
        'extended-portfolio': ['jquery.cubeportfolio'],

        'isotope': ['layout-modes/fit-rows'],
        'imagesLoaded': ['jquery', 'isotope'],
        'get-size/get-size': ['item'],
        'layout-mode': ['get-size/get-size', 'outlayer/outlayer'],
        'ilightbox': ['jquery', 'layout-mode'],
        'outlayer': ['get-size/get-size'],
        'packery-mode': ['layout-mode', 'imagesLoaded'],
        // 'item': ['get-size/get-size'],
        'countUp': ['jquery', 'layout-mode'],
        'owl.carousel': ['jquery'],
        'frontendapp': ['jquery', 'bootstrap'],
        'isotopeGallery': ['jquery','ilightbox','imagesLoaded'],
        'components': ['jquery','bootstrap','counterUp','owl.carousel','jquery.cubeportfolio','jquery.fancybox'],
        'ilightbox':['jquery','countUp'],
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
    waitSeconds: 0,
    // 开启debug模式，不缓存资源
    // urlArgs: "ver=" + (new Date()).getTime()
});

// 注册jquery到require模块
define('jquery', function () {
    return layui.$;
});

