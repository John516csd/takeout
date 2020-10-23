<template>
  <view class="content">
    <view class="end-title">
      <view @tap="change(0)" :class="{btna:btnnum == 0}">全部订单</view>
      <view @tap="change(1)" :class="{btna:btnnum == 1}">待评价</view>
      <view @tap="change(2)" :class="{btna:btnnum == 2}">退款</view>
    </view>
    <view class="end-cont" :class="{dis:btnnum == 0}">
      <i-divider color="#ccc" lineColor="#fff">这是全部订单的消息</i-divider>
        <view class="orders">
          <view class="order" v-for="(order,index1) in orderList" :key="index1" @tap="toDetail(order.uuid)">
            <view class="shopInfo">
              <view class="goodPic">
                <image :src="picPath+order.shopPic"></image>
              </view>
              <view class="shopName">
                {{order.shopName}}
              </view>
              <view :class="'state'+(order.status == 2 ? ' stateColor':'')">{{stateArr[order.status]}}</view>
            </view>
            
            <view class="orderListContainer" v-for="(orderItem,index2) in order.menuList" :key="index2">
              <view class="orderList">
                <span class="menuName">{{orderItem.title}}</span>
                <span class="menuCount">x{{orderItem.number}}</span>
              </view>
            </view>
            <view class="button">
              <span class="notice">共{{order.menuCount}}件商品，实付<span class="money">￥{{order.total/100}}</span></span>
            </view>
          </view>
        </view>
      <i-divider content="加载已经完成,没有其他数据" lineColor="#fff"></i-divider>
    </view>
    <view class="end-cont" :class="{dis:btnnum == 1}">
      <i-divider  color="#2d8cf0" lineColor="#2d8cf0">这是待评价的消息</i-divider>
      <i-divider content="加载已经完成,没有其他数据" lineColor="#2d8cf0"></i-divider>
    </view>
    <view class="end-cont" :class="{dis:btnnum == 2}">
      <i-divider  color="#2d8cf0" lineColor="#2d8cf0">这是退款的消息</i-divider>
      <i-divider content="加载已经完成,没有其他数据" lineColor="#fff"></i-divider>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      btnnum: 0,
      orderList:[],
      stateArr:["待付款","已付款","配送中","已完成","已取消"],
      picPath : getApp().globalData.userAvatar
    };
  },
  onLoad() {
    this.getOrderList();
  },
  onShow(){
    this.getOrderList();
  },
  methods: {
    change(e) {
      this.btnnum = e;
      console.log(this.btnnum);
    },
    getOrderList() {
      this.request({
        url: getApp().globalData.serverUrl + "/order/getOrderList",
        data: {
          openId: uni.getStorageSync("openid"),
          param: -1,
        },
      }).then((res) => {
        this.orderList = res.data;
        console.log("getOrderList", this.orderList);
      });
    },
    toDetail(uuid){
      uni.navigateTo({
        url:"/pages/orderDetail/orderDetail?uuid="+uuid,
      })
    }
  },
};
</script>

<style>
@import "./cart.css";
</style>