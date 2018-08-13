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

var asdasdasd;
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
            break;
    }
    var rasa_data = {
        "q": msg,
        "project": "default",
        "model": "model_20180813-123841"
    }
    fs.readFile(__dirname + '/userData.json', 'utf8', function (err, user_text) {
        user_text = JSON.parse(user_text);
        PostToRasa(rasa_data, function (body) {
            var rasaData = JSON.parse(body);
            /*
            "text": "請問天花的最新消息是什麼",
            "intent": "disease",
            "entities": [
              {
                "start": 2,
                "end": 4,
                "value": "天花",
                "entity": "infectiousDisease"
              },
              {
                "start": 5,
                "end": 9,
                "value": "最新消息",
                "entity": "class"
              }
            ]*/
            console.log(rasaData)
            var rasa_res = {
                "text": "",
                "intent": "",
                "entities": [
                ]
            };

            rasa_res.text = rasaData.text;
            rasa_res.intent = rasaData.intent.name
            for (var i in rasaData.entities) {
                var rasa_entities = {
                    "start": "",
                    "end": "",
                    "value": "",
                    "entity": ""
                }
                rasa_entities.start = rasaData.entities[i].start
                rasa_entities.end = rasaData.entities[i].end
                rasa_entities.value = rasaData.entities[i].value
                rasa_entities.entity = rasaData.entities[i].entity
                rasa_res.entities.push(rasa_entities)
            }
            user_text.push(rasa_res)

            data.messages = [{
                'type': 'text',
                'text': "信心分數: " + rasaData.intent.confidence + '\n' + JSON.stringify(rasa_res, null, 2)
            }];
            PostToLINE(data, channel_access_token, function () { 
                asdasdasd = rasa_res;
                fs.writeFile(__dirname + "/demo-userData.json", JSON.stringify(rasa_res, null, 2))

            })

        })
    })
})
app.get("/lookRasa",function(req, res){
    res.send(JSON.stringify(asdasdasd, null, 2));
})
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
    //  console.log(str)
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


function PostToRasa(data, callback) {
    console.log(JSON.stringify(data));
    var options = {
        host: '140.129.20.136',
        port: '5000',
        path: '/parse',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': Buffer.byteLength(JSON.stringify(data)),
        }
    };
    var http = require('http');
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.body = '';
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            res.body += chunk;
        });
        res.on('end', function () {
            //console.log(res.body)
            callback(res.body);
        });
    });
    req.write(JSON.stringify(data));
    req.end();
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