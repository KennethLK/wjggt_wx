var decoded = request.params;

console.log("nickName: " + decoded.nickName);
console.log("province: " + decoded.province);

var WJUser = AV.Object.extend('WJUser');
        
var user = new WJUser();
user.set('country', decoded.country);
user.set('city', decoded.city);
user.set('province', decoded.province);
user.set('saving', 0);
user.set('spend', 0);
user.set('avatarUrl', decoded.avatarUrl);
user.set('nickName', decoded.nickName);
user.set('gender', decoded.gender);
user.set('language', decoded.language);
user.set('cash', 0);
user.set('openId', decoded.openId);

user.save().then(function(user){
    response.success(user);
}, function(err){
	console.log("save new user error: " + err.message);
    response.error('save err: ' + err);
});