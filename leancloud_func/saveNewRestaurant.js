// saveNewRestaurant
// 2017-5-26

//{"name": "休假食堂"}

var resId = request.params.resId;
var resName = request.params.name;

if (resId !== 'undefined')
{
	//查询饭店
	var res = AV.Object.createWithoutData('WJRestaurant', resId);
	res.fetch().then(function(res){
		response.success(res);
	}, function (error){
		response.error('restaurant not found error');
	});
}
else 
{
	if (resName === 'undefined') 
	{
		var date = new Date();
		resName = '食堂' + date.getTime();
	}
	
	console.log("name1:" + resName);
	var q = new AV.Query('WJRestaurant');
	q.equalTo('name', resName);
	q.find().then(function(result){
		if (result.length > 0)
		{
			response.success(result[0])
		}
		else
		{
			var WJRestaurant = AV.Object.extend('WJRestaurant');
			var res = new WJRestaurant();
			res.set('name', resName);
			res.save().then(function(res){
				response.success(res);
			}, function (error){
				response.error('save restaurant error');
			});
		}
	}, function(error){
			response.error('query restaurant error');
	});
}