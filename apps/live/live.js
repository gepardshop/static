/**
 Core script to handle the entire theme and core functions
 **/


var LiveRoom = function () {
    // Handles quick sidebar chats
    var handleChatRoom = function () {
        if (room_id == "0") {
            console.log('本直播间未开启聊天室');
            return;
        }

        var live_socket;
        var wrapper = $('.live-room');
        var wrapperChat = wrapper.find('.chats-room');
        var slimContainer = wrapperChat.find(".slimScrollDiv");
        var chatContainer = wrapperChat.find(".chats-content");
        var chatUserContainer = wrapperChat.find(".chats-user");
        var chatVipUserContainer = wrapperChat.find(".chats-vip-user");
        var input = wrapperChat.find('.chat-form .form-control');

        live_socket = new WebSocket(live_socket_addr);
        //连接成功时触发
        live_socket.onopen = function () {
            // 登录

            var login_data = '{"type":"room_init","room_id":"' + room_id + '","id":"' + uid + '", "username":"' + uname + '", "avatar":"' + avatar + '", "sign":"' + sign + '"}';
            live_socket.send(login_data);
            console.log("聊天室通讯成功，聊天室id:" + room_id);
        };

        //监听收到的消息
        live_socket.onmessage = function (res) {
            // console.log(res.data);
            var data = eval("(" + res.data + ")");
            switch (data['message_type']) {
                // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
                case 'room_init':
                    console.log(data);
                    // 利用jquery发起ajax请求，将client_id发给后端进行uid绑定
                    // $.post('./bind.php', {client_id: data.client_id}, function(data){}, 'json');
                    break;
                // 当mvc框架调用GatewayClient发消息时直接alert出来
                // 服务端ping客户端
                case 'ping':
                    //console.log(data);
                    live_socket.send('{"type":"ping"}');
                    break;
                // 在线
                case 'online':
                    live_userOnline(data.data);
                    // layim.setFriendStatus(data.id, 'online');
                    break;
                // 下线
                case 'offline':
                    live_userOffline(data);
                    // layim.setFriendStatus(data.id, 'offline');
                    break;
                // 检测聊天数据
                case 'chatMessage':
                    // console.log(data.data);
                    live_getMessage(data.data);
                    break;
                // 离线消息推送
                case 'logMessage':
                    // console.log(data.data);
                    live_logMessage(data.data);
                    // setTimeout(function(){layim.getMessage(data.data)}, 1000);
                    break;
                // 用户退出 更新用户列表
                case 'logout':
                    console.log(data.data);
                    // layim.setFriendStatus(data.id, 'offline');
                    break;
                // 添加好友
                case 'addFriend':
                    //console.log(data.data);
                    layim.addList(data.data);
                    break;
                //加入黑名单
                case 'black':
                    //console.log(data.data);
                    layim.removeList({
                        type: 'friend'
                        , id: data.data.id //好友或者群组ID
                    });
                    break;
                //删除好友
                case 'delFriend':
                    //console.log(data.data);
                    layim.removeList({
                        type: 'friend'
                        , id: data.data.id //好友或者群组ID
                    });
                    break;
                // 添加 分组信息
                case 'addGroup':
                    //console.log(data.data);
                    layim.addList(data.data);
                    break;
                // 申请加入群组
                case 'applyGroup':
                    //console.log(data.data);
                    //询问框
                    var index = layer.confirm(
                        data.data.joinname + ' 申请加入 ' + data.data.groupname + "<br/> 附加信息： " + data.data.remark, {
                            btn: ['同意', '拒绝'], //按钮
                            title: '加群申请',
                            closeBtn: 0,
                            icon: 3
                        }, function () {
                            $.post(join_group_url,
                                {
                                    'user_id': data.data.joinid,
                                    'user_name': data.data.joinname,
                                    'user_avatar': data.data.joinavatar,
                                    'user_sign': data.data.joinsign,
                                    'group_id': data.data.groupid
                                },
                                function (res) {
                                    if (1 == res.code) {

                                        var join_data = '{"type":"joinGroup", "join_id":"' + data.data.joinid + '"' +
                                            ', "group_id": "' + data.data.groupid + '", "group_avatar": "' + data.data.groupavatar + '"' +
                                            ', "group_name": "' + data.data.groupname + '"}';
                                        live_socket.send(join_data);
                                    } else {
                                        layer.msg(res.msg, {time: 2000});
                                    }
                                }, 'json');
                            layer.close(index);
                        }, function () {

                        });
                    break;
                // 删除面板的群组
                case 'delGroup':
                    //console.log(data.data);
                    layim.removeList({
                        type: 'group'
                        , id: data.data.id //群组ID
                    });
                    break;
            }
        };
        var prepareUser = function (dir, uid, name, avatar,time) {
            var tpl = '';
            tpl += '<li class="post ' + dir + '">';
            tpl += '<img class="avatar" alt="" src="' + avatar + '"/>';
            tpl += '<div class="message">';
            tpl += '<div class="btn-group" >';
            tpl += '<a class="btn green name btn-xs" href="javascript:;" data-toggle="dropdown" aria-expanded="false" class="name" data-userid="'+uid+'">' + name + '</a>&nbsp;';
            tpl += '<ul class="dropdown-menu" >';
            tpl += '<li >';
            tpl += '    <a href="javascript:;" > <i class="fa fa-ban" ></i > 禁言 </a >';
            tpl += '</li >';
            tpl += '<li >';
            tpl += '    <a href="javascript:;" > <i class="fa fa-gavel" ></i > 加入黑名单 </a >';
            tpl += '</li >';
            tpl += '</ul >';
            tpl += '</div >';
            tpl += '<span class="datetime">加入时间' + time + '</span>';
            tpl += '<span class="body">';
            tpl += '当前在线';
            tpl += '</span>';
            tpl += '</div>';
            tpl += '</li>';

            return tpl;
        };
        var preparePost = function (dir, time, name, avatar, message) {
            var tpl = '';
            tpl += '<li class="post ' + dir + '">';
            tpl += '<img class="avatar" alt="" src="' + avatar + '"/>';
            tpl += '<div class="message">';
            tpl += '<span class="arrow"></span>';
            tpl += '<a href="#" class="name">' + name + '</a>&nbsp;';
            tpl += '<span class="datetime">' + time + '</span>';
            tpl += '<span class="body">';
            tpl += message;
            tpl += '</span>';
            tpl += '</div>';
            tpl += '</li>';

            return tpl;
        };
        var live_userOnline = function (data) {
            console.log('in online');
            console.log(data);
            var data_list = eval(data);
            chatUserContainer.html('');
            for (var i in data_list) {
                var time = new Date();
                var message = prepareUser('in', data_list[i].id, data_list[i].username, data_list[i].avatar, data_list[i].update_time);
                message = $(message);
                chatUserContainer.append(message);
                live_slim();
            }


        }
        var live_userOffline = function (data) {
            console.log('in offline');
            if (data.type == 'group' && data.id == room_id) {

                var time = new Date();
                var message = preparePost('in', (time.getHours() + ':' + time.getMinutes()), data.username, data.avatar, data.content);
                message = $(message);
                chatContainer.append(message);
                live_slim();
            }

        }
        var live_logMessage = function (data) {
            // console.log('in log');
            // console.log(data);
            var flag = document.getElementById("chat_room_log_flag").value;
            if(flag=="1")
            {
                var data_list = eval(data);
                for (var i in data_list) {
                    if (data_list[i].type == 'group' && data_list[i].id == room_id) {
                        // console.log(data_list[i]);
                        // console.log('in log');
                        if (data_list[i].user_id == uid) {
                            var time = new Date();
                            var message = preparePost('out', data_list[i].time, data_list[i].username, data_list[i].avatar, data_list[i].content);
                        } else {
                            var time = new Date();
                            var message = preparePost('in', data_list[i].time, data_list[i].username, data_list[i].avatar, data_list[i].content);
                        }
                        message = $(message);
                        chatContainer.append(message);
                        live_slim();
                    }
                }
            }
            document.getElementById("chat_room_log_flag").setAttribute('value', 0);

        }
        var live_slim = function () {
            return;
            chatContainer.slimScroll({
                scrollTo: '1000000px'
            });
            slimContainer.slimScroll({
                scrollTo: '1000000px'
            });
            console.log('slimed ');
        }
        var live_getMessage = function (data) {

            if (data.type == 'group' && data.id == room_id) {
                console.log('in in');
                var time = new Date();
                var message = preparePost('in', (time.getHours() + ':' + time.getMinutes()), data.username, data.avatar, data.content);
                message = $(message);
                chatContainer.append(message);
                live_slim();
            }

        }

        var initChatSlimScroll = function () {
            var chatUsers = wrapper.find('.live-room');
            var chatUsersHeight;

            chatUsersHeight = wrapper.height();

            // chat user list 
            App.destroySlimScroll(chatUsers);
            chatUsers.attr("data-height", chatUsersHeight);
            App.initSlimScroll(chatUsers);

            var chatMessages = wrapperChat.find('.chats-room');
            var chatMessagesHeight = chatUsersHeight - wrapperChat.find('.chat-form').outerHeight(true);

            // user chat messages 
            App.destroySlimScroll(chatMessages);
            chatMessages.attr("data-height", chatMessagesHeight);
            App.initSlimScroll(chatMessages);
        };

        // initChatSlimScroll();
        // App.addResizeHandler(initChatSlimScroll); // reinitialize on window resize


        var handleChatMessagePost = function (e) {
            e.preventDefault();

            var text = input.val();
            if (text.length === 0) {
                return;
            }

            //聊天室发送消息
            // var mine = JSON.stringify(res.mine);
            var mine = '{"id":"' + uid + '", "username":"' + uname + '", "avatar":"' + avatar + '", "sign":"' + sign + '","mine":true,"content":"' + text + '"}';
            // var to = JSON.stringify(res.to);
            var to = '{"id":"' + room_id + '","type":"group","name":"啊谁都"}';
            var login_data = '{"type":"chatMessage","data":{"mine":' + mine + ', "to":' + to + '}}';
            console.log(login_data);
            live_socket.send(login_data);


            // handle post
            var time = new Date();
            var message = preparePost('out', (time.getHours() + ':' + time.getMinutes()), uname, avatar, text);
            message = $(message);
            chatContainer.append(message);
            live_slim();

            input.val("");

            // simulate reply
            // setTimeout(function(){
            //     var time = new Date();
            //     var message = preparePost('in', (time.getHours() + ':' + time.getMinutes()), "小马", 'avatar2', '消息已收到...');
            //     message = $(message);
            //     chatContainer.append(message);
            //
            //     chatContainer.slimScroll({
            //         scrollTo: '1000000px'
            //     });
            // }, 3000);
        };

        wrapperChat.find('.chat-form .btn').click(handleChatMessagePost);
        wrapperChat.find('.chat-form .form-control').keypress(function (e) {
            if (e.which == 13) {
                handleChatMessagePost(e);
                return false;
            }
        });
    };


    return {

        init: function () {
            //layout handlers
            handleChatRoom(); // handles  chats
        }
    };

}();

jQuery(document).ready(function () {
    LiveRoom.init(); // init metronic core componets
});