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
//var DirectLine = require(path.join(__dirname, '/directline.js'))
var fbmessage = require('./fbmessage');
var FBMessageAPI = new fbmessage.fb_message();
/*  {"type":"follow",
  "replyToken":"c24acf8f5dae4993b25eb5974a07cbdb",
  "source":{
      "userId":"Uc1c123646251df321f1a139eddb2a3f2",
      "type":"user"
      },
  "timestamp":1500003748184}*/
//accessToken
var pageMap = new Map();
app.get("/index", function (req, res) {
    console.log("get index");
    var data = fs.readFileSync(__dirname + '/pages/index.html', 'utf8');
    res.set("Content-Type", 'text/html');
    data = data + "<script>const appId = " + config.APP_Id + ";</script>"
    res.send(data)
})
app.post("/GetLongLivedUserAccessToken", function (req, res) {
    console.log("GetLongLivedUserAccessToken");
    var userId = req.body.userId
    var accessToken = req.body.accessToken
    //res.send(data)
})
app.post("/GetAccount", function (req, res) {
    console.log("GetAccount");
    console.log(JSON.stringify(req.body, null, 2))
    var userID = req.body.userID
    var accessToken = req.body.accessToken

    GetAccount(userID, accessToken, async function (flag, data) {
        if (flag) {
            console.log("Response:" + JSON.stringify(data, null, 2))
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
        } else {
            res.sendStatus(404);
        }
    })
    //res.send(data)
})
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

    // var data = {
    //     "access_token": accessToken,
    //     "subscribed_fields": [
    //         'messaging_optins',
    //         'messaging_postbacks',
    //         'messages',
    //         'leadgen'
    //     ]
    // }
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
        // var data = {
        //     "access_token": accessToken,
        //     "subscribed_fields": [
        //         'messaging_optins',
        //         'messaging_postbacks',
        //         'messages',
        //         'leadgen'
        //     ]
        // }
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
/*
{
  "object":"page",
  "entry":[
    {
      "id":"<PAGE_ID>",
      "time":1458692752478,
      "messaging":[
        {
          "sender":{
            "id":"<PSID>"
          },
          "recipient":{
            "id":"<PAGE_ID>"
          },

          ...
        }
      ]
    }
  ]
}
*/
/*
var a = {
    "object": "page",
    "entry": [{
        "id": "100283728425577",
        "time": 1595575786943,
        "messaging": [{
            "sender": {
                "id": "3116355715119375"
            },
            "recipient": {
                "id": "100283728425577"
            },
            "timestamp": 1595575786677,
            "message": {
                "mid": "m_K7rDMa4f3j9IjON2h3wx27mPIj1WPS4YksS97kXPthJsY9dHkm09T_yY-2TNqmQXAKoOflYAgPqOSh8ncSjTiw",
                "attachments": [{
                    "type": "image",
                    "payload": {
                        "url": "https://scontent.xx.fbcdn.net/v/t1.15752-9/106538182_578310383056625_3267246385078665572_n.jpg?_nc_cat=100&_nc_sid=b96e70&_nc_ohc=uPHLzeF2UmcAX9rniGs&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=49fd1ae12c74dea7c150c68f6eb74c04&oe=5F3FC551"
                    }
                }]
            }
        }]
    }]
}
var b = {
    "object": "page",
    "entry": [{
        "id": "100283728425577",
        "time": 1595575635738,
        "messaging": [{
            "sender": {
                "id": "3116355715119375"
            },
            "recipient": {
                "id": "100283728425577"
            },
            "timestamp": 1595575635446,
            "message": {
                "mid": "m_eKIeewawv6O13KvO6s6pS7mPIj1WPS4YksS97kXPthL3qSus4iUchjYKC1gElfVqFzhp6bgAdADoQPpnKqLGvA",
                "text": "1"
            }
        }]
    }]
}
var c = {
    "object": "page",
    "entry": [{
        "id": "100283728425577",
        "time": 1595575939226,
        "messaging": [{
            "sender": {
                "id": "3116355715119375"
            },
            "recipient": {
                "id": "100283728425577"
            },
            "timestamp": 1595575938913,
            "message": {
                "mid": "m_c7aIoSPyrpTbMzDyug2uPrmPIj1WPS4YksS97kXPthKLLfGET8MVTQ7BqsEEVnu6hex-AcsDJF0EHUZ5Lon4yA",
                "attachments": [{
                    "type": "file",
                    "payload": {
                        "url": "https://cdn.fbsbx.com/v/t59.2708-21/107271418_574511696765767_4637954170273035811_n.txt/%E6%96%B0%E6%96%87%E5%AD%97%E6%96%87%E4%BB%B6.txt?_nc_cat=106&_nc_sid=0cab14&_nc_ohc=25PyU9XqSAgAX-M9rTd&_nc_ht=cdn.fbsbx.com&oh=31dbaae3b5f1192b4ab0e7f00cca0994&oe=5F1C300A"
                    }
                }]
            }
        }]
    }]
}
*/
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
            var access_token = ""
            for (var i in config.access_tokens) {
                if (config.access_tokens[i].recipient === webhook_event.recipient.id) {
                    access_token = config.access_tokens[i].access_token;
                    break;
                }
            }
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


/*







/*var http = require("http");
var https = require('https');
var express = require("express");
var app = express();
var port = process.env.PORT;
var server = http.Server(app).listen(port);
var fs = require("fs");
var bodyParser = require('body-parser');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var linemessageapi = require('./linemessage');
var linemessage = new linemessageapi.linemessage();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var doctorNames = [
    ["林醫師", "林醫生"],
    ["劉醫師", "劉醫生"],
    ["陳醫師", "陳醫生"],
    ["楊醫師", "楊醫生"]
];
var dataSeg = [];
for (var i = 1; i <= 12; i++) {
    var buf = []
    for (var j = 1; j <= 31; j++) {
        buf.push(i + "月" + j + "日");
        buf.push(i + "月" + j + "號");
    }
    dataSeg.push(buf);
}
var timeSeg = [
    ["上午", "早上"],
    ["下午", "中午"],
    ["晚上", "傍晚"]
];
var objectSeg = [
    ["內科", "內科系"],
    ["外科", "外科系"],
    ["婦產科", "婦科", "婦科系"],
    ["小兒科", "兒科", "兒科系"]
];

var Stage = null;
var userStage = new Map();
var userData = new Map();
var text = new Map();

app.post("/", function (request, response) {
    ///
    console.log("Get LINE Message");
    var results = request.body.events;
    console.log(JSON.stringify(results));
    console.log('receive message count: ' + results.length);
    for (var idx = 0; idx < results.length; idx++) {

        switch (results[idx].message.type) {
            case "text":
                var userText = results[idx].message.text;
                console.log("userStage: " + userStage.get(results[idx].source.userId))
                console.log("userData: " + userData.get(results[idx].source.userId))
                if (userText.indexOf("預約") != -1 || userText.indexOf("掛號") != -1 || userStage.get(results[idx].source.userId) == "預約") {
                    if (userStage.get(results[idx].source.userId) == null) {
                        userStage.set(results[idx].source.userId, "預約")
                    }
                    ResProcessCheck(results[idx].source.userId, userText, function () {
                        resProcessMessage(results[idx].source.userId, results[idx].replyToken)
                    })

                } else { //
                    if (userStage.get(results[idx].source.userId) == null) {
                        linemessage.SendMessage(results[idx].source.userId, "看不懂喔", 'linehack2018', results[idx].source.replyToken, function (result) {
                            if (!result) console.log(result);
                            else console.log(result);
                        })
                    }
                }
                break;
            default:
                if (userStage.get(results[idx].source.userId) == "預約") {
                    linemessage.SendMessage(results[idx].source.userId, "你還沒完成預約流程喔", 'linehack2018', results[idx].source.replyToken, function (result) {
                        if (!result) console.log(result);
                        else console.log(result);
                    })
                } else if (userStage.get(results[idx].source.userId) == null) {
                    linemessage.SendMessage(results[idx].source.userId, "看不懂喔", 'linehack2018', results[idx].source.replyToken, function (result) {
                        if (!result) console.log(result);
                        else console.log(result);
                    })
                }
                break;
        }
    }
});
//
function ResProcessCheck(userId, userText, callback) {
    console.log("into ResProcessCheck")
    var find = false;
    var ResProcess;
    if (userData.get(userId) == null) {
        console.log("ResProcessCheck userData null")
        ResProcess = {
            object: null,
            date: null, //日期
            time: null, //時段 0,1,2
            doctorName: null
        };
    } else {
        console.log("ResProcessCheck userData hasValue")
        ResProcess = userData.get(userId);
    }
    for (var i = 0; i < doctorNames.length; i++) {
        for (var j = 0; j < doctorNames[i].length; j++) {
            if (userText.indexOf(doctorNames[i][j]) != -1) {
                ResProcess.doctorName = doctorNames[i][0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var i = 0; i < dataSeg.length; i++) {
        for (var j = 0; j < dataSeg[i].length; j++) {
            if (userText.indexOf(dataSeg[i][j]) != -1) {
                ResProcess.date = dataSeg[i][0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var i = 0; i < objectSeg.length; i++) {
        for (var j = 0; j < objectSeg[i].length; j++) {
            if (userText.indexOf(objectSeg[i][j]) != -1) {
                ResProcess.object = objectSeg[i][0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var i = 0; i < timeSeg.length; i++) {
        for (var j = 0; j < timeSeg[i].length; j++) {
            if (userText.indexOf(timeSeg[i][j]) != -1) {
                ResProcess.time = timeSeg[i][0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    console.log("after check: " + JSON.stringify(ResProcess))
    userData.set(userId, ResProcess)
    callback();
}

function resProcessMessage(userId, replyToken) {
    console.log("into resProcess")
    var text = "";
    var ResProcess = userData.get(userId);
    console.log("resProcess " + JSON.stringify(ResProcess))
    if (ResProcess.object == null) {
        text = "請問要預約的科系是什麼?"
    } else if (ResProcess.date == null) {
        text = "請問要預約幾月幾日呢?"
    } else if (ResProcess.time == null) {
        text = "請問要預約上午、下午還是晚上時段呢?"
    } //else if (ResProcess.doctorName == null) {
    // text = "有指定的醫師嗎?"
    //} 
    else {
        text = "預約完成"
        userStage.set(userId, null)
        userData.set(userId, null)
    }
    linemessage.SendMessage(userId, text, 'linehack2018', replyToken, function (result) {
        if (!result) console.log(result);
        else console.log(result);
    })
}

*/