var http = require("http");
var express = require("express");
var request = require("request");
var fs = require("fs");
var iconv = require('iconv-lite');
var app = express();
var port = process.env.PORT || 8080;
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
const url = require("url");
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
//app.use('/tmp', express.static(__dirname + '/tmp'));
app.use(bodyParser.json());


process.on('uncaughtException', function (err) {
    console.log('uncaughtException occurred: ' + (err.stack ? err.stack : err));
});

var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);

var linemessage = require('./linemessage');
var LineMessageAPI = new linemessage.linemessage();
//接收LINE訊息
app.post("/", function (req, res) {

    console.log("Get LINE Message");
    var userMessage = req.body;

    console.log(JSON.stringify(userMessage.events[0]));

    if (userMessage.events[0].type === "message") {
        switch (userMessage.events[0].message.type) {
            case "text":
                var msg = userMessage.events[0].message.text;
                userInput = msg
                console.log(msg);
                var requestUrl = config.localUrl + "/" + encodeURI(userInput);
                console.log("url: " + requestUrl)
                request.get(requestUrl, function (error, response, body) {
                    console.error('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    console.log('body:', body); // Print the HTML for the Google homepage.
                    body = JSON.parse(body)
                    if(body.source == 0){
                        if (body.answer.length > 0) {
                            let answer = String(body.answer[0]._source.answer).replace(/<br \/>/g, "\n")
                            LineMessageAPI.SendMessage(userMessage.events[0].source.userId, userMessage.events[0].replyToken, answer, function () {
                                LineMessageAPI.SendButtons(userMessage.events[0].source.userId, "您對該回答滿意嗎", [{
                                    "type": "postback",
                                    "label": "滿意",
                                    "data": `?action=qa&q=${userInput}&score=2`,
                                }, {
                                    "type": "postback",
                                    "label": "普通",
                                    "data": `?action=qa&q=${userInput}&score=1`,
    
                                }, {
                                    "type": "postback",
                                    "label": "不滿意",
                                    "data": `?action=qa&q=${userInput}&score=0`,
                                }], "您對該回答滿意嗎", userMessage.events[0].replyToken, function () {
                                    var relativeQuestion = String(body.answer[0]._source.relativeQuestion).split('-')
                                    var buttons = []
                                    for (var i in relativeQuestion) {
                                        buttons.push({
                                            "type": "message",
                                            "label": relativeQuestion[i],
                                            "text": relativeQuestion[i]
                                        })
                                    }
                                    LineMessageAPI.SendButtons(userMessage.events[0].source.userId, "接下來想了解什麼", buttons, "接下來想了解什麼", userMessage.events[0].replyToken, function () {
                                    })
    
                                })
    
                            })
    
                        }
                        else {
                            userInput = "找不到適合的答案"                      
                            LineMessageAPI.SendMessage(userMessage.events[0].source.userId, userMessage.events[0].replyToken, userInput, function () { })
                        }
                    }
                    else if(body.source == 1){
                        let answer = String(body.answer).replace(/<br \/>/g, "\n")
                        LineMessageAPI.SendMessage(userMessage.events[0].source.userId, userMessage.events[0].replyToken, answer, function () {
                            LineMessageAPI.SendButtons(userMessage.events[0].source.userId, "您對該回答滿意嗎", [{
                                "type": "postback",
                                "label": "滿意",
                                "data": `?action=qa&q=${userInput}&score=2`,
                            }, {
                                "type": "postback",
                                "label": "普通",
                                "data": `?action=qa&q=${userInput}&score=1`,

                            }, {
                                "type": "postback",
                                "label": "不滿意",
                                "data": `?action=qa&q=${userInput}&score=0`,
                            }], "您對該回答滿意嗎", userMessage.events[0].replyToken, function () {
                                var relativeQuestion = String(body.relativeQuestion).split('-')
                                var buttons = []
                                for (var i in relativeQuestion) {
                                    buttons.push({
                                        "type": "message",
                                        "label": relativeQuestion[i],
                                        "text": relativeQuestion[i]
                                    })
                                }
                                LineMessageAPI.SendButtons(userMessage.events[0].source.userId, "接下來想了解什麼", buttons, "接下來想了解什麼", userMessage.events[0].replyToken, function () {
                                })

                            })

                        })

                    }
                    body.userId = userMessage.events[0].source.userId
                    request.post({
                        url: config.localUrl + "/CDC/QALog",
                        form: body
                    }, function (error, response, body) {
                        console.error('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log('body:', body); // Print the HTML for the Google homepage.
                        
                    })
                })
                break;
        }
    }
    else if (userMessage.events[0].type === "postback") {
        let arg = url.parse(userMessage.events[0].postback.data, true).query;
        //let action = req.query["action"];
        let action = arg["action"];
        let q = arg["q"];
        let score = arg["score"];
        switch (action) {
            case "qa":
                request.post({
                    url: config.localUrl + "/CDC/Satisfaction",
                    form: {
                        q : q,
                        score : score,
                        isdelete : 0          
                    }
                }, function (error, response, body) {
                    console.error('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    console.log('body:', body); // Print the HTML for the Google homepage.
                    LineMessageAPI.SendMessage(userMessage.events[0].source.userId, userMessage.events[0].replyToken, "已收到您的滿意度回覆", function () {})
                })
                break;

        }
    }

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
            }.bind({ response: this.response }));
            res.on('end', function () {
                try {
                    console.log('response end');
                    this.response.end();
                } catch (e) {
                    logger.error(e);
                }
            }.bind({ response: this.response }));
        }.bind({ response: response }));
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

app.get('/tmp/:filename', function (request, response) {
    var filename = request.params.filename;
    var stream = require('fs').createReadStream('/tmp/' + filename);
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