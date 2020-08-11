<template>
  <view class="container">
    <view class="address" v-for="(item1) in addressMessage" :key="item1">
      <view class="address_message">
        <text>
          {{item1.address}}
          {{item1.nick}} {{item1.gender=="男"?"先生":"女士"}}
          --------------{{item1.tag==1?"默认":" "}}
        </text>
      </view>
      <view class="btn icon iconfont icon-sheweimoren" @click="setdefault(item1.uuid)"></view>
      <view class="edit icon iconfont icon-bianji" @click="editAddress(item1.uuid)"></view>
    </view>
    <navigator class="newAddress" url="/pages/newAddress/newAddress">添加新地址</navigator>
  </view>
</template>
<script>
export default {
  data() {
    return {
      addressMessage: uni.getStorageSync("addressMessage"),
    };
  },
  onLoad() {
    //刷新addressMessage
    this.request({
      url: "https://hzycode.cn/WechatTakeOut/address/getAddsByOpenId",
      data: {
        openId: uni.getStorageSync("openid"),
      },
    }).then((res) => {
      uni.setStorageSync("addressMessage", res.data);
    });
  },
  methods: {
    //设为默认
    setdefault(uuid) {
      console.log(uuid);
      this.request({
        url: "https://hzycode.cn/WechatTakeOut/address/setFirst",
        data: {
          uuid: uuid,
          openId: uni.getStorageSync("openid"),
        },
      }).then((res) => {
        console.log(res);
        this.addressMessage = res.data;
        uni.redirectTo("/pages/myaddress/address");
      });
    },
    //编辑
    editAddress(uuid) {
      uni.navigateTo({
        url: "/pages/newAddress/newAddress?uuid=" + uuid,
      });
    },
  },
};
</script>
<style scoped>
/* @import '../../style/icons.css'; */
.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.address {
  width: 90%;
  height: 200rpx;
  /* display: flex; */
  border: 5rpx solid #ffffff;
  /* border-style: outset; */
  margin-top: 20rpx;
  border-radius: 20rpx;
  box-shadow: 20rpx 12rpx 10rpx 6rpx #3d3c3d4b;
  position: relative;
  background: #eecda3; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to left,
    #ef629f,
    #eecda3
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to left,
    #ef629f,
    #eecda3
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.address_message {
  width: 90%;
  font-size: 35rpx;
  word-wrap: break-word;
}
.btn {
  position: absolute;
  right: 90rpx;
  bottom: 0rpx;
}
.edit {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>