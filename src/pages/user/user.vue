<template>
  <view>
    <view class="userinfo">
      <view v-if="!userinfo.nickName" class="login">
        <button
          class="logintext"
          type="primary"
          open-type="getUserInfo"
          @getuserinfo="handlegetuserinfo"
        >登录</button>
      </view>
      <view v-else>
        <image class="avatar" :src="userinfo.avatarUrl"></image>
        {{userinfo.nickName}}
      </view>
    </view>
    <view class="operation">
      <view class="operationItem" @tap="handleChooseAddress">我的地址</view>
      <view class="operationItem" @tap="sendAddress">发送地址</view>
      <view class="operationItem">帮助和反馈</view>
      <view class="operationItem">在线客服</view>
    </view>
    <!-- <button v-if="!isLogin" type="primary" open-type="getUserInfo" @getuserinfo="handlegetuserinfo" plain>登录</button> -->
    <!-- <view v-else class="userinfo">
            <image class="avatar" :src="userMessage.avatarUrl"></image>
            <view class="userdetail">
                {{userMessage.nickName}}
            </view>
    </view>-->
  </view>
</template>
<script>
import { getSetting, openSetting, getUserInfo,chooseAddress } from "../../utils/asyncWx";
export default {
  data() {
    return {
      //   isLogin:false,
      //   userMessage:[]
      userinfo: {},
      address:{}
    };
  },
  onShow() {
    // this.setUserMessage();
    console.log("on Show")
    const userinfo = uni.getStorageSync("userinfo");
    this.userinfo = userinfo;
    const address = uni.getStorageSync("address");
    this.address = address;
  },
  onLoad() {
    //首先检验是否登录过
    //   this.check_isLogin();
    //   this.setUserMessage();
    
  },
  methods: {
    async handlegetuserinfo() {
      //获取权限状态
      try {
        const res1 = await getSetting();
        const scopeUserInfo = res1.authSetting["scope.userinfo"];
        if (scopeUserInfo === false) {
          await openSetting();
        }
        const res2 = await getUserInfo();
        uni.setStorageSync("userinfo", res2.userInfo);
        this.userinfo = res2.userInfo;
      } catch (error) {
        console.log(error);
      }
    },
    //用户选择收货地址  start
    async handleChooseAddress() {
      //获取权限状态
      try {
        const res1 = await getSetting();
        const scopeAddress = res1.authSetting["scope.address"];
        if (scopeAddress === false) {
          await openSetting();
        }
        const res2 = await chooseAddress();
        uni.setStorageSync("address",res2);
        console.log(res2);
      } catch (error) {
        console.log(error);
      }
    },
    //用户选择收货地址  end
    sendAddress(){
        this.request({
            url:"https://hzycode.utools.club/WechatTakeOut/address/addAddress",
            data:{
                openId:uni.getStorageSync("openid"),
                nick:this.address.userName,
                gender:this.userinfo.gender,
                phone:this.address.telNumber,
                province:this.address.provinceName,
                city:this.address.cityName,
                district:this.address.countryName,                   
                address:this.address.detailInfo,
            },
            methods:"GET"
        })
        .then((res)=>{
            console.log(res);
        })
    }
  },
};
</script>

<style>
.userinfo {
  background-color: #66bb6a;
  height: 175rpx;
  width: 100vw;
  display: flex;
  padding: 0 50rpx;
}
.avatar {
  border-radius: 50%;
  width: 150rpx;
  height: 150rpx;
}
.userdetail {
  padding-top: 100rpx;
  padding-left: 20rpx;
}
.operation {
  display: flex;
  padding-top: 20rpx;
}
.operationItem {
  width: 33%;
  height: 200rpx;
  background-color: #66bb6a;
  margin: 0 20rpx;
  border-radius: 20rpx;
  font-style: inherit;
  color: ghostwhite;
}
.login {
  padding-top: 20rpx;
}
.logintext {
  color: bisque;
}
</style>