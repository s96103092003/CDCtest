var http = require("http");
var express = require("express");
var fs = require("fs");
var url = require("url");
var qs = require('querystring');
var session = require('express-session');
var cookieParser = require('cookie-parser');/////
var path = require("path");
var bodyParser = require("body-parser");
var getJSON = require('get-json');
var app = express();
var port = process.env.PORT;
var server = http.Server(app).listen(8080);

ReplyMessage();
function ReplyMessage() {//LINE回復訊息
    console.log("ReplyMessage_DATA: " + JSON.stringify(data));
    var options = {
        host: '140.129.20.215',
        port: '8023',
        path: '/v2/bot/message/reply',
        method: 'GET',
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