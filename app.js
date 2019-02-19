var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT;
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
var fs = require("fs");
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.use('/tmp', express.static(__dirname + '/tmp'));
app.use(bodyParser.json());
var fs = require('fs');
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

function ReplyMessage(data, channel_access_token, reply_token, callback) {
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
            callback(true);
        } else {
            console.log('Reply message failure');
            callback(false);
        }
    });
    req.write(JSON.stringify(data));
    req.end();
}

function PostToLINE(data, channel_access_token, callback) {
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
        res.on('end', function () {
        });
    });
    req.write(JSON.stringify(data));
    req.end();
    try {
        callback(true);
    } catch (e) { };
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






