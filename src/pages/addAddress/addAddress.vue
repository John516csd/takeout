<template>
  <view class="container">
    <view class="address">详细地址：{{addressMessage.address}}</view>
    <view class="delete_address">
      <button @click="deleteAddress"> 删除地址 </button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      uuid: "",
      addressMessage:{},
      address:""
    };
  },
  onLoad(options) {
    console.log("options", options);
    this.uuid = options.uuid;
    this.request({
      url: getApp().globalData.serverUrl + "/address/getAddressByUuid",
      data: {
        openId:uni.getStorageSync("openid"),
        uuid: this.uuid,
      },
    }).then((res) => {
      console.log("addAddress",res.data);
      this.addressMessage = res.data;
      this.address = res.data.address
    });
  },
  methods:{
    deleteAddress(){
      this.request({
        methods:"POST",
        url:getApp().globalData.serverUrl + "/address/deleteAddress",
        data:{
          uuid:this.uuid,
          openId:uni.getStorageSync("openid"),
        },
      })
      .then((res)=>{
        console.log("delete",res);
        uni.setStorageSync("addressMessage",res.data);
        uni.reLaunch({
          url:"/pages/myaddress/address"
        })
      })
    }
  }
};
</script>