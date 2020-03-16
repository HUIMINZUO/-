//Page Object
/*
1、发送请求获取数据
2、点击轮播图，可以进行预览大图
  轮播图添加绑定上点击事件
  调用小程序的api,previewImage
*/ 

/* 
1、点击加入购物车
  1、先绑定点击事件
  2、获取缓存中的购物车数据->数组格式
  3、先判断当前的商品是否加入购物车
  4、已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5、不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6、弹出提示

商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/ 
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏了
    isCollect:false
  },

  // 商品对象
  GoodsInfo: {},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = goodsObj;
    // console.log(goodsObj);

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iPhone的部分手机，不识别 webp图片格式
        // 最后是找公司的后端进行修改
        // 但我这是自己临时进行修改的，确保后端存储的是1.webp ->.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图，预览大图
  handlePrevewImage(e){
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);

    // 2、接收传递过来的图片URL
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击加入购物车
  handleCartAdd(){
    // 获取缓存中的购物车数据->数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断商品是否加入购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      // 此前已经添加了，这次再一次的进行添加操作
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 商品的数据已经在购物车里，就要开始num++
      cart[index].num++;
    }

    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '宝贝加入购物车',
      icon: 'success',
      duration: 1500,
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });      
  },

  // 点击商品的收藏图标
  handleCollect() {
    let isCollect = false;
     // 1 获取缓存中的商品收藏数组
     let collect = wx.getStorageSync("collect") || [];
     // 2 判断该商品是否被收藏过
     let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      // 3 当index！=-1表示 已经收藏过 
      if(index!==-1) {
        // 能找到 已经收藏过了  在数组中删除该商品
        collect.splice(index,1);
        isCollect = false;
        wx.showToast({
          title: '取消收藏',
          icon: "success",
          mask: true
        });
      } else {
        // 没有收藏过
        collect.push(this.GoodsInfo);
        isCollect = true;
        wx.showToast({
          title: '收藏成功',
          icon: "success",
          mask: true
        });
      }

      // 4 把数组存入到缓存中
      wx.setStorageSync("collect", collect);
      // 5 修改data中的属性  isCollect
      this.setData({
        isCollect
      })
  }
});
  