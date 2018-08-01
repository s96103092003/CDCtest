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
var iconv = require('iconv-lite');
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
var entities_csv = [];
app.post("/", function (req, response) {
    console.log('Get LINE Message');
    var userMessage = req.body;

    console.log(JSON.stringify(userMessage.events[0]));///

    var data = {
        'to': userMessage.events[0].source.userId,
        'replyToken': userMessage.events[0].replyToken
    };
    var getUri = ''
    switch (userMessage.events[0].message.type) {
        case "text":
            var msg = userMessage.events[0].message.text;
            getUri = 'http://140.129.20.136:5000/parse?q=' + msg + '&project=default&model=model_3030disease'
            break;
    }
    readEntities(function (reg) {
        if (reg) {
            url_encode(getUri, function (uri) {
                request(uri, (err, res, body) => {
                    var rasaData = JSON.parse(body);
                    //console.log(body)
                    if (rasaData.intent.name == 'disease') {
                        if (rasaData.entities.length < 2) {
                            if (rasaData.entities[0].entity == 'infectiousDisease') {
                                data.messages = [{
                                    'type': 'text',
                                    'text': 'noclass'
                                }];
                                console.log('noclass')
                            }
                            else if (rasaData.entities[0].entity == 'class') {
                                data.messages = [{
                                    'type': 'text',
                                    'text': 'noinfectiousDisease'
                                }];
                                console.log('noinfectiousDisease')
                            }
                        }
                        else if (rasaData.entities.length == 2) {
                            if (rasaData.entities[0].entity == 'infectiousDisease') {
                                let txt;
                                let txt1;
                                for (var i = 0; i < entities_csv[0].length; i++) {
                                    if (rasaData.entities[0].value == entities_csv[0][i]) {
                                        console.log(i)
                                        console.log(entities_csv[0][i])
                                        txt = i + '-';
                                        txt1 = entities_csv[0][i];
                                    }
                                }
                                for (var i = 0; i < entities_csv[1].length; i++) {
                                    if (rasaData.entities[1].value == entities_csv[1][i]) {
                                        console.log(i)
                                        console.log(entities_csv[1][i])
                                        txt += i + '';
                                        txt1 += entities_csv[1][i];
                                    }
                                }
                                data.messages = [{
                                    'type': 'text',
                                    'text': txt + '\n' + txt1
                                }];
                                PostToLINE(data, channel_access_token, function (reg) { });
                            }
                            if (rasaData.entities[0].entity == 'class') {
                                let txt = '';
                                let txt1 = '';
                                for (var i = 0; i < entities_csv[0].length; i++) {
                                    if (rasaData.entities[1].value == entities_csv[0][i]) {
                                        console.log(i)
                                        console.log(entities_csv[0][i])
                                        txt = i + '-';
                                        txt1 = entities_csv[0][i];
                                    }
                                }
                                for (var i = 0; i < entities_csv[1].length; i++) {
                                    if (rasaData.entities[0].value == entities_csv[1][i]) {
                                        console.log(i)
                                        console.log(entities_csv[1][i])
                                        txt += i + '';
                                        txt1 += entities_csv[1][i];
                                    }
                                }
                                data.messages = [{
                                    'type': 'text',
                                    'text': txt + '\n' + txt1
                                }];
                                PostToLINE(data, channel_access_token, function (reg) { });
                            }
                        }
                    }
                    else if (rasaData.intent.name == 'noinfectiousDisease') {
                        console.log('noinfectiousDisease')
                        data.messages = [{
                            'type': 'text',
                            'text': 'noinfectiousDisease'
                        }];
                        PostToLINE(data, channel_access_token, function (reg) { });
                    }
                    else if (rasaData.intent.name == 'noclass') {
                        data.messages = [{
                            'type': 'text',
                            'text': 'noclass'
                        }];
                        console.log('noclass')
                        PostToLINE(data, channel_access_token, function (reg) { });
                    }
                    else {
                        console.log(rasaData.intent.name)
                        var infectiousDisease = rasaData.intent.name.split('-')[0];
                        var class1 = rasaData.intent.name.split('-')[1];
                        data.messages = [{
                            'type': 'text',
                            'text': rasaData.intent.name + '\n' + entities_csv[0][infectiousDisease] + '-' + entities_csv[1][class1]
                        }];
                        console.log(entities_csv[0][infectiousDisease] + '-' + entities_csv[1][class1])
                    }
                    PostToLINE(data, channel_access_token, function (reg) { });
                })
            })
        }
        else {
            data.messages = [{
                'type': 'text',
                'text': '沒有entities檔案'
            }];
            console.log('沒有entities檔案')
            PostToLINE(data, channel_access_token, function (reg) { });
        }

    })


});
app.get("/api", function (req, res) {
    console.log('API is running')
    res.send("API is running");
});
console.log('start my app')

function readEntities(callback) {
    fs.readFile('entities.csv', 'binary', function (err, entities_data) {
        if (err) {
            console.log(err.stack);
            callback(false)
            return;
        }

        ConvertToTable(entities_data, function (entities_table) {
            //console.log(JSON.stringify(entities_table, null, 2))
            entities_list = entities_table[0];
            for (var i = 0; i < entities_table[0].length; i++) {
                entities_csv[i] = [];
                for (var j = 1; j < entities_table.length; j++) {
                    if (entities_table[j][i] != undefined)
                        entities_csv[i].push(entities_table[j][i]);
                }
            }
            for (var i = 0; i < entities_csv.length; i++) {
                for (var j = 0; j < entities_csv[i].length; j++) {
                    if (entities_csv[i][j] == "") {
                        entities_csv[i].splice(j, 1);
                        j -= 1;
                    }
                }
            }
            //console.log(JSON.stringify(entities_csv, null, 2));
            callback(true);
        })
    });
}

function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    var buf = new Buffer(data, 'binary');
    var str = iconv.decode(buf, 'utf-8');
    console.log('ConvertToTable')
    //console.log(str)
    rows = str.split("\n");
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    callBack(table);
}

function PostToLINE(data, channel_access_token, callback) {
    //console.log(JSON.stringify(data));
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






function url_encode(url, callback) {
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    callback(url)
}