var authCode = request.params.acode;
var userId = request.params.uid;

/*

{"uid": "593d5487da2f600067248fe2", "acode": "50071"}

*/

console.log("join code: " + authCode + "; user: " + userId);

if (userId === undefined)
{
	response.error('userId invalid')
	return;
}

if (authCode === undefined)
{
	response.error('authCode invalid')
	return;
}

var q = new AV.Query('WJGroup');
q.equalTo('authCode', authCode);
q.first(function (wjgroup){
	if (wjgroup === undefined){
		console.log("group not found");
		response.error('group not found');
		return;
	}
	console.log("group found: " + wjgroup.id);
	var q = new AV.Query('WJUser');
	q.get(userId).then(function(tuser){
		tuser.set('group', wjgroup);
		tuser.save().then(function(user){
			console.log("saved");
			response.success(wjgroup.id);
		}, function (error){
			console.log('save error' + error.message);
			response.error("save error");
		})
	}).catch(function(error){
		console.log('find user error' + error.message);
		response.error("user not found");
	});
}, function(error){
	console.log("find group error: " + error.message);
	response.error("group not found");
});
