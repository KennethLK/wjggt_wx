//app.js

const AV = require('./libs/av-weapp-min.js');

App({
  onLaunch: function () {

    AV.init({
      appId: 'rdBRaWlAUDRbABMzwAsGCG11-gzGzoHsz',
      appKey: 'vU4Fm7XYX0TpHTNBAMPILbFp',
    });
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  getEncData: function(cb){
    if (this.globalData.encryptedData)
      typeof cb == "function" && cb(this.globalData.encryptedData);
    else
      typeof cb == "function" && cb("null data");
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)

              that.globalData.encryptedData = res.encryptedData;
              
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    encryptedData: ""
  }
})