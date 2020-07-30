
var fb_message = function () {
    // 傳送訊息給 FB 使用者
    this.SendFBMessage = function (sender_psid, received_message, access_token, sendMessage) {
        let response;
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "text": `You sent the message: "${received_message.text}".`,
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    this.SendFBMessage_image = function (sender_psid, received_message, access_token, url) {
        let response;
        url = url || "https://cdctest.herokuapp.com/image/1.jpg"
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "attachment": {
                    type: "image",
                    payload: {
                        url: url,
                        is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                    }
                },
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    this.SendFBMessage_video = function (sender_psid, received_message, access_token, url) {
        let response;
        url = url || "https://cdctest.herokuapp.com/video/1.mp4"
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "attachment": {
                    type: "video",
                    payload: {
                        url: url,
                        is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                    }
                },
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }

    this.SendFBMessage_audio = function (sender_psid, received_message, access_token, url) {
        let response;
        url = url || "https://cdctest.herokuapp.com/audio/1.mp3"
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "attachment": {
                    type: "audio",
                    payload: {
                        url: url,
                        is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                    }
                },
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    
    this.SendFBMessage_file = function (sender_psid, received_message, access_token, url) {
        let response;
        url = url || "https://cdctest.herokuapp.com/file/1.txt"
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "attachment": {
                    type: "file",
                    payload: {
                        url: url,
                        is_reusable: false // 感覺不到差異Optional. Set to true to make the saved asset sendable to other message recipients. Defaults to false.
                    }
                },
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    
    this.SendFBMessage_template = function (sender_psid, received_message, access_token) {
        let response;
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Welcome!",
                            "image_url": "https://cdctest.herokuapp.com/image/1.jpg",
                            "subtitle": "We have the right hat for everyone.",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://cdctest.herokuapp.com/image/1.jpg",
                                "webview_height_ratio": "tall",
                            },
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://cdctest.herokuapp.com/image/1.jpg",
                                "title": "View Website"
                            }, {
                                "type": "postback",
                                "title": "Start Chatting",
                                "payload": "DEVELOPER_DEFINED_PAYLOAD"
                            }]
                        }]
                    }
                }
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    
    this.SendFBMessage_quick = function(sender_psid, received_message, access_token) {
        let response;
        // 判斷訊息是否包含文字
        if (received_message.text) {
            // 回傳的文字訊息
            response = {
                "text": `You sent the message: "${received_message.text}".`,
                "quick_replies": [{
                    "content_type": "text",
                    "title": "文字訊息",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/red.png"
                }, {
                    "content_type": "text",
                    "title": "image",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/green.png"
                }, {
                    "content_type": "text",
                    "title": "template",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/green.png"
                }, {
                    "content_type": "text",
                    "title": "video",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/green.png"
                }, {
                    "content_type": "text",
                    "title": "audio",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/green.png"
                }, {
                    "content_type": "text",
                    "title": "file",
                    "payload": "<POSTBACK_PAYLOAD>",
                    //"image_url":"http://example.com/img/green.png"
                }]
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }
    
    this.SendFBPostback = function (sender_psid, received_postback, access_token) {
        let response;
        // 取得發送者回覆內容
        let payload = received_postback.payload;
        // 判斷回覆的內容，對應機器人回應的訊息
        /*
        {
            sender: { id: '2892523437540225' },
            recipient: { id: '108984370859831' },
            timestamp: 1593762012184,
            postback: { title: 'Start Chatting', payload: 'DEVELOPER_DEFINED_PAYLOAD' }
        }
        */
        response = {
            "text": "收到postback : " + payload
        }
        if (payload === 'yes') {
            response = {
                "text": "Thanks!"
            }
        } else if (payload === 'no') {
            response = {
                "text": "Oops, try sending another image."
            }
        }
        // 機器人發送回應
        callSendAPI(sender_psid, response, access_token);
    }

    function callSendAPI(sender_psid, response, access_token) {
        let request_body = {
            "recipient": { //發送的ID
                "id": sender_psid
            },
            "message": response, //訊息格式
        }
        request({
            "uri": "https://graph.facebook.com/v7.0/me/messages",
            "qs": {
                "access_token": access_token
            },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
    
                console.log('---> message sent!')
                console.log(JSON.stringify(request_body, null, 2))
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    }
    
}
/*
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
*/
exports.fb_message = fb_message;