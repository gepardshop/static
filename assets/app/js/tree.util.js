/**
 * Created by ceo on 2017/4/15.
 */
var treeUtil = function () {

    var handleAuthRule = function (tree_list) {
        console.log('get it'+tree_list);
        //生成树
        $('#authrule_tree').jstree({
            'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes" : {
                    "responsive": false
                },
                'data':tree_list
            },
            "types" : {
                "default" : {
                    "icon" : false
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            }
        });

        //监听树
        $('#authrule_tree').on('changed.jstree', function(e, data) {
            r = [];
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    r.push(node.id);
                }
            }
            console.log(r);
        })

        $('.save_tree').on('click', function(e, data) {
            var apiUrl = $('#postUrl').val();
            console.log(apiUrl);
            var id = $('#id').val();
            $.ajax({
                data : {'id' : id,
                    'nodes' : r},
                type : "POST",
                //dataType : 'json',
                url : apiUrl,
                error : function(data) {
                    swal(data.msg, '', "error");

                },
                success : function(data) {
                    swal(data.msg, '', "success");
                    console.log('tree 1');
                    setTimeout(function() {
                        if (data.url) {
                            str = data.url;
                            location.href = data.url;
                        } else {
                            location.reload();
                        }
                    }, 2000);
                }
            });
        })

        //保存树
        function saveTree() {
            console.log('get Submit');
            $.ajax({
                data : {'currentGroupId' : currentGroupId,
                    'selectedNodes' : r.join('@@')},
                type : "POST",
                //dataType : 'json',
                url : "/test/savetree",
                error : function(data) {
                    swal(data.msg, '', "error");

                },
                success : function(data) {
                    swal(data.msg, '', "success");
                    console.log('tree 2');
                    setTimeout(function() {
                        if (data.url) {
                            str = data.url;
                            location.href = data.url;
                        } else {
                            location.reload();
                        }
                    }, 2000);
                }
            });
        }
    }


    return {
        //main function to initiate the module
        init: function (tree_list) {

            handleAuthRule(tree_list);

        },
        saveTree:function () {
            
        }

    };

}();
