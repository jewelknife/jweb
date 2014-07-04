var crypto = require('crypto')
    , User = require('../lib/user.js')
    , fs = require('fs');
/*
 * GET home page.
 */

var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl:  '/uploaded/files/',
    maxPostSize: 5000000,
    minFileSize:  1,
    maxFileSize:  5000000,
    acceptFileTypes: /\.(gif|jpe?g|png)/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    imageVersions: {
        width:  720,
        height: 400
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    }
//    storage : {
//        type : 'aws',
//        aws : {
//            accessKeyId :  'xxxxxxxxxxxxxxxxx',
//            secretAccessKey : 'xxxxxxxxxxxxxxxxx',
//            region : 'us-east-1',//make sure you know the region, else leave this option out
//            bucketName : 'xxxxxxxxxxxxxxxxx'
//        }
//    }
};

// init the uploader
var uploader = require('blueimp-file-upload-expressjs')(options);

module.exports = function(app, webot){

    app.get('/', function(req, res) {
        res.redirect('/index');
    });

    app.get('/index', checkLogin);
    app.get('/index', function(req, res) {
        res.render('index', {
            title: 'wxweb',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/rules', checkLogin);
    app.get('/rules', function(req, res) {
        var rules = [
            {
                "pattern": /^hi\s*(\d*)$/,
                "keyword": "hi",
                "content":"hi, welcome to use this",
                "msg_type": 0,
                "status": 0,
                "k_type":1,
                "time": '2014-05-02'
            },
            {
                "pattern": /^game\s*(\d*)$/,
                "keyword": "game",
                "content": {},
                "msg_type": 1,
                "status": 0,
                "k_type":0,
                "time": '2014-6-02'
            },
            {
                "pattern": /^chose\s*(\d*)$/,
                "keyword": "chose",
                "content":"so happy today",
                "msg_type": 0,
                "status": 0,
                "k_type":1,
                "time": '2014-03-12'
            }

        ];

        res.render('rules', {
            title: '规则列表',
            rules: rules,
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

    app.post('/new_rule', checkLogin);
    app.post('/new_rule', function(req, res) {
        res.redirect('/rules');
    });

    app.get('/new_picmsg', checkLogin);
    app.get('/new_picmsg', function(req, res) {
        res.render('picture_msg_pm/new_picmsg', {
            title: '创建图文消息',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/new_picmsg', checkLogin);
    app.post('/new_picmsg', function(req, res) {
        res.redirect('/picmsg_list');
    });

    app.get('/upload', function(req, res) {
        uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    app.post('/upload', function(req, res) {
        uploader.post(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    // the path SHOULD match options.uploadUrl
    app.delete('/uploaded/files/:name', function(req, res) {
        uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    app.get('/picmsg_list', checkLogin);
    app.get('/picmsg_list', function(req, res) {
        var picmsgs = [
            {
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/2.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/3.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/4.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/5.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/6.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/7.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            },{
                "title": 'Top footer ball game coming',
                "description": "this is description",
                "picurl":"/assets/img/blog/1.jpg",
                "time": '2014-05-02'
            }
        ];

        res.render('picture_msg_pm/picmsg_list', {
            title: '图文消息列表',
            picmsgs: picmsgs,
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