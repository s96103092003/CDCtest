var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var linemessage = function (logger) {
    // 傳送訊息給 LINE 使用者
    this.SendMessage = function (userId, message, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [
                    { 'type': 'text', 'text': message }
                ]
            };
            console.log('傳送訊息給 ' + userId);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 傳送[可點選圖片]給 LINE 使用者
    this.SendImagemap = function (userId, baseUrl, altText, imagemap, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [{
                    "type": "imagemap",
                    "baseUrl": baseUrl,
                    "altText": altText,
                    "baseSize": {
                        "height": 693,
                        "width": 1040
                    },
                    "actions": imagemap
                }]
            };
            console.log('傳送訊息給 ' + userId);
            console.log('傳送圖片網址: ' + baseUrl);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 傳送【選單】給 LINE 使用者
    this.SendButtons = function (userId, image_url, title, text, buttons, alt_text, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [{
                    'type': 'template',
                    'altText': alt_text,
                    'template': {
                        'type': 'buttons',
                        'thumbnailImageUrl': image_url,
                        'title': title,
                        'text': text,
                        'actions': buttons
                    }
                }]
            };
            console.log('傳送訊息給 ' + userId);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 傳送【確認】給 LINE 使用者
    this.SendConfirm = function (userId, text, buttons, alt_text, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [{
                    'type': 'template',
                    'altText': alt_text,
                    'template': {
                        'type': 'confirm',
                        'text': text,
                        'actions': buttons
                    }
                }]
            };
            console.log('傳送訊息給 ' + userId);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 傳送【可滾動選單】給 LINE 使用者
    this.SendCarousel = function (userId, columns, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [{
                    'type': 'template',
                    'altText': '請至行動裝置檢視訊息',
                    'template': {
                        'type': 'carousel',
                        'columns': columns
                    }
                }]
            };
            console.log('傳送訊息給 ' + userId);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 傳送【自訂卡片】給 LINE 使用者
    this.SendFlex = function (userId, flex, password, reply_token, callback) {
        if (password == 'linehack2018') {
            var data = {
                'to': userId,
                'messages': [{
                    'type': 'flex',
                    'altText': '請至行動裝置檢視訊息',
                    'contents': flex
                }]
            };
            console.log('傳送訊息給 ' + userId);
            ReplyMessage(data, config.channel_access_token, reply_token, function (ret) {
                if (ret) {
                    this.callback(true);
                } else {
                    PostToLINE(data, config.channel_access_token, this.callback);
                }
            }.bind({ callback: callback }));
        } else {
            callback(false);
        }
    }

    // 取得 LINE 使用者資訊
    this.GetProfile = function (userId, callback) {
        var https = require('https');
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/profile/' + userId,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                if (res.statusCode == 200) {
                    var result = JSON.parse(chunk);
                    console.log('displayName: ' + result.displayName);
                    console.log('userId: ' + result.userId);
                    console.log('pictureUrl: ' + result.pictureUrl);
                    console.log('statusMessage: ' + result.statusMessage);
                    callback(result);
                } if (res.statusCode == 401) {
                    console.log('IssueAccessToken');
                    IssueAccessToken();
                }
            });
        }).end();
    }
    
    // 直接回覆訊息給 LINE 使用者
    function ReplyMessage (data, channel_access_token, reply_token, callback) {
        data.replyToken = reply_token;
        console.log(JSON.stringify(data));
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/message/reply',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                'Authorization': 'Bearer <' + channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
            res.on('end', function () {
            });
            console.log('Reply message status code: ' + res.statusCode);
            if (res.statusCode == 200) {
                console.log('Reply message success');
                this.callback(true);
            } else {
                console.log('Reply message failure');
                this.callback(false);
            }
        }.bind({ callback: callback }));
        req.write(JSON.stringify(data));
        req.end();
    }
    
    function PostToLINE (data, channel_access_token, callback) {
        console.log(JSON.stringify(data));
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/message/push',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                'Authorization': 'Bearer <' + channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });
        req.write(JSON.stringify(data));
        req.end();
        try {
            callback(true);
        } catch (e) { };
    }

    function IssueAccessToken () {
        var https = require('https');
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/oauth/accessToken',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        options.form = {};
        options.form.grant_type = 'client_credentials';
        options.form.client_id = config.channel_id;
        options.form.client_secret = config.channel_secret;

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                if (res.statusCode == 200) {
                    var result = JSON.parse(chunk);
                    config.channel_access_token = result.access_token;
                    var fs = require('fs');
                    fs.writeFile(__dirname + '/config.json', JSON.stringify(config), function (err) {
                        if (err) {
                            logger.error(e);
                        }
                    });
                }
            });
        }).end();
    }
}

exports.linemessage = linemessage;