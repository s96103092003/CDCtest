var http = require("http");
var express = require("express");
var fs = require("fs");
var url = require("url");
var qs = require('querystring');
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 8080;
var server = http.Server(app).listen(port);

var request = require('request');

/*
url_encode('http://140.129.20.136:5000/parse?q=天花&project=default&model=model_3030disease', function (uri) {
  request(uri, (err, res, body) => {
    console.log(body)
  })
})*/
app.use(bodyParser.urlencoded({
    extended: true
}));
//app.use('/tmp', express.static(__dirname + '/tmp'));
app.use(bodyParser.json());
var channel_access_token = 'yHeoGNC/JKjX3Fc1LVrQSf3jTXpvF+zn4rId5lZaqbgoAmIHTW0cmG35VlLmHzJ6KUkuoPokEvsQe3pVBDM5xLZUPWdtmTn0MyLof3OGx5VQ0hlj6PhDN2ds2In7MvTXKtd/17iO9gmOUi4M5Qt1FwdB04t89/1O/w1cDnyilFU=';
//接收LINE訊息

app.post("/", function (request, response){

    console.log("Get LINE Message");
    var userMessage = request.body;
   
    console.log(JSON.stringify(userMessage.events[0]));

    var SearchList = new Array();
    var channel_access_token = 'yHeoGNC/JKjX3Fc1LVrQSf3jTXpvF+zn4rId5lZaqbgoAmIHTW0cmG35VlLmHzJ6KUkuoPokEvsQe3pVBDM5xLZUPWdtmTn0MyLof3OGx5VQ0hlj6PhDN2ds2In7MvTXKtd/17iO9gmOUi4M5Qt1FwdB04t89/1O/w1cDnyilFU=';
    
   

    var data={'to': userMessage.events[0].source.userID,
            'replyToken': userMessage.events[0].replyToken};

    switch(userMessage.events[0].message.type){
        case "text":
            var msg = userMessage.events[0].message.text; 
            data.messages = [{
              'type': 'text',
              'text': msg
            }];
            break;
    }
    ReplyMessage(data, channel_access_token, data.replyToken, function (ret) {
      if (!ret)
          PostToLINE(data, channel_access_token, this.callback);// reply_token 已過期，改用 PUSH_MESSAGE                   
  });
    

});
app.get("/api", function(req,res){
  res.send("API is running");
});
PostToLINE({'to': 'Uff16cdc269b781d9e95bba911b52af70','messages': [{'type': 'text','text': 'qweqweqwe'}]}, channel_access_token,function(reg){});
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
    } catch (e) {};
}




    

function url_encode(url, callback) {
  url = encodeURIComponent(url);
  url = url.replace(/\%3A/g, ":");
  url = url.replace(/\%2F/g, "/");
  url = url.replace(/\%3F/g, "?");
  url = url.replace(/\%3D/g, "=");
  url = url.replace(/\%26/g, "&");
  callback(url)
}