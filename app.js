
/**
 * Module dependencies.
 */
var webot = require('weixin-robot');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var wx = require('./routes/wx');

var app = express();

console.log('server is start now...');

// all environments
app.set('port', process.env.PORT || 2100);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(function (req, res, next) {
//  getRawBody(req, {
//    length: req.headers['content-length'],
//    limit: '600mb',
//    encoding: 'utf8'
//  }, function (err, string) {
//    if (err)
//      return next(err)
//
//    req.text = string
//    next()
//  })
//})
//app.use(express.urlencoded({limit: '300mb'}));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/temp', limit: '5mb'}));
app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

wx(webot);

webot.watch(app, { token: 'jewelknife', path: '/wxapi' });

routes(app, webot);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

