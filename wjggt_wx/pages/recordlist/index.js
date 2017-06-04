// pages/recordlist/index.js

var app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data:{
    userInput: '',
    textData: 'textData',
    jsonData: 'jsonData',
    lastError: ''
  },
  userInput: function(e){
    this.setData({
      userInput: e.detail.value,
      textData: 'loading' + e.detail.value
    })
  },
  saveData: function(){
    wx.setStorage({
      key: 'userInput',
      data: this.data.userInput
    })
  },
  loadData: function () { 
    var that = this;
    wx.getStorage({
      key: 'userInput',
      success: function(res) {
        that.setData({
          textData: "res.data"
        });
      },
    })
  },
  saveJsonData: function () { 
    wx.setStorage({
      key: 'testJson',
      data: {my: 'name ken'},
    })
  },
  loadJsonData: function () {
    var that =  this;
    wx.getStorage({
      key: 'testJson',
      success: function(res) {
        that.setData({
          jsonData: res.data.my
        })
      },
      fail: function(error){
        that.setData({
          jsonData: "error" + error
        })
      }
    })
   },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    app.getUserInfo(function(user){
      
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})