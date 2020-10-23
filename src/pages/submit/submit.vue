<template>
  <view class="container">
    <view class="selectAddress">
      <i-panel title="收货地址">
        <view style="padding: 5px">
          <view class="address">
            <i-cell title="选择收货地址" is-link @click="handleOpen1">
              <span class="selectedAddress" slot="footer">{{
                selectedAddress
              }}</span>
              <i-icon
                type="coordinates"
                size="25"
                color="#80848f"
                slot="footer"
              />
            </i-cell>
            <i-action-sheet
              :visible="visible1"
              :actions="address"
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
      <i-panel title="您点的菜">
        <view class="goodMsg" v-for="(item, index) in cart" :key="index">
          <i-card
            full="true"
            style="margin-top: -1rpx"
            :title="item.title"
            :extra="'￥' + item.money / 100 + '×' + item.count"
            :thumb="baseUrl_p + item.pic"
          ></i-card>
        </view>
        <i-cell title="打包费">
          <view class="packagePay" slot="footer">￥0</view>
        </i-cell>
        <i-cell title="配送费">
          <view class="takeoutPay" slot="footer"
            >￥{{ shopInfo.delivery / 100 }}</view
          >
        </i-cell>
      </i-panel>
    </view>
    <view class="white"></view>
    <view class="pay">
      <view class="price">
        <view class="totalMoney"
          >￥{{ totalMoney + shopInfo.delivery / 100 }}</view
        >
        <view class="discount">已优惠￥5</view>
      </view>
      <view class="payBtn" @click="submit">去支付</view>
    </view>
  </view>
</template>
<script>
import { error } from "../../common/graceChecker";
export default {
  data() {
    return {
      visible1: false,
      cart: [],
      subCart: [],
      totalMoney: 0,
      baseUrl_p: getApp().globalData.userAvatar,
      address: [],
      orginAddress: [],
      selectedAddress: "",
      shopId: 0,
      shopInfo: {},
      addressUuid: "",
    };
  },
  onShow() {},
  onLoad(option) {
    this.shopId = option.shopId;
    this.getShopInfo();
    this.getCart();
    this.getAddress();
  },
  methods: {
    addressIsNull() {
      if (this.orginAddress.length == 0) {
        console.log("这里是没有收货地址就跳转到添加地址的");
        uni.navigateTo({
          url:
            "/pages/newAddress/newAddress?fromSubmit=" +
            true +
            "&shopId=" +
            this.shopId,
        });
        uni.showToast({
          title: "请先添加收货地址",
          content: "请先添加收货地址",
          icon: "none",
        });
        return true;
      } else {
        return false;
      }
    },
    getShopInfo() {
      this.request({
        url: getApp().globalData.serverUrl + "/shop/getShop",
        data: {
          openId: uni.getStorageSync("openid"),
          shopId: this.shopId,
        },
      }).then((res) => {
        this.shopInfo = res.data;
        console.log("这是submit的getShopInfo", this.shopInfo);
      });
    },
    getAddress() {
      var myAddress = [];
      myAddress = uni.getStorageSync("addressMessage");
      this.orginAddress = myAddress;
      console.log("getAddress", this.orginAddress);
      for (var i = 0; i < myAddress.length; i++) {
        this.address.push({ name: myAddress[i].address + "" });
        if (myAddress[i].tag == 1) {
          this.selectedAddress = myAddress[i].address;
          this.addressUuid = myAddress[i].uuid;
        }
      }
      console.log("address", this.address);
    },
    getCart() {
      this.cart = uni.getStorageSync("cart");
      for (var i = 0; i < this.cart.length; i++) {
        this.totalMoney += this.cart[i].money * this.cart[i].count;
        this.subCart.push({
          uuid: this.cart[i].uuid,
          number: this.cart[i].count,
        });
      }
      this.totalMoney /= 100;
    },
    handleOpen1() {
      this.visible1 = true;
    },
    handleCancel1() {
      this.visible1 = false;
    },
    handleClickItem1({ detail }) {
      const index = detail.index;
      console.log("点击了", this.address[index].name);
      this.selectedAddress = this.address[index].name;
      this.addressUuid = this.address[index].uuid;
      this.visible1 = false;
    },
    submit() {
      if (!this.addressIsNull()) {
        var that = this;
        console.log("支付");
        wx.requestSubscribeMessage({
          tmplIds: [
            "ncqMV3p0XjxJPWGyziSB6i6g5L-UscRLTT35u1-hv1Q",
            "R2CqMo63wKRtzg9k_8ANSeezyhiauAHq76-3V2N0EdE",
          ],
          success(res) {
            console.log(res);
            var dataArr = that.subCart;
            var dd = {
              shopId: that.shopId,
              address: that.addressUuid,
              openId: uni.getStorageSync("openid"),
              menuList: dataArr,
            };
            that
              .request({
                method: "POST",
                url: "https://hzycode.cn/WechatTakeOut/toPay/pay",
                data: JSON.stringify(dd),
                header: {
                  "content-type": "application/json", // 默认值
                },
              })
              .then((res) => {
                console.log("这是submit的", res);
                that
                  .request({
                    method: "POST",
                    url: "https://hzycode.cn/WechatTakeOut/toPay/testSuccess",
                    data: {
                      orderUuid: res.data.orderUuid,
                      openId: uni.getStorageSync("openid"),
                    },
                  })
                  .then((res) => {
                    uni.reLaunch({
                      url: "/pages/cart/cart",
                    });
                    console.log("submit的结果", res);
                  });
              });
          },
        });
      }
    },
  },
};
</script>
<style scoped>
@import "./submit.css";
</style>