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
                        resProcess(results[idx].source.userId, results[idx].replyToken)
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

function ResProcessCheck(userId, userText, callback) {
    console.log("into ResProcessCheck")
    var find = false;
    var ResProcess;
    if (userData.get(userId) == null) {
        console.log("ResProcessData userStage null")
        ResProcess = {
            object: null,
            date: null, //日期
            time: null, //時段 0,1,2
            doctorName: null
        };
    } else {
        console.log("ResProcessData userStage hasValue")
        ResProcess = userData.get(userId);
    }

    for (var data in doctorNames) {
        for (var i in data) {
            if (userText.indexOf(data[i])) {
                ResProcess.doctorName = data[0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var data in dataSeg) {
        for (var i in data) {
            if (userText.indexOf(data[i])) {
                ResProcess.date = data[0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var data in objectSeg) {
        for (var i in data) {
            if (userText.indexOf(data[i])) {
                ResProcess.object = data[0];
                find = true;
                break;
            }
        }
        if (find) {
            find = false;
            break;
        }
    }
    for (var data in timeSeg) {
        for (var i in data) {
            if (userText.indexOf(data[i])) {
                ResProcess.time = data[0];
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

function resProcess(userId, replyToken) {
    console.log("into resProcess")
    var text = "";
    var ResProcess = userData.get(userId);
    if (ResProcess.object == null) {
        text = "請問要預約的科系是什麼?"
    } else if (ResProcess.date == null) {
        text = "請問要預約幾月幾日呢?"
    } else if (ResProcess.time == null) {
        text = "請問要預約上午、下午還是晚上時段呢?"
    } else if (ResProcess.name == null) {
        text = "有指定的醫師嗎?"
    } else if (ResProcess.doctorName != null) {
        text = "預約完成查詢結果"
        userStage.set(results[idx].source.userId, null)
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