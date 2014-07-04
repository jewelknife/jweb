var mongodb = require('./db')
  , ObjectID = require('mongodb').ObjectID
  , Common = require('../lib/common.js');

function ReplyRule(rule) {
	this.watch_word = rule.watch_word;
    this.word_type = rule.word_type;
	this.status = rule.status;
    this.reply = {};
    if (rule.text) {
        this.reply.text = rule.text;
    }
    if (rule.type) {
        this.reply.type = rule.type;
    }
};

module.exports = ReplyRule;

function getTime() {
	return Common.getTime();
}

ReplyRule.prototype.save = function(callback) {
	
	var rule = {
        watch_word: this.watch_word,
		time: getTime(),
		updated_time: getTime(),
        word_type: this.word_type,
        status: this.status,
        reply : this.reply
	};
	
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);//错误，返回 err 信息
		}
		db.collection('reply_rules', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);//错误，返回 err 信息
			}
			collection.insert(rule, {
				safe: true
			}, function(err) {
				mongodb.close();
				if (err) {
					return callback(err);//错误，返回 err 信息
				}
				callback(null);//成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

ReplyRule.getRules = function(author, searchType, keyword, page, limit, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('reply_rules', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
//            if (author) {
//                query.author = author;
//            }
            if (keyword) {
                var reg = new RegExp("^.*" + keyword + ".*$", "i");
                if (searchType == 'watch_word') {
                    query.watch_word = reg;
                }
                if (searchType == 'author') {
                    query.author = reg;
                }
            }

            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1) * limit,
                    limit: limit
                }).sort({
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, docs, total);
                });
            });
        });
    });
};

ReplyRule.getOne = function(author, keyId, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('reply_rules', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			query._id = new ObjectID(keyId);
			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null, doc);
			});
		});
	});
};

//更新一篇文章及其相关信息
ReplyRule.update = function(keyId, rule, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('reply_rules', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                "_id": new ObjectID(keyId)
            }, {
                $set: {
					updated_time: getTime(),
                    watch_word: rule.watch_word,
                    word_type: rule.word_type,
                    status : rule.status
				}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//删除一篇文章
ReplyRule.remove = function(author, keyId, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('reply_rules', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //删除文档
            collection.remove({
                "_id": new ObjectID(keyId)
            }, {
                w:1
            } ,function (err) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                mongodb.close();
                callback(null);
            });
        });
    });
};
