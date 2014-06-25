var crypto = require('crypto')
    , User = require('../lib/user.js')
    , fs = require('fs');
/*
 * GET home page.
 */

module.exports = function(app, webot){

    app.get('/', checkLogin);
    app.get('/', function(req, res) {
        res.render('index', {
            title: 'wxweb',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/rules', checkLogin);
    app.get('/rules', function(req, res) {
        res.render('rules', {
            title: '规则列表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/new_rule', checkLogin);
    app.get('/new_rule', function(req, res) {
        res.render('new_rule', {
            title: '创建规则',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/edit_menus', checkLogin);
    app.get('/edit_menus', function(req, res) {
        res.render('edit_menus', {
            title: '自定义菜单管理',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/menus_status', checkLogin);
    app.get('/menus_status', function(req, res) {
        res.render('menus_status', {
            title: '自定义菜单统计',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登陆',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.get(req.body.username, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');//登陆成功后跳转到主页
        });
    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res) {
        var username = req.body.username,
//            accountName = req.body.accountName,
            password = req.body.password,
            password_re = req.body['rpassword'];
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');//返回注册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            username: username,
            password: password,
            email: req.body.email
        });
//        var newAccount = new Account({
//            name : accountName,
//            users: [newUser]
//        });
        //检查用户名是否已经存在
        User.get(newUser.username, function(err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');//返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/login');//登出成功后跳转到主页
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登陆,谢谢!');
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('back');//返回之前的页面
        }
        next();
    }

};