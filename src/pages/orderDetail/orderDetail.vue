<template>
  <view class="container">
    <view class="orderState">
      <view class="stateDetail">
        <view class="status">订单已送达</view>
        <view class="notice">感谢你对我的信任，欢迎下次光临</view>
        <view class="commitOrder">确认送达</view>
      </view>
    </view>
    <view class="orderDetail">
        <view class="shopName">至尊披萨(上社店)</view>
        <view class="goodDetail">
            <view class="goodPic">
              <image src="https://www.hzycode.cn/WechatTakeOut/pages/pics/front.jpg"></image>
            </view>
            <view class="goodName">
                <view class="goodTitle">波士顿大龙虾披萨</view>
                <view class="goodCount">×2</view>
            </view>
            <view class="goodPrice">
                <view class="totalMoney">￥12</view>
            </view>
        </view>
    </view>
    <view class="address">
      <view class="time">
        <span class="leftSpan">期望配送</span>
        <span class="rightSpan">立即配送</span>
      </view>
      <view>
        <span class="leftSpan">配送地址</span>
        <span class="rightSpan">
          <span class="nick">黄先生17702040524</span>
          <view class="detailAddress">广东技术师范大学学生宿舍7栋401</view>
        </span>
      </view>
    </view>
    <view class="orderInfo">
      <view class="orderId">
        <span class="leftSpan">订单号码</span>
        <span class="rightSpan">123456789123456789123456789</span>
      </view>
      <view class="orderTime">
        <span class="leftSpan">订单时间</span>
        <span class="rightSpan">2020-08-31 11:19:29</span>
      </view>
      <view class="orderNotice">
        <span class="leftSpan">订单备注</span>
        <span class="rightSpan">可乐少冰</span>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      uuid: "",
    };
  },
  onLoad(options) {
    console.log("onLoad options", options);
    this.uuid = options.uuid;
    // this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      this.request({
        url: getApp().globalData.serverUrl + "/order/getDetail",
        data: {
          uuid: this.uuid,
          openId: uni.getStorageSync("openid"),
        },
      }).then((res) => {
        console.log("getOrderDetail", res);
      });
    },
  },
};
</script>
<style>
@import "./orderDetail.css";
</style>