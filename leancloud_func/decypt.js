var encData = request.params.encData;
var sessionCode = request.params.skey;
var ivCode = request.params.iv;
var openId = request.params.openId;

console.log("decrypt" + encData + ";openId: " + openId + ";skey: " + sessionCode + ";iv: " + ivCode);

var q = new AV.Query('WJUser');
q.equalTo('openId', openId);
q.first().then(function(quser){
    if (typeof quser === 'undefined')
    {
        var crypto = require('crypto');
        var encryptedData = new Buffer(encData, 'base64');
        var iv = new Buffer(ivCode, 'base64');
        var sessionKey = new Buffer(sessionCode, 'base64');
    
        try {
             // 解密
            var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            var decoded = decipher.update(encryptedData, 'binary', 'utf8');
            decoded += decipher.final('utf8');
            console.log(decoded);
            decoded = JSON.parse(decoded);
            
            if (decoded.watermark.appid !== 'wx21acd9361f28a53a') {
                response.error('illegal buffer appid');
            }
    
            var q = new AV.Query('WJUser');
            q.equalTo('openId', decoded.openId);
            q.first().then(function(user){
                if (typeof user === 'undefined'){
                    //保存新用户
                    AV.Cloud.run('saveNewUser', decoded).then(function(user){
                        response.success(user);
                    }, function(err){
                        response.error('save err ' + err.message);
                    });
                }
                else
                {
                    //更新用户资料, 头像和昵称
                    user.set('nickName', decoded.nickName);
                    user.set('avatarUrl', decoded.avatarUrl);
                    user.set('city', decoded.city);
                    user.set('province', decoded.province);
                    user.set('gender', decoded.gender);
                    user.set('language', decoded.language);
                    user.save().then(function(user){
                        response.success(user);
                    }, function (err){
                        response.error("user update " + err);
                    });
                }
            }, function(err){
                response.error('save err ' + err.message);
            });
        } catch (err) {
            response.error('illegal buffer' + err);
        }
    }
    else
    {
        console.log("user found: " + quser.get('openId'));
        response.success(quser);
    }
}, function (error)
{
    response.error('unhandled exception');
});


