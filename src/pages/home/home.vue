<template>
  <view class="content">
    <search></search>
    <Swiper></Swiper>
    <view class="near-store">
      <text class="near-store-text">附近商家</text>
    </view>
    <view class="store-list">
      <storeList
        v-for="(item, index) in shopList"
        :key="index"
        :storeInfo="item"
        class="store-item"
        @select="toStoreGoods"
      ></storeList>
    </view>
    <view class="footer">暂无更多~~</view>
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
    };
  },
  onShow() {},
  onLoad() {
    this.getShopList();
    this.getShop();
  },
  methods: {
    toStoreGoods(id) {
      console.log("id", id.detail);
      var pic = "/" + id.pic;
      uni.setStorageSync("pic", getApp().globalData.serverUrl_p + pic);
      uni.navigateTo({
        url: "/pages/storegoods/storegoods?id=" + id.detail + "&pic=" + id.pic,
      });
    },
    getShopList() {
      var that = this;
      uni.getLocation({
        type: "wgs84",
        success(res) {
          console.log("当前经纬度：", res.latitude, res.longitude);
          var address = res.longitude+','+res.latitude;
          that.request({
            url: getApp().globalData.serverUrl + "/shop/getAllShop",
            data:{
              origin:address,
            }
          }).then((res) => {
            that.shopList = res.data;
            that.setTimearr();
            console.log("shopList", that.shopList);
          });
        },
      });
    },
    setTimearr(){
      console.log("setTimearr",this.shopList);
      var timeArr = [];
      for(var i = 0;i < this.shopList.length;i++){
        timeArr.push({"key":this.shopList[i].id,"value":this.shopList[i].deliveryTime});
        console.log("setTimearr的deliveryTime",this.shopList[i].deliveryTime);
      }
      console.log("timeArr",timeArr);
      uni.setStorageSync("timeArr",timeArr);
    },
    getShop() {
      this.request({
        url: getApp().globalData.serverUrl + "/shop/getShop",
        data: {
          shopId: 1,
        },
      }).then((res) => {
        console.log("getShop", res);
      });
    },
  },
};
</script>

<style>
page {
  width: 100%;
  overflow-x: hidden;
}
.store {
  width: 100%;
  overflow-x: hidden;
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
</style>
