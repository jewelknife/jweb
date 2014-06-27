/**
 * Created by jewelknife on 2014/6/27.
 */
var PageMenu = function() {

    function selectMenu() {
        var pagehref = location.pathname.split('/');

        var menuContainer = jQuery('.page-sidebar ul');
//        var pageContent = $('.page-content');
//        var pageContentBody = $('.page-content .page-content-body');

        menuContainer.children('li.active').removeClass('active');
        menuContainer.children('arrow.open').removeClass('open');

        for (var i = 0;i<pagehref.length;i++) {
            var selected = $("a[href*='"+ pagehref[i] +"']");
            if (selected) {

                $(selected).parents('li').each(function () {
                    $(this).addClass('active');
                    $(this).children('a > span.arrow').addClass('open');
                });
                $(selected).parents('li').addClass('active');

            }
        }
    }

    return {
        init: function() {
            selectMenu();
        }
    };

}();