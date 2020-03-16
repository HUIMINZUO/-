// pages/category/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // web中的本地存储和微信小程序的本地存储的区别
    // 第一：写代码的方式不一样
    // 第二：存储的时候有没有做类型转换

    // 1、先判断本地存储中是否有无旧数据
    // 2、如果没有旧数据，直接发生新请求
    // 3、有旧的数据，同时旧的数据要确保没有过期才可以使用
    // 获取本地存储中的数据
    // 获取分类数据
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 不存在的话，发生请求获取数据
      this.getCates();
    } else {
      // 有旧的数据，定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        //使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    //   // console.log(res);
    //   this.Cates = res.data.message;
    //   // 把接口的数据存储到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);

    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 使用ES7的async await发送请求
    const res = await request({
      url: "/categories"
    });
    // this.Cates = res.data.message;
    this.Cates = res;
    // 把接口的数据存储到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });

    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);

    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e)
    // 1、获取被点击的标题身上的索引
    // 2、给 data中的currentIndex赋值就可以了
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容scroll-view标签的距离
      scrollTop: 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})