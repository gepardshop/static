/**
 * @license e-Calendar v2.0.0
 * (c) 2016- - liaoshiqi
 * License: CHN
 */

(function ($) {

    var dMonth = new Date().getMonth();
    var dYear = new Date().getFullYear();
    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        //var dMonth = adMonth;
        //var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };

        var testFunction=function(){
            alert('function active');
        }

        var onItemGridClose = function () {
            $(".c-event-grid").css("display", "none");
        };

        //日历天事件
        var mouseOverEvent = function () {
            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseClickEvent = function () {
            $(".c-event-grid").css("display", "");

            $('div.c-day').removeClass('c-event-over')
            //var d = $(this).attr('data-event-day');
            $('div.c-event-item').removeClass('c-event-over');

            $(this).addClass('c-event-over');
            var d = $(this).attr('data-event-day');
            $('div.c-event-item[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveEvent = function () {
            //$(this).removeClass('c-event-over')
            //var d = $(this).attr('data-event-day');
            //$('div.c-event-item[data-event-day="' + d + '"]').removeClass('c-event-over');
        };

        //下面详情Item的事件 在页面中重写
        //var mouseClickItem = function () {
        //    var id = $(this).attr("cid");
        //    var type = $(this).attr("ctype");
        //    alert("点击id：" + id + "\r\n 类型：" + type);
        //    $(this).addClass('c-event-over');
        //    var d = $(this).attr('data-event-day');
        //    $('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        //};
        var mouseClickItem = settings.clickItem;
        var mouseOverItem = function () {
            $(this).addClass('c-event-over-item');
            //var d = $(this).attr('data-event-day');
            //$('div.c-event[data-event-day="' + d + '"]').addClass('c-event-over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('c-event-over-item')
            //var d = $(this).attr('data-event-day');
            //$('div.c-event[data-event-day="' + d + '"]').removeClass('c-event-over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            init_eCalendar();

            var ajaxMonth = dYear + "-" + (dMonth - (-1));
            loadeCalendarByAjax(settings, ajaxMonth);
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            init_eCalendar();
            var ajaxMonth = dYear + "-" + (dMonth - (-1));
            loadeCalendarByAjax(settings, ajaxMonth);
        };
         var selectYear=function(){
            //alert($("#selYears").val());
            dYear=$("#selYears").val();

            init_eCalendar();
            var ajaxMonth = dYear + "-" + (dMonth - (-1));
            loadeCalendarByAjax(settings, ajaxMonth);
        }
        var selectMonth=function(){
            //alert($("#selMonths").val());
            dMonth=$("#selMonths").val();

             init_eCalendar();
            var ajaxMonth = dYear + "-" + (dMonth - (-1));
            loadeCalendarByAjax(settings, ajaxMonth);
        }
        function loadEvents() {
            if (typeof settings.initData != 'undefined' && settings.initData) {
                var ajaxMonth = dYear + "-" + (dMonth - (-1));
                loadeCalendarByAjax(settings, ajaxMonth);//调前台的方法请求
            }
        }

        //初始化加载事件
        function loadeCalendarByAjax(settings, ajaxMonth) {
            if (typeof settings.initData != 'undefined') {
                settings.initData(settings, ajaxMonth);
            }
        }

        function init_eCalendar() {
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('c-grid');
            var cEvents = $('<div/>').addClass('c-event-grid');

            cEvents.css("display", "none"); //默认隐藏

            var cEventsBody = $('<div/>').addClass('c-event-body');
            cEvents.append($('<div/>').addClass('c_title_sj').html(settings.eventTitle));  //标题
            //关闭按钮
            var itemClose = $('<div/>').on('click', onItemGridClose).attr("href", "javascipt:void(0)");
            var itemClose_a = $('<a/>').on('click', onItemGridClose).attr("href", "javascipt:void(0)")
                            .html('<img src="/ui/apps/party/e-calendar-v2/img/calendar_delete_icon.png">');
            itemClose.addClass('c-close-top').html(itemClose_a);

            //itemClose.attr('onclick', "onItemGridClose()");
            cEvents.append(itemClose);

            cEvents.append(cEventsBody);    //主体

            // var cNext = $('<div/>').addClass('c-next c-grid-title c-pad-top');
            // var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            // var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');

            var cTitle = $('<div/>').addClass('top_calendar_div');
            //cPrevious.html(settings.textArrows.previous);

            var cYear=$('<div/>').addClass('c_years');
            var cMonth = $('<div/>').addClass('c_months');
             var cPage= $('<div/>').addClass('c_pages');

            //var cMonth = $('<div/>').addClass('c-month c-grid-title c-pad-top');
            //var cPrevious = $('<div/>').addClass('c-previous c-grid-title c-pad-top');
            
            //年份选择事件,初始化
            var year_sel=document.createElement("select");    
            year_sel.setAttribute("id","selYears");
            //year_sel.options.add(new Option("2016","2016"));
            var yearRanges=settings.yearRange||new Array().push(dYear); //年份的区间,无值时默认当前年份
            for(var i=0;i<yearRanges.length;i++){
                year_sel.options.add(new Option(yearRanges[i],yearRanges[i]));
            }
           
            year_sel.onchange=function(){
                selectYear();
            }
            for(var i=0; i<year_sel.options.length; i++){  
                if(year_sel.options[i].innerHTML == dYear){  
                    year_sel.options[i].selected = true;  
                    break;  
                }  
            } 
            //end

            //月份选择事件,初始化
            var month_sel=document.createElement("select");    
            month_sel.setAttribute("id","selMonths");

             var monthRanges=settings.months||[]; //月份
            for(var i=0;i<monthRanges.length;i++){
                month_sel.options.add(new Option(monthRanges[i],i));
            }
            month_sel.onchange=function(){
                selectMonth();
            }
             for(var i=0; i<month_sel.options.length; i++){  
                if(month_sel.options[i].innerHTML ==monthRanges[dMonth]){  
                    month_sel.options[i].selected = true;  
                    break;  
                }  
            } 
            //end

             var cPrevious=$('<a/>').on('click', previousMonth).attr("href","javascipt:void(0)")
                            .html('<img src="/ui/apps/party/e-calendar-v2/img/page_left.png">');
             var cNext=$('<a/>').on('click', nextMonth).attr("href","javascipt:void(0)")
                            .html('<img src="/ui/apps/party/e-calendar-v2/img/page_right.png">');
              
            //cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cYear.html(year_sel);
            cMonth.html(month_sel);
            cPage.append(cPrevious);
            cPage.append(cNext);

            //cNext.html(settings.textArrows.next);
            //cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            //cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cTitle.append(cYear);
            cTitle.append(cMonth);
            cTitle.append(cPage);
            cBody.append(cTitle);
            
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('c-week-day c-pad-top');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('c-day-previous-month c-pad-top');
                    cDay.html(dLastDayOfPreviousMonth++);
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('c-day c-pad-top');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('c-today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && d.getMonth() == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('c-event').attr('data-event-day', d.getDate());
                            //cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                            cDay.on('click', mouseClickEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('c-day-next-month c-pad-top');
                    cDay.html(dayOfNextMonth++);
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('c-event-list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if (d.getMonth() == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth() + 1, 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);

                    //cid赋给div,查看日程是传递;ctype:任务或日程
                    var item = $('<div/>').addClass('c-event-item').attr("cid", settings.events[i].id).attr("ctype", settings.events[i].type);
                    item.attr("title", settings.events[i].description); //鼠标移动显示提示文字
                    //var title = $('<div/>').addClass('title').html(date + '  ' + settings.events[i].title + '<br/>');
                    var title = $('<div/>').addClass('title').html(settings.events[i].title + '<br/>');
                    var description = $('<div/>').addClass('description').html(settings.events[i].description + '<br/>');
                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    item.append(title).append(description);

                    //c-event-item的点击事件
                    item.on('click', mouseClickItem);

                    eventList.append(item);
                }
            }
            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);
        }

        return init_eCalendar();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        textArrows: { previous: '<', next: '>' },
        eventTitle: 'Eventos',
        url: '',
        events: [

        ]
    };

}(jQuery));
