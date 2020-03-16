//Page Object
/*用户上滑页面，滚动条触底，开始加载下一个页面
  思路：1、找到滚动条触底的事件
      2、判断是否还有没有下一项数据
        获取到总页数只有总条数
        总页数 = Math.ceil(总条数 / 页容量 pagesize)
        和获取到当前的页码 pagenum
        当前的页码是否大于等于总页码数
      3、假如没有下一页数据，就弹出一个提示框
      4、假如还有下一页的数据，加载下一页的数据
  */  
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },

  // 商品的接口参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  //options(Object)
  onLoad: function(options) {
    console.log(options);
    // 在跳转的时候，如果是使用 cid 进行跳转的就使用 cid
    this.QueryParams.cid = options.cid || "";
     // 在跳转的时候，如果是使用 query 进行跳转的就使用 query
     this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // console.log(res)
    // 获取总条数
    const total = res.total;
    // 计算总页数
    // tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);

    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
      
  },

  // 标题的点击事件.从子组件传递过来的
  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index} = e.detail;
    // 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑，滚动条触底事件
  onReachBottom(){
    // 判断还有没有下一项数据
    if(this.QueryParams.pagenum >= this.totalPages){
      // 么有下一项数据
      wx.showToast({ title: '数据被你吃光啦'});
    }else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  }
});
  