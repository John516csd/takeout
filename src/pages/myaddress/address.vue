<template>
  <view class="container">
    <view class="address" v-for="(item1) in addressMessage" :key="item1">
      <view class="address_message">{{item1.address}}--------------{{item1.tag==1?"默认":" "}}</view>
      <view class="btn" @click="setdefault(item1.uuid)">设为默认</view>
      <view class="edit" @click="editAddress(item1.uuid)">编辑</view>
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
  onLoad(){
    //刷新addressMessage
    this.request({
        url:"https://hzycode.cn/WechatTakeOut/address/getAddsByOpenId",
        data:{
          openId:uni.getStorageSync("openid"),
        }
      })
      .then((res)=>{
        uni.setStorageSync("addressMessage",res.data);
      })
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
        url: "/pages/addAddress/addAddress?uuid=" + uuid,
      });
    },
  },
};
</script>
<style scoped>
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
}
.address_message {
  width: 90%;
  font-size: 30rpx;
  word-wrap: break-word;
}
.btn {
  position: absolute;
  margin-left: 400rpx;
  margin-top: 100rpx;
}
.edit {
  position: absolute;
  margin-left: 560rpx;
  margin-top: 100rpx;
}
</style>