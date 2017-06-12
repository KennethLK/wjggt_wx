var authCode = request.params.acode;
var gname = request.params.gname;
var userId = request.params.uid;


console.log("save group: " + gname + "; user: " + userId);

if (typeof userId === undefined)
{
	response.error('userId invalid')
	return;
}

if (typeof authCode === undefined)
{
	response.error('authCode invalid')
	return;
}

if (typeof gname === undefined)
{
	response.error('gname invalid')
	return;
}

var user = AV.Object.createWithoutData('WJUser', userId);
user.fetch(function(user){
	var Group = AV.Object.extend('WJGroup');
	var group = new Group();
	group.name = gname;
	group.authCode = authCode;
	return group.save();
}).then(function(group){
	user.set('group', group);
	return user.save();
}).then(function(user){
	response.success(user);
}).catch(function(error){
	console.log("save group error: " + error.message);
	response.error(error);
});