//saveConsume.js

//测试数据
var test = {
	"name": "黄焖鸡", 
	"amount": 67, 
	"consumers": ["5924eb2ea22b9d0058a208dc", "592500eca0bb9f005f7d7cb5","592501152f301e006b3692e6"],
	"date": 1496326643225,
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
var time = parseInt(consumeDateStr);

console.log("consumers: " + consumers.length +";time:" + consumeDateStr + ";recorder:" + recorderId);

if (isNaN(amount))
{
	response.error("cash invalid");
	return;
}

var group = AV.Object.createWithoutData('WJGroup', groupId);
var recorder = AV.Object.createWithoutData('WJUser', recorderId);

var consumeDate = new Date();
if (!isNaN(time))
{
	consumeDate.setTime(time);
}

var juser = AV.Object.createWithoutData('WJUser', "5938ed085c497d006b6104c4"); //记录脚帐账号
var remainder = 0;
juser.fetch().then(function(){
	remainder = juser.get("cash");
	amount = remainder + amount; //把上次剩下的脚帐，计入本次
	return AV.Cloud.run('saveNewRestaurant', {"resId": resId, "name": rname});
}).then(function(res){
	var WJConsume = AV.Object.extend('WJConsume');
	var cons = new WJConsume();
	cons.set('group', group);
	cons.set('name', rname);
	cons.set('consumeDate', consumeDate);
	cons.set('amount', amount);
	cons.set('peopleAmount', consumers.length);
	cons.set('restaurant', res);
	cons.set('recorder', recorder);
	return cons.save();
}).then(function(consume){
	//完成, 记录明细
	var mTime = consumeDate.getTime();
	var consId = consume.id;
	console.log("save consume success mTime: " + mTime + "; Id: " + consId);
	var param = {"consumers":consumers, 
		"consumeId": consId, 
		"amount": amount, 
		"recorderId": recorderId,
		"time": mTime};
	return AV.Cloud.run('saveConsumeDetail', param);
}).then(function(){
	if (remainder > 0)
	{
		juser.set('cash', 0);
		return juser.save();
	}
	else{
		return 1;
	}
}).then(function(){
	response.success();
}).catch(function(error){
	response.error('save consume failed; ' + error.message)
});