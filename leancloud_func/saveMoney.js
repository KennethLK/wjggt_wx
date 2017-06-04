var moneyStr = request.params.money;
var userId = request.params.userId;
var dateStr = request.params.time1970;

var money = parseInt(moneyStr);
var time = parseInt(dateStr);

var date = new Date();
if (!isNaN(time))
{
    date.setTime(time); //上传了登记时间
}

// {"userId": "oTEbq0GnLYazKdOogwnX20B_pr1c", "money": 100}

if (isNaN(money))
{
    response.error('wrong number');
    return;
}
else if (money > 500 || money < -2000)
{
    response.error('invalid number, must -2000~500');
    return;
}

var query = new AV.Query('WJUser');
query.equalTo('openId', userId);
query.first().then(function(user){
    if (typeof user === 'undefined')
    {
        response.error('user bu cun zai');
    }
    else
    {
        var WJCash = AV.Object.extend('WJCash');
        var cash = new WJCash();
        cash.set('user', user);
        cash.set('cash', money);
        cash.set('date', date);
        cash.save().then(function(cash){
            var balance = user.get('cash');
            balance += money;
            user.set('cash', balance);
            user.save().then(function(user){
                response.success(balance);
            }, function(error){
                response.error('save user balance error');
            })
        }, function(error){
            response.error('save cash error');
        })
    }
}, function (error){
    response.error('user not found, id ' + userId);
});