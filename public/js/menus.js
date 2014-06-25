define(function (require, exports, moudle) {
    var Common = require('/static/common/common.js');
    var Button = require('/static/common/livebutton.js');
    var Var = require('/static/common/pagevar.js');
    var reply = require('/plugins/reply_panel/static/scripts/replypanel.js');
    var Tip = require('/static/common/tip.js');
    var simulator = '';
    var Preview = require('/plugins/preview_panel/static/scripts/preview.js');
    var cursorButton = '';

    function model2type(model) {
        model = model.toLowerCase();
        var d = {'material': 'single', 'materials': 'more'};
        if ('undefined' != typeof d[model]) {
            return d[model];
        }
        return model;
    }

    exports.create = function () {
        simulator = new Preview.PreviewSimulator('#preview-container');
        simulator.addMessage('System', 'Text', '点击下方菜单按钮，实时查看内容');
        simulator.render();
        simulator.dom.parent().height(480);
        $('.select-reply-button').die();
        $('.select-reply-button').live('click', function () {

            var p = $(this).parent();
            if (p.hasClass('topm')) {
                var s = p.next();
                if (s.hasClass('subm')) {
                    new Tip('包含二级菜单的按钮不能选择回复方式', 'info').show();
                    return;
                }
            }

            $('.reply-panel').fadeIn(500);
            $.scrollTo(0, 500);
            cursorButton = $(this);
            var model = $(this).attr('data-model');
            var message = $(this).attr('data-message');
            reply.registerCallback('text', function () {
                $(this).find('textarea').val(message);
            });
            reply.registerCallback('url', function () {
                $(this).find('textarea').val(message);
            });
            switch (model) {
                case 'single':
                {
                    reply.loadPanel('material');
                }
                    break;
                case 'more':
                {
                    reply.loadPanel('materials');
                }
                    break;
                case 'url':
                {
                    reply.loadPanel('url');
                }
                    break;
                case 'text':
                {
                    reply.loadPanel('text');
                }
                    break;
                case 'addon':
                {
                    reply.loadPanel('addon');
                }
                    break;
                default :
                {
                    reply.loadPanel('text');
                }
            }
        });
        reply.init('#reply-con', function (model, message) {
            cursorButton.attr('data-model', model2type(model));
            if (model == 'addon') {
                cursorButton.attr('data-key', message);
            } else {
                cursorButton.attr('data-message', message);
            }
            switch (model.toLowerCase()) {
                case 'text':
                {
                    cursorButton.text('已选文本')
                }
                    break;
                case 'material':
                {
                    cursorButton.text('已选图文')
                }
                    break;
                case 'addon':
                {
                    cursorButton.text('已选插件')
                }
                    break;
                case 'materials':
                {
                    cursorButton.text('已选组合')
                }
                    break;
                case 'url':
                {
                    cursorButton.text('已选链接')
                }
                    break;
            }
            reply.hide();
        });

        reply.load(function () {
            reply.hide();
        });
        exports.init();
    };

    exports.init = function () {
        function check_data(result) {
            var bak = JSON.parse(result);
            if (bak.length > 3) {
                new Tip('一级菜单最多三个!请检查后重新提交', 'info').show();
                return;
            }
            for (var i = 0; i < bak.length; i++) {
                if (bak[i].name.getBytesLength() > 16) {
                    new Tip('一级菜单名字最多5个字符!请检查后重新提交', 'info').show();
                    return;
                }

                if (bak[i].sub_button) {
                    if (bak[i].sub_button.length > 5) {
                        new Tip('二级菜单最多5个!请检查后重新提交', 'info').show();
                        return;
                    }

                    for (var j = 0; j < bak[i].sub_button.length; j++) {
                        if (bak[i].sub_button[j].name.getBytesLength() > 41) {
                            new Tip('二级菜单名字最多40个字节!请检查后重新提交', 'info').show();
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

        function initMenuDelete() {
            $('#delete_modal').find('.btn-primary').bind('click', function () {
                var id = $('#id_for_delete').val();
                id = parseInt(id);
                var btn = new Button($(this));
                btn.start();

                $.post(
                    '/addon_menu/ajax_delete',
                    {'id': id},
                    function (data) {
                        btn.end();


                        $('#delete_modal').on('hidden', function () {
                            var err_code = parseInt(data.errcode);
                            if (err_code == 0) {
                                new Tip('停用成功！', 'success');
                            } else {
                                alert(data.err_msg);
                            }
                        });
                    }, 'json'
                );
            });
        }

        initMenuDelete();
        function initAccountMenu() {
            $('#plus').bind('click', function () {

                if (!check_data(get_data())) {
                    return false;
                }
                var l = $('.topm:first').clone();
                l.find('input').val('');
                l.insertBefore('.btns');
                bindButton();
            });
            bindButton();
            $('#preview-button').live('click', function () {

                var result = get_data();
                result = JSON.parse(result);
                var html = '';
                for (var k in result) {
                    html += '<li class="button' + result.length + '">'
                    var sub = result[k]['sub_button'];

                    if (sub && sub.length > 0) {
                        html += '<ul class="sub-button">';
                        for (var k2 in sub) {
                            html += '<li data-model="' + sub[k2]['model'] + '" data-message="' + sub[k2]['message'] + '">' + sub[k2]['name'] + '</li>';
                        }
                        html += '</ul>';
                    }

                    html += '<div data-model="' + result[k]['model'] + '" data-message="' + result[k]['message'] + '">' + result[k]['name'] + '</div></li>'
                }

                $('#preview-button-group').empty().append(html);
            });

            $('.submit-menu-button').bind('click', function () {
                var result = get_data();
                if (!check_data(result)) {
                    return false;
                }
                //require('/static/page/common/common').loadMask();
                var btn = new Button($(this));
                btn.start();
                $.post(
                    '/addon_menu/save_menu',
                    {'data': result, 'id': $('#id').val()},
                    function (data) {
                        btn.end();

                        if ('object' != typeof data) {
                            data = $.parseJSON(data);
                        }
                        var err_code = parseInt(data.err_code);
                        if (err_code == 0) {
                            $('#submit-menu-nav-modal').modal('hide');
                            new Tip('操作成功', 'success').show();
                            window.location.reload();
                        } else {
                            new Tip('操作失败，请重试', 'error').show();
                        }
                    }, 'json'
                );
            });
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

                $(Element).find('.delete').bind('click', function () {

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

                $(Element).find('.addsubmenu').bind('click', function () {

                    if (!check_data(get_data())) {
                        return;
                    }
                    var l = $(Element).clone();
                    l.find('input').val('');
                    l.addClass('subm').removeClass('topm');
                    $('<div class="span2 m-wrap"></div>').insertBefore(l.find('input:first'));
                    l.find('.addsubmenu').remove();
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

                $(Element).find('.delete').bind('click', function () {

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

        initAccountMenu();
        $('ul.button-group>li').live('click', function () {
            var click = $(this).attr('data-click');
            if ('undefined' == typeof click) {
                click = 0;
            }
            $(this).attr('data-click', click - 0 + 1);
            if (parseInt(click) % 2 == 0) {
                $(this).find('.sub-button').slideDown(200);
            } else {
                $(this).find('.sub-button').slideUp(200);
            }
        })
        $('ul.button-group>li').live('mouseout', function () {
            //  $(this).find('.sub-button').hide(200);
        });


        $('.button-group>li>div').live('click', function () {


        });


        function preview(model, message) {
            switch (model) {

                case 'text':
                {
                    simulator.replaceWithIndex(0, 'System', 'Text', message);

                }
                    break;
                case 'single':
                {
                    simulator.replaceMaterialWithId(message, 0);

                }
                    break;
                case 'more':
                {
                    simulator.replaceMaterialsWithId(message, 0);
                }
                    break;
                case 'addon':
                {
                    simulator.replaceWithIndex(0, 'System', 'Text', "这是插件触发");
                }
                    break;
                case 'url':
                {
                    simulator.replaceWithIndex(0, 'System', 'Text', '<a href="' + message + '" target="_blank">' + message + '</a>');

                }
            }


        }


        $('ul.sub-button>li').live('click', function () {
            var model = $(this).attr('data-model');
            var message = $(this).attr('data-message');
            if (!model || !message) {
                return;
            }
            preview(model, message);


        });
    };

});