var code = request.params.code;
var encData = request.params.encData;
var iv = request.params.iv;

console.log("decrypt" + encData + "; code: " + code + ";iv:" + iv);

var jsReqUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=wx21acd9361f28a53a&secret=027b4fc593c0e9502fc5c782b27f9b02&js_code=" + code + "&grant_type=authorization_code";

var request = require('request');

request(jsReqUrl,
    function (error, resp, body)
    {
        if (resp && resp.statusCode == 200)
        {
            var respTxt = resp.body;
            console.log("resp: " + respTxt);
            var respObj = JSON.parse(respTxt);
            var errCode = respObj.errcode;
            console.log("get error code: " + errCode);
            sessionCode = respObj.session_key;
            console.log("get session code: " + sessionCode);

            if (!sessionCode)
            {
                console.log("信息读取错误");
                response.error("信息读取错误: error: " + errCode);
                return;
            }

            console.log("sessionCode is valid");
            var openId = respObj.openid;
            console.log("get openId:" + openId);
            
            AV.Cloud.run('decrypt', {
                "skey": sessionCode, 
                "openId": openId, 
                "iv": iv, 
                "encData": encData})
            .then(function(quser){
                if (typeof quser === 'undefined')
                {
                    response.error("error data format");
                }
                else
                {
                    response.success(quser);
                }
            }, function(err){
                console.log("exe error:" + err.message);
                response.error("获取信息出错");
            });
        }
        else
        {
            console.error('code error ' + error);
            response.error('code error ' + error);
            return;
        }
    }
    );