var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT;
var server = http.Server(app).listen(port);
var fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var linemessageapi = require('./linemessage');
var linemessage = new linemessageapi.linemessage();
app.post("/", function (request, response) {

    console.log("Get LINE Message");
    var results = request.body.events;
    console.log(JSON.stringify(results));
    console.log('receive message count: ' + results.length);
    for (var idx = 0; idx < results.length; idx++) {
        switch (userMessage.events[0].message.type) {
            case "text":
                linemessage.SendMessage(results[idx].source.userId, results[idx].message.text, 'linehack2018',results[idx].replyToken,function (result) {
                    if (!result) console.log(result);
                    else console.log(result);
                })
                break;

        }


    }
    console.log(JSON.stringify(userMessage.events[0]));


    var data = {
        'to': userMessage.events[0].source.userID,
        'replyToken': userMessage.events[0].replyToken
    };


});

function GetContent(data, channel_access_token) {//OK
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
    }); qe
    req.end();
}
//APP
app.get("/api", function (req, res) {
    res.send("API is running");
});






