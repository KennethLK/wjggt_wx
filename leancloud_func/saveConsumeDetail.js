//saveConsumeDetail.js

{
	"consumers": ["5924eb2ea22b9d0058a208dc", "592500eca0bb9f005f7d7cb5","592501152f301e006b3692e6"],
	"consumeId": "59301daa0ce4630057ebb381",
	"amount": 100,
	"recorderId": "592456f28d6d810058fad1c2",
	"time": 1496324843225
}

	var consumers = request.params.consumers; //消费人列表, 数组
	var consumeId = request.params.consumeId; //消费id, 字符串
	var amount = request.params.amount; //人均后的钱钱, 数字
	var recorderId = request.params.recorderId; //录入人
	var time = request.params.time; //1970的毫秒数, 数字

	var allCash = [];
	var date = new Date();
	date.setTime(time);
	console.log("date:" + date);
	var recorder = AV.Object.createWithoutData('WJUser', recorderId);
	console.log("recorderId:" + recorderId);
	var consume = AV.Object.createWithoutData('WJConsume',consumeId);
	console.log("consumeId:" + consumeId);

	var qs = new AV.Query('WJUser');
	qs.equalTo('objectId', "123");
	for (var i = consumers.length - 1; i >= 0; i--) {
		var uid = consumers[i];
		var cash = amount;
		var usr = AV.Object.createWithoutData('WJUser', uid);
		var ca = new AV.Object('WJCash');
		ca.set('consume', consume);
		ca.set('type', 1);
		ca.set('user', usr);
		ca.set('recorder', recorder);
		ca.set('cash', cash);
		ca.set('date', date);
		allCash.push(ca);
		console.log("add a record; user: " + consumers[i] + ";");

		// var q = AV.Object.createWithoutData('WJUser', uid);
		// qs.push(q);

		var q = new AV.Query('WJUser');
		q.equalTo('objectId', uid);
		
		var q2 = AV.Query.or(q, qs);
		qs = q2;
	}

	qs.find().then(function(users){
		console.log('获取到用户:' + users.length);
		users.forEach(function(result){
			var balance = result.get('cash');
			console.log("balance: " + balance);
	        balance -= amount;
	        result.set('cash', balance);
			console.log("balance: " + balance);
		});
		return AV.Object.saveAll(users);
	}).then(function(users){
		console.log('扣款:' + users.length);
		return AV.Object.saveAll(allCash);
	}).then(function(){
		console.log('记录已保存');
		response.success("扣款成功");
	}).catch(function(error){
		console.log('发生错误了:' + error);
		response.error('save cash error ' + error.message);
	});