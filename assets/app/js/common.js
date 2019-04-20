

/**
 * 读取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }


    return null;
}

// 设置cookie
function setCookie(name, value, days) {
    var argc = setCookie.arguments.length;
    var argv = setCookie.arguments;
    var secure = (argc > 5) ? argv[5] : false;
    var expire = new Date();
    if (days == null || days == 0) days = 1;
    expire.setTime(expire.getTime() + 3600 * 1000 * 24 * days);
    document.cookie = name + "=" + escape(value) + ("; path=/") + ((secure == true) ? "; secure" : "") + ";expires=" + expire.toGMTString();
}

