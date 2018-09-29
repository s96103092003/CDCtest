var users = new Map();  // 紀錄進入 Beacon 範圍的使用者

// Application Log
var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
var logger = log4js.getLogger('bot');
var logger_line_message = log4js.getLogger('line_message');
var logger_line_LIFF = log4js.getLogger('line_LIFF');

// 連接 mongodb
var linemongodb = require('./linemongodb');
var linedb = new linemongodb.linemongodb();

// line Message API
var linemessageapi = require('./linemessage');
var linemessage = new linemessageapi.linemessage(logger_line_message);

// line LIFF API
var lineliffapi = require('./lineliff');
var lineliff = new lineliffapi.lineliff(logger_line_LIFF);

//line Flex API
var lineflexapi = require('./lineflex');
var lineflex = new lineflexapi.lineflex();

// 建立 express service
var express = require('express');
var app = express();
var port = process.env.PORT || 443;
var http = require('http');
var server = http.Server(app).listen(port);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));

// 讀取組態表
var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);

function user() {
    this.name = '';
    this.userid = '';
    this.image = '';
    this.location = [];
}

function location() {
    this.name = '';
    this.locationid = '';
    this.user = [];
}

function shuangjiou() {
    this.name = '';
    this.description = '';
    this.starttime = '';
    this.endtime = '';
    this.type = '';
    this.host = '';
    this.location = '';
    this.number = '';
    this.participant = [];
}

function host() {
    this.shuangjiouname = '';
    this.name = '';
    this.userid = '';
    this.gender = '';
    this.clothes = '';
    this.hat = '';
    this.location = '';
}

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

app.get('/api', function (request, response) {
    response.send('API is running');
});

app.get('/index', function (request, response) {
    request.header("Content-Type", 'text/html');
    fs.readFile(__dirname + '/pages/index.html', 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

app.get('/api/richmenulist', function (request, response) {
    linerichmenu.GetAllRichMenu(function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.get('/api/richmenu/:richmenuid', function (request, response) {
    var richmenuid = request.params.richmenuid;
    linerichmenu.GetRichMenu(richmenuid, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.post('/api/richmenu', function (request, response) {
    var richmenu = request.body.richmenu;
    linerichmenu.CreateRichMenu(richmenu, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.put('/api/richmenuimage', function (request, response) {
    var richmenuId = request.body.richmenuid;
    var image = request.body.image;
    fs.readFile(__dirname + '/resource/' + image, 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        linerichmenu.UpdateRichMenuImage(richmenuId, data, function (result) {
            if (result) this.res.send(true);
            else this.res.send(false);
        });
    }.bind({ req: request, res: response }));
});

app.delete('/api/richmenu/:richmenu', function (request, response) {
    var richmuneId = request.params.richmenuid;
    linerichmenu.DeleteRichMenu(richmuneId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.put('/api/richmenu/defaultrichmenu', function (request, response) {
    var richmenuId = request.body.richmenuid;
    linerichmenu.SetDefaultRichMenu(richmenuId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.put('/api/richmenu/link', function (request, response) {
    var userId = request.body.userid;
    var richmenuId = request.body.richmenuid;
    linerichmenu.LinkRichMenuToUser(userId, richmenuId, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.get('/api/liff', function (request, response) {
    lineliff.GetAllLIFF(function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.post('/api/liff', function (request, response) {
    var url = request.body.url;
    lineliff.AddLIFF(url, function (result) {
        if (result) response.send(result);
        else response.send(false);
    });
});

app.put('/api/liff', function (request, response) {
    var LIFF_ID = request.body.liff;
    var url = request.body.url;
    lineliff.UpdateLIFF(LIFF_ID, url, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.delete('/api/liff/:liff', function (request, response) {
    var LIFF_ID = request.params.liff;
    lineliff.DeleteLIFF(LIFF_ID, function (result) {
        if (result) response.send(true);
        else response.send(false);
    });
});

app.post('/api/beacon', function (request, response) {
    var beacon = new location();
    beacon.name = request.body.name;
    beacon.locationid = request.body.beacon_id;
    linedb.create_location(beacon, function (err, hosts) {
        if (err) {
            console.log('create beacon fail: ' + err);
            response.send('create beacon fail: ' + err);
        }
        console.log('create beacon success');
        response.send(hosts);
    });
});

app.post('/api/shungjiou', function (request, response) {
    console.log('POST /api/shungjiou');
    console.log(JSON.stringify(request.body));
    var data = request.body;
    data.host.userId = data.host.userId.replace('\"', '').replace('\"', '');
    linedb.get_locationidbyuser(data.host.userId, function (err, locationid) {
        if (err) this.response.send(err);
        else {
            var activity = new shuangjiou();
            activity.name = data.shuangjiou.name;
            activity.description = data.shuangjiou.description;
            activity.starttime = Date.now();
            activity.endtime = data.shuangjiou.endtime;
            activity.type = data.shuangjiou.type;
            activity.host = data.host.userId;
            activity.location = locationid;
            activity.number = data.shuangjiou.number;
            linedb.create_shuangjiou(activity, function (err) {
                if (err)
                    logger.error('fail: ' + err);
                else
                    console.log('success');
            });

            var organiser = new host();

            organiser.name = data.host.name;
            organiser.userid = data.host.userId;
            organiser.gender = data.host.gender;
            organiser.clothes = data.host.clothes;
            organiser.hat = data.host.hat;
            organiser.location = locationid;
            linedb.create_host(organiser, function (err) {
                if (err)
                    logger.error('fail: ' + err);
                else
                    console.log('success');
            });

            var flex = lineflex.CreateActivityFlex(activity);
            console.log(flex);
            linedb.get_userbylocationid(locationid, function (err, users) {
                if (err)
                    logger.error('fail: ' + err);
                else {
                    for (var index = 0; index < users.length; index++) {
                        linemessage.SendFlex(users[index].userid, flex, 'linehack2018', '', function (result) {
                            if (!result) {
                                logger.error('fail: ' + result);
                                this.response.send(err);
                            }
                            else {
                                console.log('success');
                                this.response.send('200');
                            }
                        }.bind({ response: this.response }));
                    }
                }
            }.bind({ response: this.response }));
        }
    }.bind({ response: response }));
});

app.get('/api/guest/:userid', function (request, response) {
    response.send('200');
});

app.use(express.static('resource'));

app.get('/image/:picture', function (request, response) {
    var picture = request.params.picture;
    request.header("Content-Type", 'image/jpeg');
    fs.readFile(__dirname + '/resource/' + picture, 'utf8', function (err, data) {
        if (err) {
            this.res.send(err);
        }
        this.res.send(data);
    }.bind({ req: request, res: response }));
});

var send_location = false;
// 接收來自 LINE 傳送的訊息
app.post('/', function (request, response) {
    console.log("POST /");
    try {
        var results = request.body.events;
        console.log(JSON.stringify(results));
        console.log('receive message count: ' + results.length);
        for (var idx = 0; idx < results.length; idx++) {

            if (send_location) {
                if (results[idx].type != "location")
                    linemessage.SendMessage(results[idx].source.userId, "未輸入位置訊息，請重新操作一次", 'linehack2018', results[idx].replyToken, function (result) {
                        if (!result) logger.error(result);
                        else console.log(result);
                        send_location = false;
                    });
            }
            else {
                var acct = results[idx].source.userId;
                var reply_token = results[idx].replyToken;
                console.log('reply token: ' + results[idx].replyToken);
                console.log('createdTime: ' + results[idx].timestamp);
                console.log('from: ' + results[idx].source.userId);
                console.log('type: ' + results[idx].type);
                if (results[idx].type == 'follow') {
                    FollowEvent(acct);
                }
                else if (results[idx].type == 'beacon') {    // 接收到使用者的 Beacon 事件
                    BeanconEvent(results[idx]);
                } 
                else if (results[idx].type == 'message') {
                    linemessage.SendMessage(results[idx].source.userId, 'test', 'linehack2018', results[idx].replyToken, function (result) {
                        if (!result) logger.error(result);
                        else console.log(result);
                    });
                    var message = results[idx].message;
                    console.log("message: "+ JSON.stringify(message));
                    switch (message.type) {
                        case "text":
                            if (message.text == "搜尋揪團"){
                                console.log("搜尋揪團..............................");
                                send_location = true;
                                linemessage.SendMessage(results[idx].source.userId, "請輸入位置資訊", 'linehack2018', results[idx].replyToken, function (result) {
                                    if (!result) logger.error(result);
                                    else console.log(result);
                                });
                            }
                            
                            break;
                        case "location":
                            console.log('緯度: ' + results[idx].message.latitude);
                            console.log('經度: ' + results[idx].message.longitude);
                            console.log(JSON.stringify(results[idx].type));
                            if (send_location) {
                                send_location = false;
                                manual_seearch(results[idx].message.latitude, results[idx].message.longitude,function(reg){
                                    if(reg)
                                        linemessage.SendMessage(results[idx].source.userId, "顯示FLEX", 'linehack2018', results[idx].replyToken, function (result) {
                                            if (!result) logger.error(result);
                                            else console.log(result);
                                        });
                                });
                            }
                            if (results[idx].postback.data == '') {
        
                            }
                        break;
                    }
                }
            }
        }
    } catch (e) {
    }
    response.send('');
});

/*
[
    {
        "type": "message",
        "replyToken": "9f79aff27d9c420a92c5608084e98d44",
        "source":
        {
            "userId": "U04bcc969c65df0e5bba8110c7ae4e3d1",
            "type": "user"
        },
        "timestamp": 1538196800660,
        "message":
        {
            "type": "sticker",
            "id": "8642656052320",
            "stickerId": "179",
            "packageId": "2"
        }
    }
]*/
//this.SendCarousel = function (userId, columns, password, reply_token, callback) {
/*

var flex = lineflex.CreateActivityFlex(activity);
            console.log(flex);
            linedb.get_userbylocationid(locationid, function (err, users) {
                if (err)
                    logger.error('fail: ' + err);
                else {
                    for (var index = 0; index < users.length; index++) {
                        linemessage.SendFlex(users[index].userid, flex, 'linehack2018', '', function (result) {
                            if (!result) {
                                logger.error('fail: ' + result);
                                this.response.send(err);
                            }
                            else {
                                console.log('success');
                                this.response.send('200');
                            }
                        }.bind({ response: this.response }));
                    }
                }
            }.bind({ response: this.response }));
*/
function manual_seearch(lat, lng, callback) {
    //this.getdistance = function (lat1, lng1, lat2, lng2)
    //this.get_shuangjious = function (callback) {
        console.log("manual_seearch: ......................................")
    var location_compare = [];
    linedb.get_shuangjious(function (shuangjious) {
        console.log("shuangjious: "+JSON.stringify(shuangjious, null, 2))
        for (var idx = 0; idx < shuangjious.length; idx++) {
            console.log("idx距離: "+ linedb.getdistance(shuangjious[idx].latitude, shuangjious[idx].longitude, lat, lng))
            if (location_compare.length == 0) {
                location_compare.push(shuangjious[idx])
            }
            else {
                for (var idy = 0; idy < location_compare.length; idy++) {
                    if (linedb.getdistance(shuangjious[idx].latitude, shuangjious[idx].longitude, lat, lng) <=
                        linedb.getdistance(location_compare[idy].latitude, location_compare[idy].longitude, lat, lng)) {
                        for (var idz = location_compare.length; idz > idy; idz--) {
                            location_compare[idz] = location_compare[idz-1];
                        }
                        location_compare[idy] = location_compare[idx];
                    }

                }
            }
        }
        console.log("location_compare: "+JSON.stringify(location_compare,null,2))
        callback(true)
    })

}
function FollowEvent(acct) {
    console.log('----------[Follow]---------');
    var new_user = new user();
    linemessage.GetProfile(acct, function (user) {
        this.new_user.name = user.displayName;
        this.new_user.userid = user.userId;
        this.new_user.image = user.pictureUrl;
        linedb.create_user(this.new_user, function (err) {
            if (err) logger.error('fail' + err);
            else console.log('success');
        });
    }.bind({ new_user: new_user }));
}

function BeanconEvent(event) {
    console.log('----------[Beacon]---------');
    console.log('source: ' + JSON.stringify(event.source));
    console.log('beacon: ' + JSON.stringify(event.beacon));
    console.log('beacon type: ' + event.beacon.type);
    switch (event.beacon.type) {
        case "enter":
            var update_user = new user();
            linemessage.GetProfile(event.source.userId, function (user) {
                this.update_user.name = user.displayName;
                this.update_user.userid = user.userId;
                this.update_user.image = user.pictureUrl;
                this.update_user.location.push(event.beacon.hwid);
                linedb.set_userbyuserid(this.update_user.userid, this.update_user, function (err) {
                    if (err) logger.error('fail' + err);
                    else console.log('success');
                });
            }.bind({ update_user: update_user }));
            linedb.enter_usertolocation(event.source.userId, event.beacon.hwid, function (err) {
                if (err) logger.error(err);
            });
            break;
    }
}

function CreateShuangjiou(user) {

}