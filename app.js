var http = require("http");
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
var reservationCircle = ["預約", "選日期或醫生"]
var dataCircle = ["輸入日期", "輸入時段"];
var dataCircle = ["醫生姓名", "輸入日期時段"];

var Jieba = require('node-jieba');
var analyzer = Jieba({
    debug: false
});
analyzer.dict('dict.txt', function (err) {
    if (err) console.log(err)
});
//
analyzer.cut("我要預定一月一號", {
    mode: Jieba.mode.SEARCH,
    HMM: true
}, function (err, result) {
    if (err) console.log(err)
    console.log(JSON.stringify(result))
});
analyzer.pseg("我要預定一月一號", {
    mode: Jieba.mode.SEARCH,
    HMM: true
}, function (err, result) {
    if (err) console.log(err)
    console.log(JSON.stringify(result))
});
var userStage = new Map();
app.post("/", function (request, response) {
    ///
    console.log("Get LINE Message");
    var results = request.body.events;
    console.log(JSON.stringify(results));
    console.log('receive message count: ' + results.length);
    for (var idx = 0; idx < results.length; idx++) {
        switch (results[idx].message.type) {
            case "text":
                switch (results[idx].message.text) {
                    case "預約":
                        userStage.set(results[idx].source.userId, "預約");
                    default:
                        linemessage.SendMessage(results[idx].source.userId, results[idx].message.text, 'linehack2018', results[idx].replyToken, function (result) {
                            if (!result) console.log(result);
                            else console.log(result);
                        })
                }
                if (userStage.get(results[idx].source.userId))
                    break;

        }


    }
    console.log(JSON.stringify(userMessage.events[0]));


    var data = {
        'to': userMessage.events[0].source.userID,
        'replyToken': userMessage.events[0].replyToken
    };


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
    qe
    req.end();
}
//APP
app.get("/api", function (req, res) {
    res.send("API is running");
});