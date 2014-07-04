var mongodb = require('./db')
  , markdown = require('markdown').markdown
  , ObjectID = require('mongodb').ObjectID
  , Common = require('../lib/common.js');

function Post(post) {
	this.author = post.author;
	this.title = post.title;
    this.picurl = post.picurl;
	this.description = post.description;
	this.classification = post.classification;
    this.link = post.link;
	this.content = post.content;
};

module.exports = Post;

function getTime() {
	return Common.getTime();
}

//存储用户信息
Post.prototype.save = function(callback) {
	
	//要存入数据库的用户文档
	var post = {
        author: this.author,
		time: getTime(),
		updated_time: getTime(),
		title: this.title,
        picurl: this.picurl,
		classification : this.classification,
        description: this.description,
        content: this.content,
        link:this.link,
		comments: []
	};
	
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);//错误，返回 err 信息
		}
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);//错误，返回 err 信息
			}
			collection.insert(post, {
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

Post.getPosts = function(author, classification, day, title, searchType, keyword, page, limit, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (author) {
                query.author = author;
            }
            if (classification) {
                query.classification = classification;
            }
            if (day) {
                query.day = day;
            }
            if (title) {
                query.title = title;
            }
            if (keyword) {
                var reg = new RegExp("^.*" + keyword + ".*$", "i");
                if (searchType == 'title') {
                    query.title = reg;
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
                    docs.forEach(function (doc) {
                        doc.content = markdown.toHTML(doc.content);
                    });
                    callback(null, docs, total);
                });
            });
        });
    });
};

Post.getOne = function(author, keyId, needMarkdown, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
            if (author) {
                query.author = author;
            }
			query._id = new ObjectID(keyId);
			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				if (doc && needMarkdown) {
					doc.content = markdown.toHTML(doc.content);
                    doc.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                    });
				}

				callback(null, doc);
			});
		});
	});
};

//更新一篇文章及其相关信息
Post.update = function(keyId, post, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                "author": post.author,
                "_id": new ObjectID(keyId)
            }, {
                $set: {
					updated_time: getTime(),
					title: post.title,
					picurl: post.picurl,
					classification : post.classification,
                    description: post.description,
					content: post.content
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
Post.remove = function(author, keyId, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //删除文档
            collection.remove({
                "author": author,
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
