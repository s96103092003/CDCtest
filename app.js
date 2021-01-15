var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 50037;
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
//var utf8 = require("utf8");
//var request = require("request");

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use('/tmp', express.static(__dirname + '/tmp'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/file', express.static(__dirname + '/file'));
app.use('/audio', express.static(__dirname + '/audio'));
app.use('/video', express.static(__dirname + '/video'));
app.use('/pages', express.static(__dirname + '/pages'));
app.use(bodyParser.json());

process.on('uncaughtException', function (err) {
    console.log('uncaughtException occurred: ' + (err.stack ? err.stack : err));
});

//
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var pageMap = new Map();
var userMap = new Map();
var userAccessMap = new Map();
var fbmessage = require('./fbmessage');
var FBMessageAPI = new fbmessage.fb_message();

app.get("/omnichat", function (req, res) {
    console.log("get omnichat");
    var data = fs.readFileSync(__dirname + '/pages/omnichat.html', 'utf8');
    res.set("Content-Type", 'text/html');
    //data = data + "<script>const appId = " + config.APP_Id + ";</script>"
    res.send(data)
})

//#region 粉專綁定用
/**
 * 
 * 主頁
 */
app.get("/index", function (req, res) {
    console.log("get index");
    var data = fs.readFileSync(__dirname + '/pages/index.html', 'utf8');
    res.set("Content-Type", 'text/html');
    data = data + "<script>const appId = " + config.APP_Id + ";</script>"
    res.send(data)
})
/**
 * 
 * 取得FB帳號
 */
app.post("/GetAccount", function (req, res) {
    console.log("GetAccount");
    console.log(JSON.stringify(req.body, null, 2))
    var userID = req.body.userID
    var accessToken = req.body.accessToken

    GetAccount(userID, accessToken, async function (flag, data) {
        if (flag) {
            var result = []
            data = JSON.parse(data).data
            for (var i in data) {
                var item = data[i]
                pageMap.set(item.id, item.access_token)
                var isConnect = await getPageSubscribed(item.id, item.access_token);
                result.push({
                    "category": item.category,
                    "category_list": item.category_list,
                    "name": item.name,
                    "id": item.id,
                    "picture_url": item.picture.data.url,
                    "isConnect": isConnect[0]
                })
            }
            res.send(result);
            if (!userMap.has(userID)) {
                userAccessMap.set(userID, accessToken);
                userMap.set(userID, setInterval(function () {
                    UpdateUserAccessToken(userAccessMap.get(userID), async function (flag, data) {
                        if (flag) {
                            console.log("50分一次更新user acesstoken : " + userID)
                            data = JSON.parse(data)
                            console.log("USER ACCESS " + userAccessMap.get(userID) + " => " + data.accessToken)
                            userAccessMap.set(userID, data.accessToken);
                            GetAccount(userID, userAccessMap.get(userID), async function (flag, data) {
                                if (flag) {
                                    console.log("50分一次更新page acesstoken : " + userID)
                                    data = JSON.parse(data).data
                                    for (var i in data) {
                                        var item = data[i]
                                        pageMap.set(item.id, item.access_token)
                                    }
                                } else {
                                    res.sendStatus(404);
                                }
                            })
                        } else {
                            res.sendStatus(404);
                        }
                    })

                }, 0.5 * 60000))
            }

        } else {
            res.sendStatus(404);
        }
    })
    //res.send(data)
})
/**
 * 
 * 訂閱粉專
 */
app.post("/PageSub", function (req, res) {
    console.log("GetPageSub");
    console.log(JSON.stringify(req.body, null, 2))
    var pageId = req.body.pageId

    postPageSubscribed(pageId, pageMap.get(pageId), function (flag, data) {
        if (flag) {
            console.log("Response:" + JSON.stringify(data, null, 2))
            res.send(true);
        } else {
            res.sendStatus(404);
        }
    })
    //res.send(data)
})
/**
 * 
 * 刪除訂閱粉專
 */
app.post("/DeletePageSub", function (req, res) {
    console.log("DeletePageSub");
    console.log(JSON.stringify(req.body, null, 2))
    var pageId = req.body.pageId

    deletePageSubscribed(pageId, pageMap.get(pageId), function (flag, data) {
        if (flag) {
            console.log("Response:" + JSON.stringify(data, null, 2))
            res.send(true);
        } else {
            res.sendStatus(404);
        }
    })
    //res.send(data)
})


function GetAccount(userID, accessToken, callback) {
    console.log("GetAccount function");
    //pages_show_list 權限
    //用於列出可在粉絲專頁上執行 MODERATE 工作的所有粉絲專頁的使用者存取權杖
    var data = ""
    var options = {
        host: 'graph.facebook.com',
        port: '443',
        path: '/' + userID + '/accounts?access_token=' + accessToken + '&&fields=id,name,picture,category,category_list,access_token',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            //'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            //'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    console.log(JSON.stringify(options, null, 2))
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response: ' + chunk);
            data += chunk
        });
        res.on('end', function () {
            console.log('GetAccount status code: ' + res.statusCode);
            if (res.statusCode == 200) {
                console.log('GetAccount success');
                console.log('GetAccount Response: ' + data);
                this.callback(true, data);
            } else {
                console.log('GetAccount failure');
                this.callback(false);
            }
        }.bind({
            callback: this.callback
        }));
    }.bind({
        callback: callback
    }));
    //req.write(JSON.stringify(data));
    req.end();
}

function UpdateUserAccessToken(accessToken, callback) {
    console.log("UpdateUserAccessToken function");
    //pages_show_list 權限
    //用於列出可在粉絲專頁上執行 MODERATE 工作的所有粉絲專頁的使用者存取權杖
    var data = ""
    var options = {
        host: 'graph.facebook.com',
        port: '443',
        path: '/oauth/access_token?grant_type=fb_exchange_token&&client_id=' + config.APP_Id + '&&client_secret=' + config.APP_Secret + '&&fb_exchange_token=' + accessToken + '',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            //'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            //'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    console.log(JSON.stringify(options, null, 2))
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response: ' + chunk);
            data += chunk
        });
        res.on('end', function () {
            console.log('UpdateUserAccessToken status code: ' + res.statusCode);
            if (res.statusCode == 200) {
                console.log('UpdateUserAccessToken success');
                console.log('UpdateUserAccessToken Response: ' + data);
                this.callback(true, data);
            } else {
                console.log('UpdateUserAccessToken failure');
                this.callback(false);
            }
        }.bind({
            callback: this.callback
        }));
    }.bind({
        callback: callback
    }));
    //req.write(JSON.stringify(data));
    req.end();
}

function postPageSubscribed(pageId, accessToken, callback) {
    console.log("postPageSubscribed function");
    //pages_show_list 權限
    //用於列出可在粉絲專頁上執行 MODERATE 工作的所有粉絲專頁的使用者存取權杖 
    var data = {
        "access_token": accessToken,
        "subscribed_fields": [
            'messaging_optins',
            'messaging_postbacks',
            'messages',
            'leadgen'
        ]
    }
    var options = {
        host: 'graph.facebook.com',
        port: '443',
        path: '/v2.11/' + pageId + '/subscribed_apps',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            //'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        var result = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response: ' + chunk);
            result += chunk
        });
        res.on('end', function () {
            console.log('postPageSubscribed status code: ' + res.statusCode);
            if (res.statusCode == 200) {
                console.log('postPageSubscribed success');
                console.log('postPageSubscribed Response: ' + result);
                this.callback(true, result);
            } else {
                console.log('postPageSubscribed failure');
                this.callback(false);
            }
        }.bind({
            callback: this.callback
        }));
    }.bind({
        callback: callback
    }));
    req.write(JSON.stringify(data));
    req.end();

}

function deletePageSubscribed(pageId, accessToken, callback) {
    console.log("deletePageSubscribed function");
    //pages_show_list 權限
    //用於列出可在粉絲專頁上執行 MODERATE 工作的所有粉絲專頁的使用者存取權杖
    var options = {
        host: 'graph.facebook.com',
        port: '443',
        path: '/v2.11/' + pageId + '/subscribed_apps?access_token=' + accessToken,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            //'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            //'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        var result = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('Response: ' + chunk);
            result += chunk
        });
        res.on('end', function () {
            console.log('deletePageSubscribed status code: ' + res.statusCode);
            if (res.statusCode == 200) {
                console.log('deletePageSubscribed success');
                this.callback(true, result);
            } else {
                console.log('deletePageSubscribed failure');
                this.callback(false, result);
            }
        }.bind({
            callback: this.callback
        }));
    }.bind({
        callback: callback
    }));

    // req.write(JSON.stringify(data));
    req.end();

}
async function getPageSubscribed(pageId, accessToken) {
    console.log("getPageSubscribed function");
    //pages_show_list 權限
    //用於列出可在粉絲專頁上執行 MODERATE 工作的所有粉絲專頁的使用者存取權杖
    return new Promise((resolve, reject) => {
        var options = {
            host: 'graph.facebook.com',
            port: '443',
            path: '/v2.11/' + pageId + '/subscribed_apps?access_token=' + accessToken,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                //'Content-Length': Buffer.byteLength(JSON.stringify(data)),
                //'Authorization': 'Bearer <' + channel_access_token + '>'
            }
        };
        var https = require('https');
        var req = https.request(options, function (res) {
            var result = "";
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //console.log('Response: ' + chunk);
                result += chunk
            });
            res.on('end', function () {
                console.log('getPageSubscribed status code: ' + res.statusCode);
                if (res.statusCode == 200) {
                    console.log('getPageSubscribed success');
                    if (JSON.parse(result).data.length == 0)
                        resolve([false, result]);
                    else
                        resolve([true, result]);
                } else {
                    console.log('getPageSubscribed failure');
                    resolve([false, result]);
                }
            });
        });
        // req.write(JSON.stringify(data));
        req.end();
    });
}
//#endregion

/**驗證後台是否存在 */
app.get("/", function (req, res) {
    console.log("get webhook verify_token");
    console.log("req.url : " + req.url)
    var arg = url.parse(req.url).query;
    var a = req.query['hub.mode'];
    console.log("a : " + a)
    console.log("req.url arg: " + JSON.stringify(querystring.parse(arg)))
    var mode = querystring.parse(arg)["hub.mode"];
    var verify_token = querystring.parse(arg)["hub.verify_token"];
    var challenge = querystring.parse(arg)["hub.challenge"];
    console.log(config.AUTH_TOKEN + "  " + verify_token)
    if (mode === 'subscribe' && config.AUTH_TOKEN === verify_token) {
        console.log("verify success")
        res.status(200).send(challenge)
    } else {
        console.log("verify error")
        res.sendStatus(403)
    }

})
//接收FB訊息
app.post("/", function (req, res) {

    console.log("Get Manager Message");
    var userMessage = req.body;
    console.log(JSON.stringify(userMessage));

    if (userMessage.object === 'page') {
        userMessage.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(JSON.stringify(webhook_event, null, 2));
            let sender_psid = webhook_event.sender.id;
            // 判斷訊息是屬於 message 還是 postback
            // 判斷訊息是屬於 message 還是 postback」意思是發送者是否是透過機器人提供的選擇做回覆，如果「是」就是 postback；「不是」就屬於 message
            var access_token = pageMap.get(webhook_event.recipient.id)
            /*for (var i in config.access_tokens) {
                if (config.access_tokens[i].recipient === webhook_event.recipient.id) {
                    access_token = config.access_tokens[i].access_token;
                    break;
                }
            }*/
            console.log("access_token: " + access_token)
            if (access_token != "") {
                if (webhook_event.message) {
                    if (webhook_event.message.text) {
                        switch (webhook_event.message.text) {
                            case "a":
                            case "文字訊息":
                                FBMessageAPI.SendFBMessage(sender_psid, webhook_event.message, access_token);
                                break;
                            case "b":
                            case "image":
                                FBMessageAPI.SendFBMessage_image(sender_psid, webhook_event.message, access_token);
                                break;
                            case "c":
                            case "template":
                                FBMessageAPI.SendFBMessage_template(sender_psid, webhook_event.message, access_token);
                                break;
                            case "d":
                            case "video":
                                FBMessageAPI.SendFBMessage_video(sender_psid, webhook_event.message, access_token);
                                break;
                            case "e":
                            case "audio":
                                FBMessageAPI.SendFBMessage_audio(sender_psid, webhook_event.message, access_token);
                                break;
                            case "f":
                            case "file":
                                SendFBMessage_file(sender_psid, webhook_event.message, access_token);
                                break;
                            default:
                                FBMessageAPI.SendFBMessage_quick(sender_psid, webhook_event.message, access_token);
                        }
                    } else {
                        var attachments = webhook_event.message.attachments[0]
                        if (attachments.type == "file") {
                            FBMessageAPI.SendFBMessage_file(sender_psid, webhook_event.message, access_token, attachments.payload.url);
                        } else if (attachments.type == "audio") {
                            FBMessageAPI.SendFBMessage_audio(sender_psid, webhook_event.message, access_token, attachments.payload.url);
                        } else if (attachments.type == "image") {
                            FBMessageAPI.SendFBMessage_image(sender_psid, webhook_event.message, access_token, attachments.payload.url);
                        } else if (attachments.type == "video") {
                            FBMessageAPI.SendFBMessage_video(sender_psid, webhook_event.message, access_token, attachments.payload.url);
                        }
                    }
                } else if (webhook_event.postback) {
                    FBMessageAPI.SendFBPostback(sender_psid, webhook_event.postback);
                }
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }

    //var channel_access_token = config.channel_access_token;
    /*
            var data = {
                "messaging_type": "<MESSAGING_TYPE>",
                "recipient": {
                    "id": "<PSID>"
                },
                "message": {
                    "text": "hello, world!"
                }
            }
    
            switch (userMessage.events[0].message.type) {
                case "text":
                    var msg = userMessage.events[0].message.text;
                    var buf = {
                        type: 'text',
                        text: msg
                    }
                    data.messages.push(buf)
                    console.log(msg);
                    break;
    
            }
            ReplyMessage(data, Sl_access_token, data.replyToken, function (ret) {
                if (!ret)
                    PostToLINE(data, channel_access_token, this.callback); // reply_token 已過期，改用 PUSH_MESSAGE                   
            });
        */
    //
});
app.get('/getPersonas', function (request, response) {
    //https://graph.facebook.com/<PERSONA_ID>?access_token=<PAGE_ACCESS_TOKEN>
    //https://graph.facebook.com/me/personas;?access_token=<PAGE_ACCESS_TOKEN>
    var user_id = request.params.user_id;
    var url = "";
    console.log("getPersonas")
    url = "https://graph.facebook.com/me/personas"
    callPersonasAPI(url)
})
app.get('/getPersonas/:user_id', function (request, response) {
    //https://graph.facebook.com/<PERSONA_ID>?access_token=<PAGE_ACCESS_TOKEN>
    //https://graph.facebook.com/me/personas;?access_token=<PAGE_ACCESS_TOKEN>
    var user_id = request.params.user_id;
    var url = "";
    console.log("getPersonas : " + user_id)

    url = "https://graph.facebook.com/" + user_id
    callPersonasAPI(url)

})

function callPersonasAPI(url, access_token) {
    request({
        "uri": url,
        "qs": {
            "access_token": access_token
        },
        "method": "GET",
        //"json": request_body
    }, (err, res, body) => {
        if (!err) {

            console.log('---> message sent!')
            console.log(JSON.stringify(res, null, 2))
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
app.get('/download/content/:message_id', function (request, response) {
    try {
        var APP_Id = config.APP_Id;
        var message_id = request.params.message_id;
        var https = require('https');
        var options = {
            host: 'api.line.me',
            port: '443',
            path: '/v2/bot/message/' + message_id + '/content',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer <' + config.channel_access_token + '>'
            }
        };

        var req = https.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.body = '';

            this.response.setHeader('Content-Length', res.headers['content-length']);
            this.response.setHeader('Content-Type', res.headers['content-type']);

            res.on('data', function (chunk) {
                console.log('get response data');
                res.body = res.body + chunk;
                this.response.write(chunk);
            }.bind({
                response: this.response
            }));
            res.on('end', function () {
                try {
                    console.log('response end');
                    this.response.end();
                } catch (e) {
                    logger.error(e);
                }
            }.bind({
                response: this.response
            }));
        }.bind({
            response: response
        }));
        req.end();
    } catch (e) {
        logger.error(e);
    }
});

function GetContent(data, channel_access_token) { //OK
    var options = {
        host: 'api.line.me',
        port: '443',
        path: '/v2/bot/message/' + data.events[0].message.id + '/content',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer <' + channel_access_token + '>'
        }
    };
    var https = require('https');

    var req = https.request(options, function (res) {
        res.setEncoding("binary");
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.body = '';
        res.on('data', function (chunk) {
            console.log('get response data');

            res.body = res.body + chunk;
        });

        res.on('end', function () {

            res.body = require('btoa')(res.body);
            try {
                fs.writeFile("/tmp/123.jpg", res.body, 'base64', function (err) {
                    if (err) throw err;
                });
                console.log('response end');
                // 將 res.body 寫入檔案
            } catch (e) {
                console.log(e);
            }

        });
    });
    req.end();
}

app.get('/:dic/:filename', function (request, response) {
    var filename = request.params.filename;
    var dic = request.params.dic;
    var stream = require('fs').createReadStream('/' + dic + '/' + filename);
    stream.pipe(response);
    response.clearCookie()
});


//APP
app.get("/api", function (req, res) {
    res.send("API is running");
});