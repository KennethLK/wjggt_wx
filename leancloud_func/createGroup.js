var authCode = request.params.acode;
var gname = request.params.gname;
var userId = request.params.uid;

/*
{"acode": "87020", "gname": "街边小店", "uid": "593ecbc1ac502e006b5292dc"}
*/

console.log("save group: " + gname + "; user: " + userId + ";code: " + authCode);

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

if (gname === undefined)
{
	response.error('gname invalid')
	return;
}

var groupdId;
var user = AV.Object.createWithoutData('WJUser', userId);
var q_groupCode = new AV.Query('GroupCodes');
q_groupCode.equalTo('code', authCode);
q_groupCode.equalTo('canUse', true);
q_groupCode.find().then(function(gcodes){
	if (gcodes.length > 0){
		console.log('code found');
		gcodes[0].set('canUse', false);
		return gcodes[0].save();
	}
	else{
		console.log("小队编码无效");
		// throw new Error("小队编码无效");
		return;
	}
}).then(function(gcode){
	if (gcode === undefined){
		return;
	}
	console.log('code is set as used');
	return user.fetch();
}).then(function(user){
	if (user === undefined){
		console.log("user not found; " + userId);
		response.error("user not found");
		return;
	}

	var Group = AV.Object.extend('WJGroup');
	var group = new Group();
	group.set("name", gname);
	group.set("authCode", authCode);
	group.save().then(function(group){
		console.log("创建小组成功");
		var relation = user.relation('group');
		group.relation(user.relation.bind(group));
		// user.set('group', group);
		// user.save().then(function(user){
		// 	console.log("加入新建小组成功");
		// 	response.success(group.id);
		// }).catch(function(error){
		// 	console.log("加入新建小组失败");
		// 	response.error("加入新建小组失败");
		// });
	}).catch(function(error){
		console.log("创建小组失败" + error.message);
		response.error("创建小组失败");
	});
}).catch(function(error){
	console.log("save group error: " + error.message);
	response.error(error);
});