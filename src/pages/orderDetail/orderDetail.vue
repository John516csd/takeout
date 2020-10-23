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
      <i-cell
        :title="shopName"
        is-link
        :url="'/pics/storegoods/storegoods?id=' + orderDetail.order.shopId"
      >
        <i-icon size="25" color="#ccc" type="shop_fill" slot="icon" />
      </i-cell>
      <view
        class="goodDetail"
        v-for="(item, index) in orderDetail.order.menuList"
        :key="index"
      >
        <view class="goodPic">
          <image :src="userAvatar + item.pic"></image>
        </view>
        <view class="goodName">
          <view class="goodTitle">{{ item.title }}</view>
          <view class="goodCount">×{{ item.number }}</view>
        </view>
        <view class="goodPrice">
          <view class="totalMoney"
            >￥{{ (item.number * item.money) / 100 }}</view
          >
        </view>
        <view class="space"></view>
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
          <span class="nick"
            >{{ orderDetail.address.nick }}{{ orderDetail.address.phone }}</span
          >
          <view class="detailAddress">
            {{ orderDetail.address.province }}
            {{ orderDetail.address.city }}
            {{ orderDetail.address.district }}
            {{ orderDetail.address.address }}
          </view>
        </span>
      </view>
    </view>
    <view class="orderInfo">
      <view class="orderId">
        <span class="leftSpan">订单号码</span>
        <span class="rightSpan">{{ uuid }}</span>
      </view>
      <view class="orderTime">
        <span class="leftSpan">订单时间</span>
        <span class="rightSpan">{{ time }}</span>
      </view>
      <view class="orderNotice">
        <span class="leftSpan">订单备注</span>
        <span class="rightSpan">无</span>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      uuid: "",
      orderDetail: {},
      time: "",
      shopName: "",
      userAvatar: getApp().globalData.userAvatar,
    };
  },
  onLoad(options) {
    console.log("onLoad options", options);
    this.uuid = options.uuid;
    this.getOrderDetail();
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
        this.orderDetail = res.data;
        this.time = this.formatDate(this.orderDetail.order.addTime);
        this.setShopName();
        console.log("getOrderDetail", this.orderDetail);
      });
    },
    formatDate(addtime) {
      var now = new Date(addtime);
      var year = now.getFullYear(); //取得4位数的年份
      var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      var date = now.getDate(); //返回日期月份中的天数（1到31）
      var hour = now.getHours(); //返回日期中的小时数（0到23）
      var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
      var second = now.getSeconds(); //返回日期中的秒数（0到59）
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    setShopName() {
      this.shopName = this.orderDetail.order.shopName;
    },
  },
};
</script>
<style>
@import "./orderDetail.css";
</style>