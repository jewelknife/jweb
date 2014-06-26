/**
 * Created by chen_yingbo on 6/25/14.
 */
var Menus = function() {

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-center",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    if(typeof String.prototype.getBytesLength == 'undefined') {
        String.prototype.getBytesLength = function() {
            var len = 0;
            if (this) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].match(/[^\x00-\xff]/ig) != null) //全角
                        len += 2;
                    else
                        len += 1;
                }
            }
            return len;
        }
    }

    function check_data(result) {
        var bak = JSON.parse(result);
        if (bak.length > 3) {
            toastr.warning('一级菜单最多三个!请检查后重新提交');
            return;
        }
        for (var i = 0; i < bak.length; i++) {
            if (bak[i].name.getBytesLength() > 16) {
                toastr.warning('一级菜单名字最多5个字符!请检查后重新提交');
                return;
            }

            if (bak[i].sub_button) {
                if (bak[i].sub_button.length > 5) {
                    toastr.warning('二级菜单最多5个!请检查后重新提交');
                    return;
                }

                for (var j = 0; j < bak[i].sub_button.length; j++) {
                    if (bak[i].sub_button[j].name.getBytesLength() > 41) {
                        toastr.warning('二级菜单名字最多40个字节!请检查后重新提交');
                        return;
                    }
                }
            }
        }
        return true;
    }

    function get_data() {
        var result = [];

        $('.topm').each(function (Index, Element) {
            var name = $(Element).find('input:first').val();
            var pcontainer = $(Element).find('.select-reply-button');
            var topm = new Array();
            topm['name'] = name;
            var key = pcontainer.attr('data-key');
            if ('undefined' != typeof key || key != "") {
                topm['key'] = key;
            }
            //    topm['sub_button'] = [];
            var n = $(Element).next();
            if (n.hasClass('subm')) {
                topm['sub_button'] = new Array();
                if (Index != $('.topm').length - 1) {
                    var S = $(Element).nextUntil('.topm');
                } else {
                    var S = $(Element).nextUntil('.btns');
                }
                S.each(function (I, E) {
                    var subm = new Array();
                    var name = $(E).find('input:first').val();
                    subm.push('"name":"' + name + '"');

                    var container = $(E).find('.select-reply-button');
                    if (container.attr('data-model')) {
                        subm.push('"model":"' + container.attr('data-model') + '"');
                        subm.push('"message":"' + container.attr('data-message') + '"');
                        var key = container.attr('data-key');
                        if ('undefined' != typeof key || key != "") {
                            subm.push('"key":"' + key + '"');
                        }
                    }
                    subm = subm.join(',');
                    subm = '{' + subm + '}';
                    //     topm['sub_button'].push(subm);
                    var subm = {
                        "name": $(E).find('input:first').val(),
                        "key": container.attr('data-key')
                    };

                    if (container.attr('data-model')) {
                        subm.model = container.attr('data-model');
                        subm.message = container.attr('data-message');
                    }

                    topm['sub_button'][topm['sub_button'].length] = subm;
                });
                // topm['sub_button'] = topm['sub_button'].join(',');
                // topm['sub_button'] = '[' + topm['sub_button'] + ']';
            }
            var top = {
                "name": topm['name'],
                "model": pcontainer.attr('data-model'),
                "message": pcontainer.attr('data-message'),
                "key": pcontainer.attr('data-key'),
                "sub_button": topm['sub_button']
            };
            var topmStr = '{' + '"name":"' + topm['name'] + '","model":"' + pcontainer.attr('data-model') + '","message":"' + pcontainer.attr('data-message') + '","key":"' + topm['key'] + '","sub_button":' + topm['sub_button'] + '}';
            result.push(top);

        });
        return JSON.stringify(result);
    }

    function bindButton() {
        $('.topm').each(function (Index, Element) {
            $(Element).find('.btn').unbind('click');

            $(Element).find('.up').bind('click', function () {


                if (Index != 0) {

                    var i = Index - 1;

                    var n = $(Element).next();

                    if (n.hasClass('subm')) {

                        if (Index != $('.topm').length - 1) {
                            var S = $(Element).nextUntil('.topm');
                        } else {
                            var S = $(Element).nextUntil('.btns');
                        }
                    }
                    $(Element).insertBefore($('.topm:eq(' + i + ')'));

                    if (n.hasClass('subm')) {
                        S.insertAfter($(Element));
                    }

                    bindButton();
                }
            });

            $(Element).find('.down').bind('click', function () {
                if (Index != $('.topm').length - 1) {
                    var i = Index + 1;

                    var n = $(Element).next();

                    if (n.hasClass('subm')) {

                        if (Index != $('.topm').length - 1) {
                            var S = $(Element).nextUntil('.topm');
                        } else {
                            var S = $(Element).nextUntil('.btns');
                        }
                    }
                    $(Element).insertAfter($('.topm:eq(' + i + ')'));

                    if (n.hasClass('subm')) {
                        S.insertAfter($(Element));
                    }

                    bindButton();
                }
            });

            $(Element).find('.delBtn').bind('click', function () {

                var c = confirm('是否确认删除按钮');

                if (c == true) {
                    $(Element).fadeOut(function () {
                        var n = $(Element).next();

                        if (n.hasClass('subm')) {
                            if (Index != $('.topm').length - 1) {
                                var S = $(Element).nextUntil('.topm');
                            } else {
                                var S = $(Element).nextUntil('.btns');
                            }
                            S.remove();
                        }
                        $(Element).remove();
                        bindButton();
                    });
                }
            });

            $(Element).find('.addSubBtn').bind('click', function () {

                if (!check_data(get_data())) {
                    return;
                }
                var l = $(Element).clone();
                l.find('input').val('');
                l.addClass('subm').removeClass('topm');
                l.find('.col-md-5').removeClass('col-md-5').addClass('col-md-offset-1').addClass('col-md-4');
//                $('<div class="span2 m-wrap"></div>').insertBefore(l.find('input:first'));
                l.find('.addSubBtn').remove();
                l.find('input').val('');
                l.insertAfter($(Element));

                bindButton();
            });
        });

        $('.subm').each(function (Index, Element) {
            $(Element).find('.btn').unbind('click');

            $(Element).find('.up').bind('click', function () {

                var P = $(Element).prev();

                if (P.hasClass('subm')) {
                    var i = Index - 1;

                    $(Element).insertBefore($('.subm:eq(' + i + ')'));

                    bindButton();
                }
            });

            $(Element).find('.down').bind('click', function () {

                var N = $(Element).next();

                if (N.hasClass('subm')) {
                    var i = Index + 1;
                    $(Element).insertAfter($('.subm:eq(' + i + ')'));
                    bindButton();
                }
            });

            $(Element).find('.delBtn').bind('click', function () {

                var c = confirm('是否确认删除按钮');

                if (c == true) {
                    $(Element).fadeOut(function () {
                        $(Element).remove();
                        bindButton();
                    });
                }
            });
        });
    }

    var bindAddTopMenu = function () {

        if ($('#addTopMenu')) {
            $('#addTopMenu').bind('click', function () {

                if (!check_data(get_data())) {
                    return false;
                }

                var l = $('.topm:first').clone();
                l.find('input').val('');
                l.insertBefore('.form-actions');
                bindButton();
            });
        }
    };

    return {

        initEditMenus: function() {
            bindAddTopMenu();
            bindButton();
        }

    };

}();
