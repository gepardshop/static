//== 框架基本操作
var gepardUtil = function() {

    //== 通用表单提交
    var ajaxSubmit = function () {
        $(document).on('click', '.ajax-submit', function(event) {
            event.preventDefault();
            var self = $(this);
            self.attr('disabled', 'disabled');
            $.post(self.attr('action'), self.closest('form').serialize(), function(data) {
                if(data.code==200){
                    if (data.url) {
                        var message = data.msg + ' 页面即将自动跳转~';
                    } else {
                        var message = data.msg;
                    }
                    swal(message, '', "success");
                    setTimeout(function() {
                        if (self.hasClass('no-refresh')) {
                            return false;
                        }
                        if (data.url) {
                            str = data.url;
                            location.href = data.url;
                        } else {
                            location.reload();
                        }
                    }, 2000);
                }else{
                    swal(data.msg, '', "error");
                }
                self.removeAttr('disabled');
            });
            return false;
        });
    };

    //== 异步超链接交互 .ajax-form 触发
    var ajaxClick = function () {
        $(document).on('click', '.ajax-form', function(event) {
            event.preventDefault();
            var self = $(this);

            var url = self.attr('href') || self.data('url');
            if (!url) return;
            var target = self.attr('target') || '';

            //请求前处理，防止重复点击等
            self.attr('disabled', 'disabled');
            self.attr("href","#");

            $.get(url, function(data) {
                if (typeof data === 'object') {
                    if(data.code==200){
                        if (data.url && self.hasClass('no-refresh')) {
                            var message = data.msg + ' 页面即将自动跳转~';
                        } else {
                            var message = data.msg;
                        }
                        swal(message, '', "success");
                        // layer.msg(message);
                        // $.alertMessager(message, 'success');
                        setTimeout(function() {
                            if (self.hasClass('no-refresh')) {
                                return false;
                            }
                            if (data.url) {
                                str = data.url;
                                location.href = data.url;
                            } else {
                                location.reload();
                            }
                        }, 2000);
                    }else{
                        swal(data.msg, '', "error");
                    }
                    self.removeAttr('disabled');
                    self.attr("href",url);
                    return false;
                }
                //返回页面

            });
            return false;
        });
    };

    //==增强版异步交互
    var ajaxPost = function () {
        $(document).on('click', '.ajax-post', function(event) {
            event.preventDefault();
            var target, query, form;
            var target_form = $(this).attr('target-form');
            var that = this;
            var nead_confirm = true;
            console.log('get a');
            console.log($(this).attr('type'));
            console.log($(this).attr('href'));
            // return;
            if (($(this).attr('type') == 'submit') || ($(this).attr('type') == 'ajax_submit')|| ($(this).attr('action_type') == 'ajax_action')|| (target = $(this).attr('href')) || (target = $(this).attr('url'))) {
                form = $('.' + target_form);

                if ($(this).attr('hide-data') === 'true') { //无数据时也可以使用的功能
                    form = $('.hide-data');
                    query = form.serialize();
                } else if (form.get(0) == undefined) {
                    if ($(this).hasClass('confirm')) {
                        if (!confirm('确认要执行该操作吗?')) {
                            return false;
                        }
                    }
                    target = $(this).attr('href');
                    query = form.serialize();
                    console.log(1);
                    console.log(form);
                    // return false;
                } else if (form.get(0).nodeName == 'FORM') {
                    console.log(2);
                    if ($(this).hasClass('confirm')) {
                        if (!confirm('确认要执行该操作吗?')) {
                            return false;
                        }
                    }
                    if ($(this).attr('url') !== undefined) {
                        target = $(this).attr('url');
                    } else {
                        target = form.get(0).action;
                    }
                    query = form.serialize();
                } else if (form.get(0).nodeName == 'INPUT' || form.get(0).nodeName == 'SELECT' || form.get(0).nodeName == 'TEXTAREA') {
                    target = $(this).attr('href');
                    // console.log(3);
                    // console.log(target);
                    // console.log(form.get(0).nodeName);
                    form.each(function(k, v) {
                        if (v.type == 'checkbox' && v.checked == true) {
                            nead_confirm = true;
                        }
                    });
                    if (nead_confirm && $(this).hasClass('confirm')) {
                        if (!confirm('确认要执行该操作吗?')) {
                            return false;
                        }
                    }
                    query = form.serialize();
                } else {
                    if ($(this).hasClass('confirm')) {
                        if (!confirm('确认要执行该操作吗?')) {
                            return false;
                        }
                    }
                    query = form.find('input,select,textarea').serialize();
                }
                // console.log(query);
                // return;
                $(that).addClass('disabled');
                // myApp.showPreloader('正在提交...');
                $.ajax({
                    dataType: "json",
                    url: target,
                    data: query,
                    type: "post",
                    success: function(data) {
                        // myApp.hidePreloader();
                        if (data.code == undefined) {
                            alert(data);
                            $(that).removeClass('disabled').prop('disabled', false);
                        } else {
                            if (data.code == 200) {
                                if($(that).hasClass('m-switch'))
                                {
                                    console.log('in switch');
                                    console.log($(that).find('.switch-input').is(':checked'));
                                    if($(that).find('.switch-input').is(':checked')){
                                        $(that).find('.switch-input').removeAttr('checked');

                                    }else{
                                        $(that).find('.switch-input').attr('checked','checked');
                                    }
                                }

                                if (data.url && !$(that).hasClass('no-refresh')) {
                                    var message = data.msg + ' 页面即将自动跳转~';
                                } else {
                                    var message = data.msg;
                                }
                                if(data.data.multi_jump==1)
                                {
                                    swal({
                                        title: message,
                                        type: 'success',
                                        showCancelButton: true,
                                        confirmButtonText: "<span><span>立即跳转</span></span>",
                                        confirmButtonClass: "btn btn-danger m-btn m-btn--pill m-btn--air m-btn--icon",

                                        showCancelButton: true,
                                        cancelButtonText: "<span><a onclick=\"javascript:history.back(-1);return false;\">返回上级</a></span>",
                                        cancelButtonClass: "btn btn-secondary m-btn m-btn--pill m-btn--icon"
                                    }).then(function(result) {
                                        if (result.value) {
                                            if (data.url && !$(that).hasClass('no-forward')) {
                                                str = data.url;
                                                location.href = data.url;
                                            } else {
                                                location.reload();
                                            }
                                        }
                                    });
                                }else{
                                    swal(message, '', "success");
                                    // layer.msg(message);
                                    // $.alertMessager(message, 'success');
                                    setTimeout(function() {
                                        if ($(that).hasClass('no-refresh')) {
                                            return false;
                                        }
                                        if (data.url && !$(that).hasClass('no-forward')) {
                                            str = data.url;
                                            location.href = data.url;
                                        } else {
                                            location.reload();
                                        }
                                    }, 2000);
                                }


                            } else {
                                var message = data.msg;
                                swal(message, '', "error");
                                $(that).removeClass('disabled').prop('disabled', false);
                                if($('.reload-verify').length > 0){
                                    $('.reload-verify').click();
                                }
                            }
                        }
                    },
                    error: function(e) {
                        // myApp.hidePreloader();
                        if (e.responseText) {
                            swal(e.responseText);
                        }
                        $(that).removeClass('disabled').prop('disabled', false);
                    }
                });
            }
            return false;
        });
    };

    //== 桌面通知
    var doNotify=function () {
        var socket = io('http://'+document.domain+':2120');
        // 连接后登录
        socket.on('connect', function(){
            socket.emit('login', UID);
        });
        // 后端推送来消息时
        socket.on('new_notify', function(data){
            var temp = document.createElement("div");
            temp.innerHTML = data.html;
            var output = temp.innerText || temp.textContent;
            $('.feed_list_prepend').prepend(data.html);

            notice_user(data.cover,data.content);
        });
        // 后端推送来在线数据时
        socket.on('update_online_count', function(online_stat){
//            $('#online_box').html(online_stat);
        });
    };

    //== 用户签到
    var doSign = function() {
        //== Sweetalert Demo 1
        $('#doSign').click(function(e) {
            $.post("/api.php/common/user/Sign", {
                id: 1
            }, function (res) {
                if (res.code==200) {
                    swal(res.message, '', "success");
                } else {
                    swal(res.message, '', "warning");

                }
                //location.reload();
            });
        });


    };

    //== 积分兑换 @thinks B总 吖杰
   var buyMallGoods = function () {
       $(document).on('click', '.buy-mall-goods', function(e) {
           e.preventDefault();
           var self = $(this);
           var goods_id = self.attr('goods-id');
           self.attr('disabled', 'disabled');
           $.post("/api.php/mall/MallGoods/buyGoods", {
               id: goods_id
           }, function (res) {
               if (res.code==200) {
                   swal(res.message, '', "success");
                   if (res.url) {
                       setTimeout(function () {
                           location.href = res.url;
                       }, 500);
                   }
               } else {
                   swal(res.message, '', "warning");
                   if (res.url) {
                       setTimeout(function () {
                           location.href = res.url;
                       }, 500);
                   }

               }
               //location.reload();
           });
       });

    };

    //== 积分兑换 @thinks B总 吖杰
    var buyLotteryGoods = function () {
        $(document).on('click', '.buy-lottery-goods', function(e) {
            e.preventDefault();
            var self = $(this);
            var goods_id = self.attr('lucknum-id');
            self.attr('disabled', 'disabled');
            $.post("/api.php/lottery/LotteryItem/Buy", {
                id: goods_id
            }, function (res) {
                if (res.code==200) {
                    self.removeClass('m--bg-success');
                    self.addClass('m--bg-metal');
                    swal(res.message, '', "success");
                    if (res.url) {
                        setTimeout(function () {
                            location.href = res.url;
                        }, 500);
                    }
                } else {
                    swal(res.message, '', "warning");
                    if (res.url) {
                        setTimeout(function () {
                            location.href = res.url;
                        }, 500);
                    }

                }
                //location.reload();
            });
        });

    };

    //== 网页倒计时
    var countDown = function () {
        $(".count-down").each(function(){
            $(this).downCount({
                date: $(this).attr('end-time'),
                offset: +10
            }, function (){
                swal('当前竞猜活动已结束', '', "warning");
            });
        });
    };

    var selectSave = function () {
        $('.m-bootstrap-select2').click(function(e) {
            var self = $(this);
            self.select2();
            self.on("select2:select",function(){
                var data = self.val();

                var url = self.attr('url') || self.data('url');
                console.log(data);
                console.log(url);
                console.log(self);
                console.log(self.attr('url'));
                if (!url) return;
                var target = self.attr('target') || '';

                //请求前处理，防止重复点击等
                self.attr('disabled', 'disabled');
                self.attr("href","#");

                $.get(url, function(html) {
                    if (typeof html === 'object') {
                        if(html.code==200){
                            swal(html.msg, '', "success");
                        }else{
                            swal(html.msg, '', "error");
                        }
                        self.removeAttr('disabled');
                        self.attr("href",url);
                        return false;
                    }
                    //返回页面

                });
            });
        });
    };

    var selectChange=function () {

        $(document).on('select', '.m-bootstrap-select2', function(event) {
            event.preventDefault();
            var self = $(this);
            self.select2();
            var data = self.val();
            alert(data);
            var url = self.attr('href') || self.data('url');
            if (!url) return;
            var target = self.attr('target') || '';

            //请求前处理，防止重复点击等
            self.attr('disabled', 'disabled');
            self.attr("href","#");

            $.get(url, function(html) {
                if (typeof html === 'object') {
                    if(html.code==200){
                        swal(html.msg, '', "success");
                    }else{
                        swal(html.msg, '', "error");
                    }
                    self.removeAttr('disabled');
                    self.attr("href",url);
                    return false;
                }
                //返回页面

            });
            return false;
        });
    };

    //== 文本自动复制
    var copyMe = function () {
        var clipboard = new Clipboard('.copy-me');
        clipboard.on('success', function(e) {
            swal('复制成功', '', "success");
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            swal('复制失败', '', "warning");
        });
    };

    //== 备用
    var backUp = function(){
        //== Sweetalert Demo 2
        $('#m_sweetalert_demo_2').click(function(e) {
            swal("Here's the title!", "...and here's the text!");
        });

        //== Sweetalert Demo 3
        $('#m_sweetalert_demo_3_1').click(function(e) {
            swal("Good job!", "You clicked the button!", "warning");
        });

        $('#m_sweetalert_demo_3_2').click(function(e) {
            swal("Good job!", "You clicked the button!", "error");
        });

        $('#m_sweetalert_demo_3_3').click(function(e) {
            swal("Good job!", "You clicked the button!", "success");
        });

        $('#m_sweetalert_demo_3_4').click(function(e) {
            swal("Good job!", "You clicked the button!", "info");
        });

        $('#m_sweetalert_demo_3_5').click(function(e) {
            swal("Good job!", "You clicked the button!", "question");
        });

        //== Sweetalert Demo 4
        $('#m_sweetalert_demo_4').click(function(e) {
            swal({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success",
                confirmButtonText: "Confirm me!",
                confirmButtonClass: "btn btn-focus m-btn m-btn--pill m-btn--air"
            });
        });

        //== Sweetalert Demo 5
        $('#m_sweetalert_demo_5').click(function(e) {
            swal({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success",

                confirmButtonText: "<span><i class='la la-headphones'></i><span>I am game!</span></span>",
                confirmButtonClass: "btn btn-danger m-btn m-btn--pill m-btn--air m-btn--icon",

                showCancelButton: true,
                cancelButtonText: "<span><i class='la la-thumbs-down'></i><span>No, thanks</span></span>",
                cancelButtonClass: "btn btn-secondary m-btn m-btn--pill m-btn--icon"
            });
        });

        $('#m_sweetalert_demo_6').click(function(e) {
            swal({
                position: 'top-right',
                type: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            });
        });

        $('#m_sweetalert_demo_7').click(function(e) {
            swal({
                title: 'jQuery HTML example',
                html: $('<div>')
                    .addClass('some-class')
                    .text('jQuery is everywhere.'),
                animation: false,
                customClass: 'animated tada'
            })
        });

        $('#m_sweetalert_demo_8').click(function(e) {
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                if (result.value) {
                    swal(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            });
        });

        $('#m_sweetalert_demo_9').click(function(e) {
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function(result){
                if (result.value) {
                    swal(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    // result.dismiss can be 'cancel', 'overlay',
                    // 'close', and 'timer'
                } else if (result.dismiss === 'cancel') {
                    swal(
                        'Cancelled',
                        'Your imaginary file is safe :)',
                        'error'
                    )
                }
            });
        });

        $('#m_sweetalert_demo_10').click(function(e) {
            swal({
                title: 'Sweet!',
                text: 'Modal with a custom image.',
                imageUrl: 'https://unsplash.it/400/200',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
                animation: false
            });
        });

        $('#m_sweetalert_demo_11').click(function(e) {
            swal({
                title: 'Auto close alert!',
                text: 'I will close in 5 seconds.',
                timer: 5000,
                onOpen: function() {
                    swal.showLoading()
                }
            }).then(function(result) {
                if (result.dismiss === 'timer') {
                    console.log('I was closed by the timer')
                }
            })
        });
    };

    //== 用户登陆
    var login = $('#m_login');

    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.animateClass('fadeIn animated');
        alert.find('span').html(msg);
    };

    //== Private Functions

    var handleVerifyButton = function(){
        /*防刷新：检测是否存在cookie*/
        if(Cookies.get("sms_verify")){
            var count = Cookies.get("sms_verify");
            var btn = $('#send_verify_button');
            btn.html(count+'秒后可重新获取').attr('disabled',true).css('cursor','not-allowed');
            var resend = setInterval(function(){
                count--;
                if (count > 0){
                    btn.html(count+'秒后可重新获取').attr('disabled',true).css('cursor','not-allowed');
                    Cookies.set("sms_verify", count, {path: '/', expires: (1/86400)*count});
                }else {
                    clearInterval(resend);
                    btn.html("获取验证码").removeClass('disabled').removeAttr('disabled style');
                }
            }, 1000);
        }

        $('#send_verify_button').click(function (e) {



            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    mobile: {
                        required: true
                    },
                    captcha: {
                        required: true,
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            //60秒限制开始
            var btn = $(this);
            var count = 15;
            var resend = setInterval(function(){
                count--;
                if (count > 0){
                    btn.html(count+"秒后可重新获取");
                    Cookies.set("sms_verify", count, {path: '/', expires: (1/86400)*count});
                }else {
                    clearInterval(resend);
                    btn.html("获取验证码").removeAttr('disabled style');
                }
            }, 1000);
            btn.attr('disabled',true).css('cursor','not-allowed');
            //60秒限制结束

            form.ajaxSubmit({
                type: 'post',
                cache: false,
                data: form.serialize(),
                url: form.attr("notify_api"),
                dataType: "json",
                success: function (response, status, xhr, $form) {

                    if (response.code == 200) {
                        swal(response.msg, '', "success");
                    } else if (response.msg) {
                        $(".reloadverify").click();
                        swal(response.msg, '', "error");
                    }else{
                        swal('请求出错，当前站点尚未开启短信功能，无法注册', '', "error");
                    }

                    // similate 2s delay
                },
                error: function (response, status, xhr, $form) {
                    swal('请求出错，当前站点尚未开启短信功能，无法注册', '', "error");
                }

            });
        });
    };

    var handleSignInFormSubmit = function () {
        $('#m_login_signin_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    mobile: {
                        required: true,
                        // email: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                type: form.attr("method"),
                cache: false,
                data: form.serialize(),
                url: form.attr("action"),
                dataType: "json",
                success: function (response, status, xhr, $form) {
                    console.log(response);
                    console.log(status);
                    console.log(xhr);

                    if (response.code == 200) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        swal(response.msg, '', "success");
                        setTimeout(function () {
                            window.location.href = response.url
                        }, 2000);
                    } else if (response.msg) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        swal(response.msg, '', "error");
                    }
                    // similate 2s delay
                    setTimeout(function () {
                        // btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        // showErrorMsg(form, 'danger', '用户名或密码错误. 请重新输入.');
                    }, 2000);
                },
                error: function (response, status, xhr, $form) {
                    swal('请求出错，登录失败', '', "error");
                }
            });
        });
    };

    var handleSignUpFormSubmit = function () {
        $('#m_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    mobile: {
                        required: true
                    },
                    sms_verify: {
                        required: true,
                    },
                    password: {
                        required: true
                    },
                    captcha: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                type: form.attr("method"),
                cache: false,
                data: form.serialize(),
                url: form.attr("action"),
                dataType: "json",
                success: function (response, status, xhr, $form) {

                    if (response.code == 200) {

                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        // form.clearForm();
                        // form.validate().resetForm();

                        // display signup form
                        // displaySignInForm();
                        // var signInForm = login.find('.m-login__signin form');
                        // signInForm.clearForm();
                        // signInForm.validate().resetForm();
                        swal(response.msg, '', "success");
                        setTimeout(function () {
                            window.location.href = response.url
                        }, 2000);
                    } else if (response.msg) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        // form.clearForm();
                        // form.validate().resetForm();
                        swal(response.msg, '', "error");
                    }

                    // similate 2s delay
                },
                error: function (response, status, xhr, $form) {
                    swal('请求出错，注册失败', '', "error");
                }
            });
        });
    };

    var handleForgetPasswordFormSubmit = function () {
        $('#m_login_forget_password_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    mobile: {
                        required: true,
                    },
                    sms_verify: {
                        required: true,
                    },
                    captcha: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                type: form.attr("method"),
                cache: false,
                data: form.serialize(),
                url: form.attr("action"),
                dataType: "json",
                success: function (response, status, xhr, $form) {

                    if (response.code == 200) {

                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        // form.clearForm();
                        // form.validate().resetForm();

                        // display signup form
                        // displaySignInForm();
                        // var signInForm = login.find('.m-login__signin form');
                        // signInForm.clearForm();
                        // signInForm.validate().resetForm();
                        swal(response.msg, '', "success");
                        // showErrorMsg(form, 'success', response.msg);
                        setTimeout(function () {
                            window.location.href = response.url
                        }, 2000);
                    } else if (response.msg) {
                        btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                        // form.clearForm();
                        // form.validate().resetForm();
                        swal(response.msg, '', "error");
                        // showErrorMsg(form, 'danger', response.msg);
                    }else{
                        swal('请求出错', '', "error");
                    }

                    // similate 2s delay
                },
                error: function (response, status, xhr, $form) {
                    swal('请求出错', '', "error");
                }
            });
        });
    }

    return {

        //== Init
        init: function() {
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgetPasswordFormSubmit();
            handleVerifyButton();

            doSign();
            ajaxSubmit();
            ajaxClick();
            ajaxPost();
            buyMallGoods();
            buyLotteryGoods();
            countDown();
            selectSave();
            copyMe();


        },
    };
}();

//== 初始化
jQuery(document).ready(function() {
    gepardUtil.init();
});
