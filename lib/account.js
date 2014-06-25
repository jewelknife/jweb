var mongodb = require('./db')
    , Common = require('../models/common.js');


function Account(account) {
    this.name = account.name;
    this.use_wx = true;
    this.users = account.users;
};

module.exports = Account;

function getTime() {
    return Common.getTime();
}

//存储用户信息
Account.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var account = {
        name: this.name,
        use_wx: this.use_wx,
        time:getTime(),
        users: this.users
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('accounts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(account, {
                safe: true
            }, function (err, account) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, account[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读account信息
Account.get = function (username, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('accounts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                $where : {"users.name": username}
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, account);//成功！返回查询的用户信息
            });
        });
    });
};