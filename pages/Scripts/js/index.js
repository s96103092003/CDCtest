window.fbAsyncInit = function () {
    FB.init({
        appId: appId,
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v9.0' // Use this Graph API version for this call.
    });
    //記錄用戶行為資料 可在後台查看用戶資訊
    FB.AppEvents.logPageView();
};
//嵌入臉書sdk
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(function () {
    //點擊登入按鈕
    $("#login").click(function () {
        //檢查臉書登入狀態
        //FB.getLoginStatus(function (response) {
        FB.login(function (response) {
            //如果已經有授權過應用程式
            console.log("getLoginStatus : " + JSON.stringify(response, null, 2))
            if (response.authResponse) {
                $.post("./GetAccount", {
                    userID: response.authResponse.userID,
                    accessToken: response.authResponse.accessToken
                }, function (data, status) {
                    console.log("GetAccount : " + JSON.stringify(data, null, 2))

                })
                //呼叫FB.api()取得使用者資料
                /*FB.api('/me', {
                      fields: 'id,name,email'
                    }, function (response) {
                      //這邊就可以判斷取得資料跟網站使用者資料是否一致
                      console.log()
                    });*/
                //沒授權過應用程式
            } else {}
        }, {
            //scope: 'email,user_likes'
            scope: "pages_messaging,leads_retrieval,pages_manage_ads,pages_manage_metadata,pages_read_engagement,pages_read_user_content,pages_show_list,public_profile,pages_messaging,pages_manage_posts,pages_manage_engagement"
        });
    });
});