<template>
  <view>
    <view class="userinfo">
      <view v-if="!userinfo.nickName" class="login">
        <button
          class="logintext"
          type="primary"
          open-type="getUserInfo"
          @getuserinfo="handlegetuserinfo"
          plain
        >登录</button>
      </view>
      <view v-else>
        <image mode="aspectFill" class="avatar" :src="userinfo.avatarUrl"></image>
        {{userinfo.nickName}}
      </view>
    </view>
    <!-- <view class="operation">
      <view class="operationItem" @tap="handleChooseAddress">
        <image mode="aspectFill" class="item_image" src="../../static/icons/address.png"></image>
        <view class="item_text">我的地址</view>
      </view>
      <view class="operationItem">
        <view class="item_text">帮助/反馈</view>
      </view>
      <view class="operationItem">在线客服</view>
    </view>-->
    <i-cell-group>
      <i-cell title="我的地址" @click="handleChooseAddress" is-link>
        <i-icon type="coordinates" size="20" slot="icon" />
      </i-cell>
      <i-cell title="帮助/反馈" @click="handleChooseAddress" is-link>
        <i-icon type="feedback" size="20" slot="icon" />
      </i-cell>
      <i-cell title="注册成为骑手" is-link>
        <i-icon type="group" size="20" slot="icon"/>
      </i-cell>
    </i-cell-group>
  </view>
</template>
<script>
import {
  getSetting,
  openSetting,
  getUserInfo,
  chooseAddress,
} from "../../utils/asyncWx";
export default {
  data() {
    return {
      //   isLogin:false,
      //   userMessage:[]
      userinfo: {},
      address: {},
    };
  },
  onShow() {
    // this.setUserMessage();
    console.log("on Show");
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
        this.request({
          url: "https://hzycode.cn/WechatTakeOut/user/saveUser",
          data: {
            openId: uni.getStorageSync("openid"),
          },
        }).then((res) => {
          console.log(res);
        });
      } catch (error) {
        console.log(error);
      }
    },
    //用户选择收货地址  start
    // async handleChooseAddress() {
    // 获取权限状态
    //   try {
    //     const res1 = await getSetting();
    //     const scopeAddress = res1.authSetting["scope.address"];
    //     if (scopeAddress === false) {
    //       await openSetting();
    //     }
    //     const res2 = await chooseAddress();
    //     uni.setStorageSync("address",res2);
    //     console.log(res2);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    handleChooseAddress() {
      this.request({
        url: "https://hzycode.cn/WechatTakeOut/address/getAddsByOpenId",
        data: {
          openId: uni.getStorageSync("openid"),
        },
      }).then((res) => {
        console.log("address", res);
        uni.setStorageSync("addressMessage", res.data);
        uni.navigateTo({
          url: "/pages/myaddress/address",
        });
      });
    },
    //用户选择收货地址  end
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
  box-shadow: 10rpx 10rpx 6rpx 6rpx #3d3c3d4b;
}
.userdetail {
  padding-top: 100rpx;
  padding-left: 20rpx;
}
.operation {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20rpx;
  justify-content: space-around;
}
.operationItem {
  display: flex;
  width: 30%;
  height: 200rpx;
  border-radius: 20rpx;
  box-shadow: 6rpx 6rpx 6rpx 6rpx #3d3c3d4b;
  position: relative;
  justify-content: center;
}
.item_text {
  position: absolute;
  width: 100%;
  height: 40rpx;
  color: black;
  font-size: 30rpx;
  font-weight: 300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  top: 130rpx;
}
.item_image {
  height: 100rpx;
  width: 100rpx;
  padding-top: 30rpx;
}
.login {
  padding-top: 20rpx;
}
.logintext {
  color: black;
}
</style>