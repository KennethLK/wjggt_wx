var encData = request.params.encData;
var sessionCode = request.params.skey;
var ivCode = request.params.iv;
var openId = request.params.openId;
/*

*/
console.log("decrypt" + encData + ";openId: " + openId + ";skey: " + sessionCode + ";iv: " + ivCode);

var crypto = require('crypto');
var encryptedData = new Buffer(encData, 'base64');
var iv = new Buffer(ivCode, 'base64');
var sessionKey = new Buffer(sessionCode, 'base64');
 // 解密
var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
// 设置自动 padding 为 true，删除填充补位
decipher.setAutoPadding(true);
var decoded = decipher.update(encryptedData, 'binary', 'utf8');
decoded += decipher.final('utf8');
console.log(decoded);
decoded = JSON.parse(decoded);

if (decoded.watermark.appid !== 'wx21acd9361f28a53a') {
    console.log("数据签名无效");
    response.error('illegal buffer appid');
}

var q = new AV.Query('WJUser');
q.equalTo('openId', openId);
q.first().then(function(quser){
    if (typeof quser === 'undefined')
    {
        try {
    
            var q = new AV.Query('WJUser');
            q.equalTo('openId', decoded.openId);
            q.first().then(function(user){
                if (typeof user === 'undefined'){
                    console.log("saveUser 保存新用户");
                    //保存新用户
                    AV.Cloud.run('saveNewUser', decoded).then(function(user){
                        response.success(user);
                    }, function(err){
                        console.log("saveNewUser: " + err.message);
                        response.error('save err ' + err.message);
                    });
                }
                else
                {
                    console.log("saveUser 更新用户资料 url:" + decoded.avatarUrl+";name:"+decoded.nickName);
                    //更新用户资料, 头像和昵称
                    user.set('nickName', decoded.nickName);
                    user.set('avatarUrl', decoded.avatarUrl);
                    user.set('city', decoded.city);
                    user.set('province', decoded.province);
                    user.set('gender', decoded.gender);
                    user.set('language', decoded.language);
                    user.save().then(function(user){
                        console.log("saveUser 更新用户资料完成");
                        response.success(user);
                    }, function (err){
                        console.log("save err: " + err.message);
                        response.error("user update " + err.message);
                    });
                }
            }, function(err){
                console.log("save err: " + err.message);
                response.error('save err ' + err.message);
            });
        } catch (err) {
            console.log("illegal buffer: " + err.message);
            response.error('illegal buffer' + err.message);
        }
    }
    else
    {
        console.log("user found: " + quser.get('openId'));
        //更新用户资料, 头像和昵称
        quser.set('nickName', decoded.nickName);
        quser.set('avatarUrl', decoded.avatarUrl);
        quser.set('city', decoded.city);
        quser.set('province', decoded.province);
        quser.set('gender', decoded.gender);
        quser.set('language', decoded.language);
        quser.save().then(function(quser){
            console.log("saveUser 更新用户资料完成");
            response.success(quser);
        }, function (err){
            response.error("user update " + err);
        });
    }
}, function (error) {
    console.log("unhandled exception: " + error.message);
    response.error('unhandled exception');
});


