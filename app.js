var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT;
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var utf8 = require("utf8");
var request = require("request");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/tmp', express.static(__dirname + '/tmp'));
app.use('/image', express.static(__dirname + '/image'));
app.use('/file', express.static(__dirname + '/file'));
app.use('/audio', express.static(__dirname + '/audio'));
app.use('/video', express.static(__dirname + '/video'));
app.use(bodyParser.json());
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
/*  {"type":"follow",
  "replyToken":"c24acf8f5dae4993b25eb5974a07cbdb",
  "source":{
      "userId":"Uc1c123646251df321f1a139eddb2a3f2",
      "type":"user"
      },
  "timestamp":1500003748184}*/
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
//接收LINE訊息
app.post("/", function (req, res) {

    console.log("Get Manager Message");
    var userMessage = req.body;
    console.log(JSON.stringify(userMessage));

    if (userMessage.object === 'page') {
        userMessage.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            let sender_psid = webhook_event.sender.id;
            // 判斷訊息是屬於 message 還是 postback
            // 判斷訊息是屬於 message 還是 postback」意思是發送者是否是透過機器人提供的選擇做回覆，如果「是」就是 postback；「不是」就屬於 message
            if (webhook_event.message) {
                switch (webhook_event.message.text) {
                    case "a":
                        handleMessage(sender_psid, webhook_event.message);
                        break;
                    case "b":
                        handleMessage_image(sender_psid, webhook_event.message);
                        break;
                    case "c":
                        handleMessage_template(sender_psid, webhook_event.message);
                        break;
                    case "d":
                        handleMessage_video(sender_psid, webhook_event.message);
                        break;
                    case "e":
                        handleMessage_audio(sender_psid, webhook_event.message);
                        break;
                    case "f":
                        handleMessage_file(sender_psid, webhook_event.message);
                        break;
                    default:
                        handleMessage_quick(sender_psid, webhook_event.message);

                }
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
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
        ReplyMessage(data, channel_access_token, data.replyToken, function (ret) {
            if (!ret)
                PostToLINE(data, channel_access_token, this.callback); // reply_token 已過期，改用 PUSH_MESSAGE                   
        });
    */

});
app.get('/download/content/:message_id', function (request, response) {
    try {
        var channel_id = config.channel_id;
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

function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": { //發送的ID
            "id": sender_psid
        },
        "message": response, //訊息格式
    }
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": {
            "access_token": config.channel_access_token
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {

            console.log('---> message sent!')
            console.log(JSON.stringify(request_body, null, 2))
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function handleMessage(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "text": `You sent the message: "${received_message.text}".`,
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_image(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "attachment": {
                type: "image",
                payload: {
                    url: "https://cdctest.herokuapp.com/image/1.jpg",
                    is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                }
            },
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_video(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "attachment": {
                type: "image",
                payload: {
                    url: "https://cdctest.herokuapp.com/video/1.mp4",
                    is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                }
            },
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_audio(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "attachment": {
                type: "image",
                payload: {
                    url: "https://cdctest.herokuapp.com/audio/1.mp3",
                    is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                }
            },
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_file(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "attachment": {
                type: "file",
                payload: {
                    url: "https://cdctest.herokuapp.com/file/1.txt",
                    is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                }
            },
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_template(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Welcome!",
                        "image_url": "https://cdctest.herokuapp.com/image/1.jpg",
                        "subtitle": "We have the right hat for everyone.",
                        "default_action": {
                            "type": "web_url",
                            "url": "https://cdctest.herokuapp.com/image/1.jpg",
                            "webview_height_ratio": "square",
                        },
                        "buttons": [{
                            "type": "web_url",
                            "url": "https://cdctest.herokuapp.com/image/1.jpg",
                            "title": "View Website"
                        }, {
                            "type": "postback",
                            "title": "Start Chatting",
                            "payload": "DEVELOPER_DEFINED_PAYLOAD"
                        }]
                    }]
                }
            }
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handleMessage_quick(sender_psid, received_message) {
    let response;
    // 判斷訊息是否包含文字
    if (received_message.text) {
        // 回傳的文字訊息
        response = {
            "text": `You sent the message: "${received_message.text}".`,
            "quick_replies": [{
                "content_type": "a",
                "title": "文字訊息",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/red.png"
            }, {
                "content_type": "b",
                "title": "image",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/green.png"
            }, {
                "content_type": "c",
                "title": "template",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/green.png"
            }, {
                "content_type": "d",
                "title": "video",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/green.png"
            }, {
                "content_type": "e",
                "title": "audio",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/green.png"
            }, {
                "content_type": "f",
                "title": "file",
                "payload": "<POSTBACK_PAYLOAD>",
                //"image_url":"http://example.com/img/green.png"
            }]
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    let response;
    // 取得發送者回覆內容
    let payload = received_postback.payload;
    // 判斷回覆的內容，對應機器人回應的訊息
    /*
    {
        sender: { id: '2892523437540225' },
        recipient: { id: '108984370859831' },
        timestamp: 1593762012184,
        postback: { title: 'Start Chatting', payload: 'DEVELOPER_DEFINED_PAYLOAD' }
    }
    */
    response = {
        "text": "收到postback : " + payload
    }
    if (payload === 'yes') {
        response = {
            "text": "Thanks!"
        }
    } else if (payload === 'no') {
        response = {
            "text": "Oops, try sending another image."
        }
    }
    // 機器人發送回應
    callSendAPI(sender_psid, response);
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


//APP
app.get("/api", function (req, res) {
    res.send("API is running");
});
*/