//index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {nickName: "你的名字"},
    cash: -50,
    cashclass: "cash_minus",
    recent: [],
    new_code: 1399,
    show_group: "display: none",
    show_info: "display: none"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  joinGroup: function (e) {
    //加入小组
    var param = {"acode": this.data.inputCode, "uid": this.data.userInfo.id};
    AV.Cloud.run('joinGroup', param).then(function(group){

    }).catch(function(error){
      console.log("");
    });
  },
  createGroup: function (e) {

  },
  inputCode: function (e) {
    var code = e.detail.value;
    this.data.inputCode = code;
    console.log('code: ' + code);
  },
  inputName: function (e) {
    var name = e.detail.value;
    this.data.inputName = name;
    console.log('name: ' + name);
  },
  onLoad: function () {

    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){

      var show_group = "display: none";
      var show_info = "";
      if (userInfo.group == undefined)
      {
        show_group = "";
        show_info = "display: none";
      }
      else
      {
        var cls = "cash_minus"
        if (that.data.cash > 0)
        {
          cls = "cash";
        }
      }
      //得到用户Id
      that.setData({
        userInfo: userInfo,
        cashclass: cls,
        show_group: show_group,
        show_info: show_info
        // recent: [
        //   { wday: '星期一', restaurant: '腊肉', 'amount': 120, peopleAmount: 6, all: '田龙，赵宝旺，王池，冯浩然，敬亮，李靖' },
        //   { wday: '星期二', restaurant: '绵阳米粉', 'amount': 76, peopleAmount: 6, all: '田龙，赵宝旺，王池，冯浩然，龚彦铭，李靖' }
        // ]
      });
    });

  }
})
