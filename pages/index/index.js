//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    cash: {date: '2017-5-15 星期一', message: '本期余额 17'},
    recent: [
      { wday: '星期一', restaurant: '腊肉', 'amount': 120, left: -103, all: '田龙，赵宝旺，王池，冯浩然，敬亮，李靖' }
    ]
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
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
