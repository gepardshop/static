javascript: (function() {
    uengagerloadjscssfile = function(filename, filetype) {
        if (filetype == "js") {
            var fileref = document.createElement("script");
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
            fileref.setAttribute("charset", "utf-8")
        } else {
            if (filetype == "css") {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
                fileref.setAttribute("charset", "utf-8")
            }
        }
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref)
        }
    };
    uengager_start = function() {
        if (typeof(UENGAGER_EDITOR_START) == "undefined") {
            UENGAGER_EDITOR_START = 1
        } else {
            if (UENGAGER_EDITOR_START == 1) {
                return
            } else {
                UENGAGER_EDITOR_START = 1
            }
        }
        UENGAGER_BASE_URL = "http://www.thinkphp5.com/";
        uengagerloadjscssfile(UENGAGER_BASE_URL + "ui/apps/walk/loadwalk.js", "js");
        UENGAGER_USER_TOKEN = "ce535bbfeaea3fe36ce7875f1d51a8095855613bd54223acc9997b4b43900eae"
    };
    uengager_start();
})();