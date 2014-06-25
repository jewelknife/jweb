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
        //  result = result.join(',');
        //  result = '[' + result + ']';

        return JSON.stringify(result);
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
//            bindButton();

            });
        }
    };

    return {

        initEditMenus: function() {
            bindAddTopMenu();
        }

    };

}();
