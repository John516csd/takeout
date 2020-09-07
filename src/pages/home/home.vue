<template>
  <view class="content">
    <search></search>
    <Swiper></Swiper>
    <view class="near-store">
      <text class="near-store-text">附近商家</text>
    </view>
    <view class="store-list">
      <!-- <storeList
        v-for="(item, index) in shopList"
        :key="index"
        :storeInfo="item"
        class="store-item"
        @select="toStoreGoods"
      ></storeList>-->
      <view class="store" v-for="storeInfo in shopList" :key="storeInfo.id">
        <view class="store-info" @click="toStoreGoods(storeInfo.id,storeInfo.pic)">
          <view class="store-img">
            <image :src="'https://hzycode.cn/WechatTakeOut/pages/pics/'+storeInfo.pic"></image>
          </view>
          <view class="info">
            <view class="store-name">{{storeInfo.name}}</view>
            <view>
              <!-- <text class="score">{{storeInfo.star}}星</text> -->
              <text class="saleMonth">月售{{storeInfo.monthSell}}</text>
              <text class="delTime">{{(timeArr[storeInfo.id-1].time)}}分钟</text>
            </view>
            <view class="priceInfo">
              <text class="minDelPrice">起送￥{{storeInfo.startTakeOut/100}}</text>
              <text class="delPrice">配送￥{{storeInfo.delivery/100}}</text>
              <text class="averagePrice">人均￥{{storeInfo.average/100}}</text>
            </view>
            <i-rate count="5" :value="storeInfo.star"></i-rate>
          </view>
        </view>
      </view>
    </view>
    <view class="footer">~~暂无更多~~</view>
  </view>
</template>

<script>
import search from "../../components/search.vue";
import Swiper from "../../components/swiper.vue";
import storeList from "../../components/store_list.vue";

export default {
  components: {
    search,
    Swiper,
    storeList,
  },
  data() {
    return {
      shopList: [],
      originAddress: "",
      timeArr: [],
    };
  },
  onShow() {},
  onLoad() {
    this.getShopList();
  },
  methods: {
    toStoreGoods(id, pic) {
      console.log("id", id);
      var newPic = "/" + pic;
      uni.setStorageSync("pic", getApp().globalData.serverUrl_p + newPic);
      uni.navigateTo({
        url: "/pages/storegoods/storegoods?id=" + id + "&pic=" + newPic,
      });
    },
    getShopList() {
      // var that = this;
      // uni.getLocation({
      //   type: "wgs84",
      //   success(res) {
      //     console.log("当前经纬度：", res.latitude, res.longitude);
      //     var address = res.longitude + "," + res.latitude;
      //     that.originAddress = address;
      //     console.log("originAddress",that.originAddress)
      //   },
      // });
      this.request({
        url: getApp().globalData.serverUrl + "/shop/getAllShop",
      }).then((res) => {
        this.shopList = res.data;
        // this.setTimearr();
        console.log("shopList", this.shopList);
        this.getTimeArr();
      });
    },
    getTimeArr() {
      var that = this;
      uni.getLocation({
        type: "wgs84",
        success(res) {
          console.log("当前经纬度：", res.latitude, res.longitude);
          var address = res.longitude + "," + res.latitude;
          console.log("经纬度为", address);
          that
            .request({
              url: getApp().globalData.serverUrl + "/path/getAllDeliveryTime",
              data: {
                destination: address,
              },
            })
            .then((res) => {
              that.timeArr = res.data;
              that.formatTimeArr();
              console.log("TimeArr", that.timeArr);
              that.setTimearr();
            });
        },
      });
    },
    formatTimeArr() {
      for (var i = 0; i < this.timeArr.length; i++) {
        this.timeArr[i].time = (this.timeArr[i].time / 60).toFixed(0);
      }
    },
    setTimearr() {
      uni.setStorageSync("timeArr", this.timeArr);
    },
  },
};
</script>

<style>
page {
  width: 100%;
  /* overflow-x: hidden; */
}
.store {
  width: 100%;
  /* overflow-x: hidden; */
  height: auto;
}
.near-store {
  font-size: 30rpx;
  font-weight: 700;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  position: relative;
}

.near-store {
  margin: 20rpx 0;
}

.near-store-text {
  position: relative;
}

.near-store-text:after,
.near-store-text:before {
  background: #000;
  content: "";
  height: 1px;
  position: absolute;
  top: 50%;
  width: 80rpx;
}

.near-store-text:before {
  left: -100rpx;
}

.near-store-text:after {
  right: -100rpx;
}
.footer {
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 30rpx;
  position: relative;
}

.footer:after,
.footer:before {
  background: #aaa;
  content: "";
  height: 1px;
  position: absolute;
  top: 50%;
  width: 240rpx;
}

.footer:before {
  left: 30rpx;
}

.footer:after {
  right: 30rpx;
}

/* 这里是storeList的css */
.store {
  margin-bottom: 40rpx;
  border: 5rpx solid #fff;
}

.store-info {
  display: flex;
  height: 160rpx;
}

.store-img {
  width: 180rpx;
  margin: 0 20rpx;
  box-sizing: border-box;
  text-align: center;
}

.store-img image {
  width: 160rpx;
  height: 160rpx;
}

.info {
  font-size: 26rpx;
  width: 100%;
}

.info .store-name {
  font-size: 30rpx;
  font-weight: 700;
}

.icon-xingxing-copy,
.icon-xing1 {
  color: #ffcc01;
}

.icon-xingxing-copy-copy {
  color: #eee;
}

.info .score {
  margin-left: 10rpx;
}

.info .saleMonth {
  margin-left: 30rpx;
}

.info .delTime {
  float: right;
  margin-right: 20rpx;
}

.info .priceInfo text {
  padding: 0 14rpx;
  border-right: 4rpx solid #eee;
}

.info .priceInfo text:last-child {
  border-right: none;
}

.info .priceInfo text:first-child {
  padding-left: 0;
}

.actives {
  display: flex;
}

.actives-temp {
  width: 200rpx;
}

.actice-item .item {
  display: flex;
  line-height: 40rpx;
  font-size: 26rpx;
  margin-bottom: 10rpx;
  color: #333;
}

.actice-item .active-icon {
  width: 40rpx;
  height: 40rpx;
  color: #fff;
  text-align: center;
  margin-right: 10rpx;
}

.actice-item .active-text {
  width: 440rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.manjian {
  background-color: #ff8dc1;
}

.xindian {
  background-color: #75fb6d;
}

.zhekou {
  background-color: #ff111a;
}

.daijinquan {
  background-color: #fbd305;
}

.xinyonghu {
  background-color: #f93fe9;
}

.peisong {
  background-color: #67e1ef;
}

.lingdaijin {
  background-color: #56fb43;
}

.zengsong {
  background-color: #fd86ed;
}
</style>
