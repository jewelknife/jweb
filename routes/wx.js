/**
 * Created by chen_yingbo on 6/18/14.
 */

module.exports = function (webot) {

// 指定回复消息
    webot.set('hi', '你好');

    webot.set('subscribe', {
        pattern: function (info) {
            return info.is('event') && info.param.event === 'subscribe';
        },
        handler: function (info) {
            return '欢迎订阅微信机器人';
        }
    });

    webot.set('test', {
        pattern: /^test/i,
        handler: function (info, next) {
            next(null, 'roger that!')
        }
    })


};