<template>
  <view class="container">
    <view class="selectAddress">
      <i-panel title="收货地址">
        <view style="padding: 5px;">
          <view class="address">
            <i-cell title="选择收货地址" is-link @click="handleOpen1">
              <i-icon type="coordinates" size="25" color="#80848f" slot="footer" />
            </i-cell>
            <i-action-sheet
              :visible="visible1"
              :actions="actions1"
              show-cancel
              @cancel="handleCancel1"
              @click="handleClickItem1"
            />
          </view>
          <view class="toAddressTime">
            <i-cell title="立即送出" is-link></i-cell>
          </view>
        </view>
      </i-panel>
    </view>
    <view class="goodsInfo">
      <i-panel title="你的菜单">
        <view class="goodMsg" v-for="(item,index) in cart" :key="index">
          <i-card
            full="true"
            style="margin-top:1rpx"
            :title="item.title"
            :extra="'￥'+(item.money)/100+'×'+(item.count)"
            :thumb="baseUrl_p+item.pic"
          ></i-card>
        </view>
        <!-- <view class="storeName">店名</view>
        <view class="packagePay">打包费</view>
        <view class="takeoutPay">配送费</view>-->
      </i-panel>
    </view>
    <view class="pay"></view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      money: 45,
      visible1: false,
      cart: [],
      baseUrl_p: getApp().globalData.serverUrl_p + "/",
      actions1: [
        {
          name: "选项1",
        },
        {
          name: "选项2",
        },
        {
          name: "去分享",
          icon: "share",
          openType: "share",
        },
      ],
    };
  },
  onLoad() {
    this.getCart();
  },
  methods: {
    getCart() {
      this.cart = uni.getStorageSync("cart");
      console.log(this.cart);
    },
    handleOpen1() {
      this.visible1 = true;
    },
    handleCancel1() {
      this.visible1 = false;
    },
    handleClickItem1({ detail }) {
      const index = detail.index + 1;
      console.log("点击了", index);
    },
    submit() {
      wx.requestSubscribeMessage({
        tmplIds: ["TyY-9tIz15Ea5e35UqQmrMhqLSmHa3lz9qwKG82J8Gg"],
        success(res) {
          console.log("这是提交订单的", res);
        },
      });
    },
  },
};
</script>
<style scoped>
@import "./submit.css";
</style>