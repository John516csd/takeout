<template>
  <view class="store">
    <view class="store-info" @click="selectStore">
      <view class="store-img">
        <image :src="'https://hzycode.cn/WechatTakeOut/pages/pics/'+storeInfo.pic"></image>
      </view>
      <view class="info">
        <view class="store-name">{{storeInfo.name}}</view>
        <view>
          <text class="score">{{storeInfo.star}}</text>
          <text class="saleMonth">月售{{storeInfo.monthSell}}</text>
          <text class="delTime">{{((storeInfo.deliveryTime)/60).toFixed(0)}}分钟</text>
        </view>
        <view class="priceInfo">
          <text class="minDelPrice">起送￥{{storeInfo.startTakeOut}}</text>
          <text class="delPrice">配送￥{{storeInfo.delivery}}</text>
          <text class="averagePrice">人均￥{{storeInfo.average}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    storeInfo: {
      type: Object,
      value: null,
    },
  },
  mounted(){
  },
  methods: {
    selectStore() {
      this.$emit("select", {
        detail: this.storeInfo.id,
        pic: this.storeInfo.pic,
      });
    },
  },
};
</script>
<style scoped>
@import "./style/store-list.css";
</style>