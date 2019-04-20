var UINestable = function () {

    var nestUpdateOutput = function (e) {
        var list = e.length ? e : $(e.target), output = list.data('output');
        console.log(list.nestable('serialize'));
        console.log(window.JSON.stringify(list.nestable('serialize')));
        //这个数据传送给后端api保存
        var apiUrl = $('.data-api').attr('action');
        console.log(apiUrl);

        $.ajax({
            type: 'post',
            cache: false,
            data: {jsondata: list.nestable('serialize')},
            url: apiUrl,
            dataType: "json",
            success: function (data) {
                if (data.code==200) {
                    swal(data.msg, '', "success");
                } else {
                    swal(data.msg, '', "error");

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal('请求出错', '', "error");
            }
        });

        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize'))); //, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    var doNest = function () {
        // activate Nestable for list 2
        $('#nestable_list_1').nestable({
            group: 1
        }).on('change', nestUpdateOutput);

        // output initial serialised data
        nestUpdateOutput($('#nestable_list_1').data('output', $('#nestable_list_1_output')));

        $('#nestable_list_menu').on('click', function (e) {
            var target = $(e.target),
                action = target.data('action');
            console.log(action);
            console.log(target);
            if (action === 'expand-all') {
                $('.dd').nestable('expandAll');
            }
            if (action === 'collapse-all') {
                $('.dd').nestable('collapseAll');
            }
        });


    };

    return {
        //main function to initiate the module
        init: function() {
            doNest();
        },

    };

}();

jQuery(document).ready(function () {
    UINestable.init();
});