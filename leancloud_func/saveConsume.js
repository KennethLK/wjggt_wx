//saveConsume.js

//测试数据
var test = {
	"name": "燃面", 
	"amount": 58, 
	"consumers": ["5924eb2ea22b9d0058a208dc", "592500eca0bb9f005f7d7cb5","592501152f301e006b3692e6"],
	"consumeDateStr": 1496324843225,
	"groupId": "592ff945fe88c2006192a118",
	"recorderId": "592456f28d6d810058fad1c2"
}

var rname = request.params.name; //字符串
var cashStr = request.params.amount; //数字
var resId = request.params.resId; //字符串
var consumers = request.params.consumers; //数组
var consumeDateStr = request.params.date; //日期  1970的毫秒数
var groupId = request.params.groupId; //字符串
var recorderId = request.params.recorderId; //字符串

var amount = parseInt(cashStr);

if (isNaN(amount))
{
	response.error("cash invalid");
	return;
}

var group = AV.Object.createWithoutData('WJGroup', groupId);
var recorder = AV.Object.createWithoutData('WJUser', recorderId);

if (consumers.length < 2)
{
	response.error('人数太少了');
	return;
}

AV.Cloud.run('saveNewRestaurant', {"resId": resId, "name": rname})
.then(function(res){
	var consumeDate = Date.parse(consumeDateStr);
	if (isNaN(consumeDate))
		consumeDate = new Date();

	var WJConsume = AV.Object.extend('WJConsume');
	var cons = new WJConsume();
	cons.set('group', group);
	cons.set('name', rname);
	cons.set('consumeDate', consumeDate);
	cons.set('amount', amount);
	cons.set('peopleAmount', consumers.length);
	cons.set('restaurant', res);
	cons.set('recorder', recorder);
	cons.save().then(function(cons){
		//完成, 记录明细
		var param = {"consumers":consumers, 
			"consumeId": cons.objectId, 
			"amount": amount, 
			"recorderId": recorderId,
			"time": consumeDate.getTime()};

		AV.Cloud.run('saveConsumeDetail', param).then(
			function(result){
				response.success();
			}, function(error){
				response.error('save consume failed: save detail: ' + error.message);
			})
	},function(error){
		response.error('save consume failed: '+ error.message);
	});
}, function(error){
	response.error('save consume failed; restaurant not found ' + error.message)
})