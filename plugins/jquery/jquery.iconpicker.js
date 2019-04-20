(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.iconpicker = function (options) {

        var self = this;
        this.buttonSize = 'sm';
        this.columns = 10;
        // this.height = auto;
        this.width = 800;
        this.extend(options);
        this.open = false;
        this.allowedSizes = [];

        //Templates
        this.templates = {
            filter: "<div class=\"m-form m-form--fit m-form--label-align-right\">\n" +
            "    <div class=\"form-group m-form__group input-group-sm\">\n" +
            "        <div class=\"input-group-prepend\"><span class=\"input-group-text\" >搜索</span>"+
            "            <input class=\"form-control form-control-sm m-input icon-filter\" type=\"search\" placeholder='' =\"输入字母搜索\" id=\"example-search-input\">\n" +
            "    </div></div>\n" +
            "</div>",
            sizes: "",
        };

        //Icon List
        this.icons = options.icons;

        //Bind open menu function to element click
        $(this).on("click", function (e) {
            self.$el = $(e.currentTarget);
            if ($(e.currentTarget).find(".icon-menu").length) {
                self.closeMenu();
            } else {
                self.openMenu();
            }
        });

        //Bind event to icon click
        $(this).on("click", ".icon", function (e) {
            e.stopPropagation();
            var icon = $(e.currentTarget).data("icon");
            if (self.clickCallback !== undefined) {
                self.clickCallback(icon);
            } else {
                self.$el.find("> .form-control").val(icon).focus().select();
            }
            self.closeMenu();
        });

        //Stop menu from closing if click in menu
        $(this).on("click", ".icon-menu", function (e) {
            e.stopPropagation();
        });

        //Bind event to filter input
        $(this).on("keyup", ".icon-filter", function (e) {
            var str = $(e.target).val();
            self.doFilter(str);
        });

        //Bind event to size menu
        $(this).on("click", ".btn-group .btn", function (e) {
            var size = ($(e.currentTarget).data('size') == 'sm') ? '' : 'fa-' + $(e.currentTarget).data('size');
            self.$sizeSelector.find('.btn').removeClass("active");
            $(e.currentTarget).addClass("active");
            self.$container.find('i').removeClass('fa-lg fa-2x fa-3x fa-4x fa-5x').addClass(size);
            self.resize();
        });

        //Create html element
        this.createMenu = function () {
            this.icons = eval(this.icons);
            this.$menu = $("<div>", {class: "icon-menu", style: "height:" + this.height + "px;"+"width:" + this.width + "px;"});
            if (this.filter !== false) {
                this.$filter = $(this.templates.filter);
                this.$menu.append(this.$filter);
            }
            if (this.sizeSelector !== false) {
                this.$sizeSelector = $(this.templates.sizes);
                this.$sizeSelector.find('a[data-size=' + this.buttonSize + ']').addClass('active');
                this.$menu.append(this.$sizeSelector);
            }
            this.$container = $("<div>", {class: "icon-container row", style: "width:800px"});
            for (var i in this.icons) {
                var size = ($.inArray(this.buttonSize, this.allowedSizes) > -1) ? " fa-" + this.buttonSize : "";

                var button = $("<div>", {
                    class: "icon col-md-2",
                    "data-icon": this.icons[i].selector,
                    "data-filter": this.icons[i].filter
                });
                button.html("<div class='m-demo-icon'> <div class='m-demo-icon__preview'><i class='" + this.icons[i].selector + size + "' title='"+this.icons[i].name+"'></i></div> <div class='m-demo-icon__class'>"+this.icons[i].name+" </div> </div>");
                this.$container.append(button);
            }
            this.$menu.append(this.$container);
        }

        //Open Menu
        this.openMenu = function (e) {
            this.open = true;
            $(this.$el).append(this.$menu);
            this.resize();
            this.$menu.find('.icon-filter').focus();
        }

        //Close Menu
        this.closeMenu = function () {
            this.open = false;
            this.$menu.detach();
        }

        //Resize menu
        this.resize = function (columns) {
            this.scrollbarWidth = this.scrollbarWidth || this.getScrollbarWidth();
            var width = Math.ceil($('.icon').outerWidth(true) * this.columns + this.scrollbarWidth) + "px";
            var height = this.height - (parseInt(this.$menu.css('padding-top')) * 2);
            height -= (this.filter !== false) ? this.$filter.outerHeight(true) : 0;
            height -= (this.sizeSelector !== false) ? this.$sizeSelector.outerHeight(true) : 0;
            this.$container.css({width: 800, height: "auto"});

        }

        //Filter function
        this.doFilter = function (str) {
            if (str !== "") {
                $(this).find("div.icon[data-filter*='" + str + "']").show();
                $(this).find("div.icon:not([data-filter*='" + str + "'])").hide();
            } else {
                $(this).find("div.icon").show();
            }
        }

        //Uppercase words function
        this.ucwords = function (str) {
            return (str.replace(/-/g, ' ') + '')
                .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
                    return $1.toUpperCase();
                });
        }

        //Object sorting function
        this.sortObj = function (obj) {
            var key,
                tempArry = [],
                i,
                tempObj = {};
            for (key in obj) {
                tempArry.push(key);
            }
            tempArry.sort(
                function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                }
            );
            for (i = 0; i < tempArry.length; i++) {
                tempObj[tempArry[i]] = obj[tempArry[i]];
            }
            return tempObj;
        }

        //Scrollbar width
        this.getScrollbarWidth = function () {
            var $inner = $('<div style="width: 100%; height:200px;">test</div>'),
                $outer = $('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
                inner = $inner[0],
                outer = $outer[0];
            $('body').append(outer);
            var width1 = inner.offsetWidth;
            $outer.css('overflow', 'scroll');
            var width2 = outer.clientWidth;
            $outer.remove();
            return (width1 - width2);
        }

        self.createMenu();

        return this;
    };
}));