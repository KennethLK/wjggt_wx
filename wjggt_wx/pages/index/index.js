//index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    cash: "星期三",
    recent: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      var restaurant = wx.getStorageInfoSync('restaurant');

      //得到用户Id
      that.setData({
        userInfo: userInfo,
        recent: [
          { wday: '星期一', restaurant: '腊肉', 'amount': 120, left: -103, all: '田龙，赵宝旺，王池，冯浩然，敬亮，李靖' },
          { wday: '星期二', restaurant: '绵阳米粉', 'amount': 76, left: -179, all: '田龙，赵宝旺，王池，冯浩然，龚彦铭，李靖' }
        ]
      });

      //获取当前用户的消费记录
      var q0 = new AV.Query('WJConsumeDetail');
      var usr = AV.Object.createWithoutData('WJUser', userInfo.id);
      q0.set('user', usr);
      q0.include('consume');
      q0.limit(20);
      q0.find().then();
    });

  }
})
