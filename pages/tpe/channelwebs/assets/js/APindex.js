var click_times = 0;
window.addEventListener("load", function (e) {
    //console.log(getParameterName('code'));
    /////////////////////////////////////////////////////////

    $(document).ready(function () {
        document.addEventListener('touchstart', function (e) { e.stopPropagation(); }, false);
        var abtns = document.getElementsByClassName('areaBtn');
        if (mid == 'undefined') {
            alert('not validate member');
        }
        else {
            for (var i = 0; i < 12; i++) {
                abtns[i].setAttribute('data-mid', mid);
            }
            var closeBtn = document.querySelector('.modal__close');
            closeBtn.setAttribute('onclick', 'closeAirRst()');
        }
    });
    /*  document.addEventListener('deviceready', function (e) {
      document.addEventListener('touchstart', function (e) { e.stopPropagation(); }, false);
         console.log(e);
         console.log("mid: " + mid);
         var abtns = document.getElementsByClassName('areaBtn');
         if (mid == 'undefined') {
             alert('not validate member');
         }
         else {
             for (var i = 0; i < 12; i++) {
                 abtns[i].setAttribute('data-mid', mid);
             }
             var closeBtn = document.querySelector('.modal__close');
             closeBtn.setAttribute('onclick', 'closeAirRst()');
         }
         
         LCS.Interface.getProfile(function (data) {
             var mid = data.id;
             var options = {
                 pageKey: "APindex",
                 entryPage: true,
                 titleBar: {
                     left: {
                         imgId: "btn_default",
                         text: "",
                         visible: false,
                         enable: false,
                     },
                     center: {
                         text: "空氣盒子資訊服務",
                         clickable: false
                     },
                 }
             };
             LCS.Interface.updateTitleBar(options);
             LCS.Interface.registerTitleBarCallback(function (evt) {
                 switch (evt.target) {
                     case "LBUTTON":
                         location.href = 'index.php';
                         break;
                     case "RBUTTON":
                         // do nothing
                         break;
                     case "BACK":
                         location.href = 'index
                         // do nothing.php';
                         break;
                     case "TITLE":
                         break;
                 }
             });
             var abtns = document.getElementsByClassName('areaBtn');
             for (var i = 0; i < 12; i++) {
                 abtns[i].setAttribute('data-mid', mid);
             }
             var closeBtn = document.querySelector('.modal__close');
             closeBtn.setAttribute('onclick', 'closeAirRst()');
         }, function () {
             alert('not validate member');
         });
   }, false);*/
});

function showAirboxInfo(sel) {//OK
    click_times++;
    var airinfo = document.getElementById('air__info'),
        modal = document.getElementById('air__modal');
    var payload = {
        'datasetId': 'airbox',
        'authToken': AUTH_TOKEN,
        'areaCode': sel.value,
        'st': new Date().getTime()
    };
    //var api = API_HOST + SRU + '/listDatasetInfoToShow/';
    var api = SRU + '/listDatasetInfoToShow/';
    $.ajax({
        url: api,
        data: payload,
        method: 'GET',
        dataType: 'json',
        async: true
    }).done(function (data) {
        console.log(data);
        if (data['result'] === false) {
            airinfo.innerHTML = '';
            alert('此區域尚無資料可見!');
            return;
        } else {
            var jsonData = JSON.parse(data['data']);
            var dist = JSON.parse(jsonData[0]['info_to_show']);
            airinfo.innerHTML = '<p style="line-height:0.5;">【' + sel.innerHTML + '】</p>';
            if (typeof dist['result'][0] === 'undefined') {
                airinfo.innerHTML += '<span style="font-size:20px;margin-bottom:10px;display:block;">本區域尚無資料</span>';
            } else {
                airinfo.innerHTML += '<span style="font-size:20px;margin-bottom:10px;display:block;">各監測點空氣盒子如下:</span>';
                var le = document.createElement('br');
                for (var i in dist['result']) {
                    var infoPerLine = document.createElement('span');
                    infoPerLine.style.display = 'block';
                    if (typeof dist['result'][i]['pm25'] !== 'undefined') {
                        var infoText = dist['result'][i]['deviceName'] +
                            ' PM2.5濃度 : <span class="pm25desc" style="color:' +
                            pm25Color(dist['result'][i]['pm25']) + '">' +
                            dist['result'][i]['pm25'] + '</span>';
                        infoPerLine.innerHTML = infoText;
                        airinfo.appendChild(infoPerLine);
                    }
                }
                var toappend = {
                    '查看活動建議請點我': '../air_pollutioninfo/active_suggestion',
                    '查看地圖資訊請點我': '../air_pollutioninfo/air_map?page=apm&ptc=' + sel.dataset.postcode,
                };
                for (var j in toappend) {
                    var iaa = document.createElement('a');
                    iaa.href = toappend[j];
                    iaa.style.fontSize = '22px';
                    iaa.innerHTML = '<br>' + j + '<br>';
                    airinfo.appendChild(iaa);
                }
            }
            checkIsSubscribed(sel, airinfo);
            // deal with modal
            var w = (window.innerWidth > 0) ? window.innerWidth : screen.width,
                h = (window.innerHeight > 0) ? window.innerHeight : screen.height;
            modal.style.display = 'block';
            modal.style.width = w - 50 + 'px';
            modal.style.height = h - 20 + 'px';
            return;
        }
    }).fail(function (jqXhr, text, et) { });
}

function checkIsSubscribed(sel, airinfoblock) {//OK
    var api = SRU + '/listSubscriptionContainer/';
    $.ajax({
        url: api,
        data: {
            'memberId': sel.dataset.mid,
            'datasetId': 'airbox',
            'authToken': AUTH_TOKEN,
            'st': new Date().getTime(),
        },
        method: 'GET',
        dataType: 'json',
        async: true
    }).done(function (data) {
        if (click_times == 1) {
            console.log("listSubscriptionContainer :" + JSON.stringify(data));
            var editbtn = document.createElement('button'),
                cancelbtn = document.createElement('button');
            editbtn.innerHTML = '訂閱/修改' + sel.innerHTML + '空氣盒子資訊';
            editbtn.className = 'sbtn--want';
            editbtn.setAttribute('data-mid', sel.dataset.mid);
            editbtn.setAttribute('data-postcode', sel.dataset.postcode);
            editbtn.value = sel.value;
            if (data['result'] === false) {
                editbtn.setAttribute('onclick', 'gotoSetupPage(this)');
                airinfoblock.appendChild(editbtn);
            } else {
                var jsonData = JSON.parse(data['data']);
                if (jsonData[0]['detail'].indexOf(sel.value) > -1) {
                    editbtn.setAttribute('onclick', 'gotoSetupPage(this, \'updateAirboxSubArea\')');
                    airinfoblock.appendChild(editbtn);
                    airinfoblock.appendChild(document.createElement('br'));
                    cancelbtn.innerHTML = '取消訂閱' + sel.innerHTML + '空氣盒子資訊';
                    cancelbtn.value = sel.value;
                    cancelbtn.className = 'sbtn--cancel';
                    cancelbtn.setAttribute('data-mid', sel.dataset.mid);
                    cancelbtn.setAttribute('data-postcode', sel.dataset.postcode);
                    cancelbtn.setAttribute('onclick', 'cancelAirboxSubArea(this)');
                    airinfoblock.appendChild(cancelbtn);
                } else {
                    editbtn.setAttribute('onclick', 'gotoSetupPage(this, \'addAirboxSubArea\')');
                    airinfoblock.appendChild(editbtn);
                }
            }
        }
        else {
            click_times = 1;
        }
    }).fail(function (jqXhr, text, et) { });
    var cancelbtn = document.createElement('button');
}

function cancelAirboxSubArea(sel) {
    var desc = document.getElementById('subc__desc');

    var detailData = {
        area: sel.value.toString(),
    };
    detailData = JSON.stringify(detailData);
    var payload = {
        'authToken': AUTH_TOKEN,
        'memberId': sel.dataset.mid,
        'datasetId': 'airbox',
        'subscribeDetail': detailData,
        'todo': 'cancelAirboxSubArea'
    };
    //var api = API_HOST + SRU + '/updateSubscriptionContainer/';
    var api = SRU + '/updateSubscriptionContainer/'
    $.ajax({
        url: api,
        data: payload,
        dataType: 'json',
        method: 'PUT',
        async: false
    }).done(function (data) {
        console.log(JSON.stringify(data));
        if (data['result'] === false) {
            alert('您已訂閱過本服務');
            return;
        }
        desc.innerHTML = '<span class="subc__support">已為您取消 【' + getGeocodeName(TAIWAN_POSTWITHGEO_CODE_TPE[sel.dataset.postcode]) + '】 ' + SUBSCRIBE_TYPE['airbox'] + '推播服務!</span>';
        document.getElementById('content').innerHTML = '<button class="sbtn--want" onclick="location.href=\'/login/airbox\'">繼續訂閱其他服務</button>';
        document.getElementById('air__modal').style.display = 'none';
    }).fail(function (jqXhr, text, et) { });
}

function closeAirRst() {
    var modal = document.getElementById('air__modal');
    click_times = 0;
    modal.style.display = 'none';
}
/*
function getParameterName(skey) {
    var s = location.search.replace(/^\?/, '');
    if (s == '' || skey == null || skey == '') return unescape(s);
    var re = new RegExp('(&|^)' + skey + '=([^&]*)(&|$)');
    var a = re.exec(s);
    return unescape(a ? a[2] : '');
}

*/