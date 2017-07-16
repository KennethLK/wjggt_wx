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
    new_code: "",
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
    var param = { "acode": this.data.inputCode, "uid": this.data.userInfo.objectId};
    AV.Cloud.run('joinGroup', param).then(function (groupId) {
      console.log("加入小组成功: " + groupId);
      //加入小组成功, 把小组信息存入到userInfo中
      var user = app.globalData.userInfo;
      user.group = groupId;
      app.saveDataToStorage();
    }).catch(function (error) {
      console.log("加入小组失败: " + error.message);
    });
  },
  createGroup: function (e) {
    var param = { "acode": this.data.new_code, "gname": this.data.inputName, "uid": this.data.userInfo.objectId};
    AV.Cloud.run('createGroup', param).then(function (groupId) {
      console.log("加入小组成功: " + groupId);
      //创建小组成功, 把小组信息存入到userInfo中
      var user = app.globalData.userInfo;
      user.group = group;
      app.saveDataToStorage();
    }).catch(function (err){
      console.log("创建小组失败: " + err.message);
    });
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

        //加载新建小组id
        var query = new AV.Query('GroupCodes');
        query.equalTo('canUse', true);
        query.addDescending('createdAt');
        query.first().then(function(gcode){
          var code = gcode.get('code');
          that.setData({
            "new_code": code
          });
        }).catch(function(err){
          that.setData({
            "new_code": "暂时无法新建小组, 请联系管理员"
          });
        });
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
