var http = require("http");
var express = require("express");
var request = require("request");
var fs = require("fs");
var iconv = require('iconv-lite');
var app = express();
var port = process.env.PORT || 8080;
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
var pinyin = require("pinyin");
const log4js = require('log4js');
const log4js_extend = require('log4js-extend');
log4js_extend(log4js, {
    path: __dirname,
    format: '(@file:@line:@column)'
});
log4js.configure(__dirname + '/log4js.json');
const logger = log4js.getLogger('cdc');

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
    logger.info('uncaughtException occurred: ' + (err.stack ? err.stack : err));
});

var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);

let Eng2ChiIntentTag = fs.readFileSync(__dirname + '/intentTag.json', 'utf8');
Eng2ChiIntentTag = JSON.parse(Eng2ChiIntentTag);
let Chi2EngIntentTag = {}
for (let k in Eng2ChiIntentTag) {
    Chi2EngIntentTag[Eng2ChiIntentTag[k]] = k
}
let StopWordTable = ConvertToTable1(fs.readFileSync(__dirname + '/data/廢詞表.csv', 'binary'))
let StopWordsMap = new Map()
StopWordTable.forEach(element => {
    if (!StopWordsMap.has(element[0]))
        StopWordsMap.set(element[0], element[0])
});
let commonWordTable = ConvertToTable1(fs.readFileSync(__dirname + '/data/commonWord.csv', 'binary'))
let commonWordMap = new Map()
commonWordTable.forEach(elements => {
    elements.forEach(element => {
        if (element != "") {
            var roma = pinyin(element, {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格  
            }).join(' ')
            if (!commonWordMap.has(roma))
                commonWordMap.set(roma, elements[0])
        }
    });
});
var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
    apiVersion: '7.x', // use the same version of your Elasticsearch instance
});
// /cdc/cdcdanswer
const CDCAnsweEntity = {
    "intentEng": String,//"introduction",
    "intent": String,//"認識疾病",
    "entities": String,//"天花",
    "answer": String,//"天花為一種由天花病毒(variola virus)所引起之急性傳染病。",
    "question": String,//"什麼是天花?",
    "relativeQuestion": String,//"天花會有什麼症狀?-如何預防天花?-疑似感染天花了怎麼辦?"
}
// /qalog/qalog
const QALogEntity = {
    "entities": [
        {
            "ner": String,//"infectiousDisease",
            "word": String,//"天花"
        }
    ],
    "intent": String,//"introduction",
    "isSuccess": Boolean,//"true",
    "answer": [
        {
            "intentEng": String,//"introduction",
            "intent": String,//"認識疾病",
            "entities": String,//"天花",
            "answer": String,//"天花為一種由天花病毒(variola virus)所引起之急性傳染病。",
            "question": String,//"什麼是天花?",
            "relativeQuestion": String,//"天花會有什麼症狀?-如何預防天花?-疑似感染天花了怎麼辦?"
        }
    ],
    "q": String,//"天花",
    "source": Number,// 0: bert 1: buf 
}

// /qasatisfaction/qasatisfaction
const QASatisfactionEntity = {

    "q": String,//"問題",
    "score": Number,// 0:不滿意  1: 普通  2 : 滿意

}
// /bufquestion/bufquestion 
const QABufQuestion = {
    "intent": String,//body.intent,
    "entities": String, //body.entities,
    "q": String,//"問題",
    "romaQ": String,//"羅馬拼音問題",
    "Ws": String,//"去除STOP段詞",
    "romaWs": String,//"去除STOP段詞ROMA",
    "answer": String,// "答案",
    "createtime": String //"創建時間"
}
const rutrnErrData = {
    qa: "",
    intent: "",
    entities: [{

    }],
    answer: [],
    source: 0,
    isSuccess: false
}

/*
esClient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        logger.info('All is well');
    }
});
*/
let searchBufQuestionQuery = {
    index: 'bufquestion',
    type: 'bufquestion',
    body: {
        size: 3,
        from: 0,
        query: {
            bool: {
                should: [],
                minimum_should_match: "-15%"
            }
        }
    },
    ignore_unavailable: true
}
/*
let searchBufQuestionQuery = {
    index: 'bufquestion',
    type: 'bufquestion',
    body: {
        size: 3,
        from: 0,
        query: {
            match:{  
                romaWs:{  
                   query: "",
                   minimum_should_match: "85%"
                }
             }
        }
    },
    ignore_unavailable: true
}*/
let searchCDCAnswerRelateQ = {
    index: 'cdc',
    type: 'cdcanswer',
    body: {
        size: 3,
        from: 0,
        query: {
            bool: {
                must: [
                    { match_phrase: { entities: "" } }
                ]
            }
        }
    },
    ignore_unavailable: true
}
app.get("/:message", async function (req, res) {
    try {
        var message = req.params.message;
        let romaQ = ""
        let romaWs = ""
        let romaWsArray = []
        let Ws = ""
        message1 = message.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, "")

        var WSBuf = await GetWs(message1)
        var message2 = ""
        //前處理
        WSBuf.forEach(element => {
            let roma = pinyin(element, {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格  
            })
            let thisWsRoma = roma.join("")

            if (commonWordMap.has(thisWsRoma)) {
                message2 += commonWordMap.get(thisWsRoma)
            } else {
                message2 += element
            }
            if (romaQ !== "")
                romaQ += " " + thisWsRoma  
            else
                romaQ += thisWsRoma
            if (!StopWordsMap.has(element)) {
                if (romaWs !== "")
                    romaWs += " " + thisWsRoma
                else
                    romaWs += thisWsRoma
                Ws += element
                romaWsArray.push(thisWsRoma)
            }
        });
        /*
            "romaQ": String,//"羅馬拼音問題",
            "Ws": String,//"去除STOP段詞",
            "romaWs": String,//"去除STOP段詞ROMA",
        */
        //decodeURI
        var Url = encodeURI(config.ModelUrl + message2.toLowerCase())
        if (message != "favicon.ico") {
            //用段詞ROMA 搜尋BUF裡面有沒有相應的句子

            let queryBuf = []
            romaWsArray.forEach(element => {
                queryBuf.push({
                    term: {
                        romaWs: element
                    }
                })
            });
            //searchBufQuestionQuery.body.query.match.romaWs.query = romaWs
            searchBufQuestionQuery.body.query.bool.should = queryBuf
            var answer = await esClient.search(searchBufQuestionQuery);
            console.log("BufQuestion Answer: " + JSON.stringify(answer, null, 2))
            if (answer.hits.hits.length > 0 && answer.hits.hits[0]._source.answer != "") {
                EntityString = ""
                for (var i in answer.hits.hits[0].entities) {
                    if (body.entities.length - 1 == i)
                        EntityString += answer.hits.hits[0].entities[i].word
                    else
                        EntityString += answer.hits.hits[0].entities[i].word + " "
                }
                let bufEntity = answer.hits.hits[0]._source.entities.split('-')
                let bufEntityArray = []
                bufEntity.forEach(element => {
                    bufEntityArray.push({
                        "ner": "",
                        "word": element
                    })
                });
                if (answer.hits.hits.length > 2) {
                    var relativeQuestion = []
                    answer.hits.hits.forEach(element => {
                        relativeQuestion.push(element._source.q)
                    });
                    relativeQuestion = relativeQuestion.join("-")

                    res.send({
                        q: message,
                        intent: answer.hits.hits[0]._source.intent,
                        entities: bufEntityArray,
                        relativeQuestion: relativeQuestion,
                        answer: answer.hits.hits[0]._source.answer,
                        source: 1,
                        isSuccess: true,
                        romaQ: answer.hits.hits[0]._source.romaQ,
                        Ws: answer.hits.hits[0]._source.Ws,
                        romaWs: answer.hits.hits[0]._source.romaWs,
                    })
                }
                else {
                    searchCDCAnswerRelateQ.body.query.bool.must[0].match_phrase.entities = EntityString
                    answerRelateQ = await esClient.search(searchCDCAnswerRelateQ);
                    res.send({
                        q: message,
                        intent: answer.hits.hits[0]._source.intent,
                        entities: bufEntityArray,
                        relativeQuestion: answerRelateQ.hits.hits.length == 0 ? '' : answerRelateQ.hits.hits[0]._source.relativeQuestion,
                        answer: answer.hits.hits[0]._source.answer,
                        source: 1,
                        isSuccess: true,
                        romaQ: answer.hits.hits[0]._source.romaQ,
                        Ws: answer.hits.hits[0]._source.Ws,
                        romaWs: answer.hits.hits[0]._source.romaWs,
                    })
                }
            }
            else {
                request(Url, async function (error, response, body) {
                    console.error('error:', error); // Print the error if one occurred
                    logger.info('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    logger.info('body:', body); // Print the HTML for the Google homepage.
                    if (error != null) {
                        res.send(rutrnErrData)
                    } else {
                        body = JSON.parse(body)
                        logger.info(body.intent)
                        EntityString = ""
                        for (var i in body.entities) {
                            if (body.entities.length - 1 == i)
                                EntityString += body.entities[i].word
                            else
                                EntityString += body.entities[i].word + " "
                        }
                        var answer = await esClient.search({
                            index: 'cdc',
                            type: 'cdcanswer',
                            body: {
                                size: 5,
                                from: 0,
                                query: {
                                    bool: {
                                        must: [
                                            { match_phrase: { entities: EntityString } },
                                            { match_phrase: { intentEng: body.intent } }
                                        ]
                                    }
                                }
                            }
                            ,
                            ignore_unavailable: true
                        });
                        logger.info(JSON.stringify(answer, null, 2))
                        if (answer.hits.hits.length == 0 || answer.hits.hits[0]._source.answer == "")
                            body.needAddBuf = true
                        else
                            body.needAddBuf = false
                        body.answer = answer.hits.hits;
                        body.q = message;
                        body.source = 0;
                        body.isSuccess = true;
                        body.romaQ = romaQ;
                        body.Ws = Ws;
                        body.romaWs = romaWs;
                        res.send(JSON.stringify(body, null, 2))
                    }
                });
            }
        }
    }
    catch (e) {
        logger.debug(e.message)
        res.send(rutrnErrData)
    }

})

app.post('/CDC/QALog', async function (req, res) {
    logger.info("Insert QALog")
    var body = req.body
    body.createtime = Date().toLocaleString()
    if (body.needAddBuf == 'true') {
        logger.info("answer Insert bufQuestion")
        EntityString = ""
        for (var i in body.entities) {
            if (body.entities.length - 1 == i)
                EntityString += body.entities[i].word
            else
                EntityString += body.entities[i].word + " "
        }
        let response = await esClient.index({
            index: 'bufquestion',
            type: 'bufquestion',
            body: {
                q: body.q,
                intent: body.intent,
                entities: EntityString,
                answer: [],
                createtime: body.createtime,
                romaQ: body.romaQ,
                Ws: body.Ws,
                romaWs: body.romaWs,
            }
        });
        logger.info("response : " + JSON.stringify(response, null, 2))
    }
    else if (body.answer.length > 0) {
        body.answer = body.answer[0]._source
    }

    logger.info("Insert QALog Data : " + JSON.stringify(body, null, 2))
    // 對傳遞的資料執行批量索引
    let response = await esClient.index({
        index: 'qalog',
        type: 'qalog',
        body: body
    });
    logger.info("response : " + JSON.stringify(response, null, 2))
    res.send(200)
})
/**
 * 紀錄滿意度
 */
app.post('/CDC/Satisfaction', async function (req, res) {
    logger.info("Insert Satisfaction")
    var body = req.body
    body.createtime = Date().toLocaleString()
    logger.info("Insert Satisfaction Data : " + JSON.stringify(body, null, 2))
    // 對傳遞的資料執行批量索引
    const response = await esClient.index({
        index: 'qasatisfaction',
        type: 'qasatisfaction',
        body: body
    });
    logger.info("response : " + JSON.stringify(response, null, 2))
    res.send(200)
})

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
            logger.info('STATUS: ' + res.statusCode);
            logger.info('HEADERS: ' + JSON.stringify(res.headers));
            res.body = '';

            this.response.setHeader('Content-Length', res.headers['content-length']);
            this.response.setHeader('Content-Type', res.headers['content-type']);

            res.on('data', function (chunk) {
                logger.info('get response data');
                res.body = res.body + chunk;
                this.response.write(chunk);
            }.bind({ response: this.response }));
            res.on('end', function () {
                try {
                    logger.info('response end');
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
app.get("/CDC/InsertCsvData", function (req, res) {
    logger.info('function InsertData')
    var answerCsv = fs.readFileSync('./data/CDC用Answer.csv', 'binary');
    ConvertToTable(answerCsv, async function (DataTable) {
        var saveData = [];
        for (var i = 1; i < DataTable.length; i++) {
            var entityString = "";
            if (DataTable[i].length >= 5)
                entityString = DataTable[i].slice(4).join(' ')
            //await postUserData(DataTable[i][0], DataTable[i][3], entityString, DataTable[i][1], DataTable[i][2], Chi2EngIntentTag[DataTable[i][3]])
            saveData.push({
                index: {
                    _index: 'cdc',
                    _type: 'cdcanswer',
                }
            })
            saveData.push({
                "intentEng": Chi2EngIntentTag[DataTable[i][3]],
                "intent": DataTable[i][3],
                "entities": entityString,
                "answer": DataTable[i][0],
                "question": DataTable[i][1],
                "relativeQuestion": DataTable[i][2]
            })
        }
        // 對傳遞的資料執行批量索引
        esClient.bulk({ body: saveData }, function (err, response) {
            if (err) {
                logger.info("Failed Bulk operation".red, err)
            } else {
                logger.info("Successfully imported %s".green, (saveData.length) / 2);
                logger.info("response: " + JSON.stringify(response, null, 2))
            }

            logger.info('InsertData success')
            res.send(200)
        })
    })
})
app.get("/CDC/getTestScore", function (req, res) {
    logger.info('function getTestScore')
    var answerCsv = fs.readFileSync('./data/測試資料.csv', 'binary');
    ConvertToTable(answerCsv, async function (DataTable) {
        var saveData = "\ufeff";
        for (var i = 0; i < DataTable.length; i++) {
            if (DataTable[i][0].length == 0) continue;
            var data = await GetAnswer(DataTable[i][0])
            if (data.source == 1)
                saveData += `${DataTable[i][0]},${data.answer}\r\n`
            else {
                if (data.answer.length > 0)
                    saveData += `${DataTable[i][0]},${String(data.answer[0]._source.answer)}\r\n`
                else
                    saveData += `${DataTable[i][0]},\r\n`

            }
        }
        fs.writeFileSync("./data/測試資料結果.csv", saveData, "utf-8")
        res.send(200)

    })
})
async function GetAnswer(message) { //ID隨機
    logger.info("function GetWs " + message)
    message = encodeURI(message.replace(/\//g, ''))
    return await new Promise((resolve, reject) => {
        request.get('http://localhost:8080/' + message, function (err, res, body) {
            //console.log(body)
            try {
                body = JSON.parse(body)
            }
            catch (e) {
                logger.debug(message)
            }

            resolve(body);
        })
    });
}
app.get("/CDC/InsertQAData", function (req, res) {
    logger.info('function InsertQAData')
    var answerCsv = fs.readFileSync('./data/QA句子新增.csv', 'binary');
    var createtime = Date().toLocaleString()
    ConvertToTable(answerCsv, async function (DataTable) {
        var saveData = [];
        for (var i = 0; i < DataTable.length; i++) {
            if (DataTable[i][0] == "")
                break;
            var entityString = DataTable[i][2].split('-').join(' ')

            let romaQ = ""
            let romaWs = ""
            let Ws = ""
            message1 = DataTable[i][0].replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, "")
            var WSBuf = await GetWs(message1)
            //前處理
            WSBuf.forEach(element => {
                let roma = pinyin(element, {
                    style: pinyin.STYLE_NORMAL, // 设置拼音风格  
                })
                let thisWsRoma = roma.join("")
                if (romaQ !== "")
                    romaQ += " " + thisWsRoma
                else
                    romaQ += thisWsRoma
                if (!StopWordsMap.has(element)) {
                    if (romaWs !== "")
                        romaWs += " " + thisWsRoma
                    else
                        romaWs += thisWsRoma
                    Ws += element
                }
            });
            //await postUserData(DataTable[i][0], DataTable[i][3], entityString, DataTable[i][1], DataTable[i][2], Chi2EngIntentTag[DataTable[i][3]])
            saveData.push({
                index: {
                    _index: 'bufquestion',
                    _type: 'bufquestion',
                }
            })
            saveData.push({
                q: DataTable[i][0],
                intent: "",
                entities: entityString,
                answer: DataTable[i][1],
                createtime: createtime,
                romaQ: romaQ,
                Ws: Ws,
                romaWs: romaWs,
            })
        }
        // 對傳遞的資料執行批量索引
        esClient.bulk({ body: saveData }, function (err, response) {
            if (err) {
                logger.info("Failed Bulk operation".red, err)
            } else {
                logger.info("Successfully imported %s".green, (saveData.length) / 2);
                logger.info("response: " + JSON.stringify(response, null, 2))
            }

            logger.info('InsertData success')
            res.send(200)
        })
    })
})
/*
async function postUserData(answer, intent, entities, question, relativeQuestion, intentEng) { //ID隨機
    logger.info("function postUserData")
    return new Promise((resolve, reject) => {
        var contents = JSON.stringify({
            "intentEng": intentEng,
            "intent": intent,
            "entities": entities,
            "answer": answer,
            "question": question,
            "relativeQuestion": relativeQuestion
        });
        var options = {
            host: '127.0.0.1',
            path: '/cdc/' + String(intentEng).toLowerCase(),
            port: 9200,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': contents.length
            }
        }
        var https = require('https');
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                logger.info("data:", data); //一段html代码
                resolve([true, data]);
            });
        });
        req.write(contents);
        req.end;
    });
}
*/
async function GetWs(message) { //ID隨機
    logger.info("function GetWs " + message)
    message = encodeURI(message.replace(/\//g, ''))
    return await new Promise((resolve, reject) => {
        request.get('http://localhost:5001/GetWS/' + message, function (err, res, body) {
            //console.log(body)
            try {
                body = JSON.parse(body)
            }
            catch (e) {
                logger.debug(message)
            }

            resolve(body.wsAnswer);
        })
    });
}
function ConvertToTable1(data) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    var buf = new Buffer(data, 'binary');
    var str = iconv.decode(buf, 'utf-8');
    rows = str.split("\r\n");
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    return table;
}
function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    var buf = new Buffer(data, 'binary');
    var str = iconv.decode(buf, 'utf-8');
    rows = str.split("\r\n");
    for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
    }
    callBack(table);
}
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
    logger.info("Get LINE Message");
    var results = request.body.events;
    logger.info(JSON.stringify(results));
    logger.info('receive message count: ' + results.length);
    for (var idx = 0; idx < results.length; idx++) {

        switch (results[idx].message.type) {
            case "text":
                var userText = results[idx].message.text;
                logger.info("userStage: " + userStage.get(results[idx].source.userId))
                logger.info("userData: " + userData.get(results[idx].source.userId))
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
                            if (!result) logger.info(result);
                            else logger.info(result);
                        })
                    }
                }
                break;
            default:
                if (userStage.get(results[idx].source.userId) == "預約") {
                    linemessage.SendMessage(results[idx].source.userId, "你還沒完成預約流程喔", 'linehack2018', results[idx].source.replyToken, function (result) {
                        if (!result) logger.info(result);
                        else logger.info(result);
                    })
                } else if (userStage.get(results[idx].source.userId) == null) {
                    linemessage.SendMessage(results[idx].source.userId, "看不懂喔", 'linehack2018', results[idx].source.replyToken, function (result) {
                        if (!result) logger.info(result);
                        else logger.info(result);
                    })
                }
                break;
        }
    }
});
//
function ResProcessCheck(userId, userText, callback) {
    logger.info("into ResProcessCheck")
    var find = false;
    var ResProcess;
    if (userData.get(userId) == null) {
        logger.info("ResProcessCheck userData null")
        ResProcess = {
            object: null,
            date: null, //日期
            time: null, //時段 0,1,2
            doctorName: null
        };
    } else {
        logger.info("ResProcessCheck userData hasValue")
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
    logger.info("after check: " + JSON.stringify(ResProcess))
    userData.set(userId, ResProcess)
    callback();
}

function resProcessMessage(userId, replyToken) {
    logger.info("into resProcess")
    var text = "";
    var ResProcess = userData.get(userId);
    logger.info("resProcess " + JSON.stringify(ResProcess))
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
        if (!result) logger.info(result);
        else logger.info(result);
    })
}


//APP
app.get("/api", function (req, res) {
    res.send("API is running");
});
*/
