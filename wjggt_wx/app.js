//app.js

const AV = require('./utils/av-weapp-min.js');

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
      typeof cb == "function" && cb(this.globalData.encryptedData)
    else
      typeof cb == "function" && cb("null data")
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{

      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo){
        that.globalData.userInfo = userInfo;
        typeof cb == 'function' && cb(that.globalData.userInfo);
        return;
      }

      //调用登录接口
      wx.login({
        success: function (info) {
          var code = info.code;
          wx.getUserInfo({
            success: function (res) {
              AV.Cloud.run('saveUser', {"code": code, "encData": res.encryptedData, "iv": res.iv})
              .then(function(user){
                
                wx.setStorage({
                  key: 'userInfo',
                  data: user,
                });
                that.globalData.userInfo = user;
                typeof cb == 'function' && cb(that.globalData.userInfo);
              }, function (err){
                that.globalData.lastError = err.message;
              });

            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    lastError: "",
  }
})