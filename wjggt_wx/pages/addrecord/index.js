// pages/addrecord/index.js

Page({
  data:{
    users: [{ name: "李靖", id: "5921cc590ce46300695a00a3"},
      { name: "王池", id: "5921cc6ca22b9d0058812e3d" },
      { name: "田龙", id: "5921cc63a22b9d0058812e20" },
      { name: "敬亮", id: "5921cc788d6d810058df884e" },
      { name: "龚彦铭 ", id: "5921cc5f2f301e006b13c9a3" },
      { name: "赵宝旺", id: "5921cc682f301e006b13c9c2" },
      { name: "冯浩然", id: "5921cc728d6d810058df883c" }],
    restaurants:["腊肉", "宜宾燃面", "干拌", "过道", "黄焖鸡", "花溪米粉", "老麻抄手", "三顾冒菜", "拉面", "竹筒饭", "丸子", "C区食堂", "渝桥面", "麦当劳", "肯德基", "兵哥豌豆面", "酸菜鱼", "东北菜", "避风塘", "沁芥兰", "神牛饭", "过桥米线(会展)", "过桥米线(D区)"],
    selected: "",
    rndResult: "",
    rndSource: [],
  },
  checkboxChange: function(e){
    console.log(e.detail.value);
    this.setData({
      rndSource: e.detail.value
    })
  },
  onSave: function(){

  },
  onRandom: function(){
    var a = this.data.rndSource;
    var rnd = 0;
    for (var i=0;i<a.length;i++)
    {
      rnd += parseInt(Math.random() * a.length);
    }
    rnd = rnd % a.length;
    this.setData({ rndResult: a[rnd]});
    // this.data.rndResult = a[rnd];
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.data.rndSource = this.data.restaurants;
    // var a = "a,b,c".split(",");
    // console.log("len: " + a.length);
    // for (var i=0;i<100;i++)
    // {
    // var rnd = parseInt(Math.random() * a.length); 
    // console.log("rnd: " + rnd);
    // }
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