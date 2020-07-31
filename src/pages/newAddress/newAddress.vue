<template>
  <view class="container">
    <view class="get_location" @click="handlegetlocation">选择位置</view>
    <view class="got_location">{{address}}</view>
    <page-head title="form"></page-head>
    <view class="uni-padding-wrap uni-common-mt">
      <form @submit="formSubmit" @reset="formReset">
        <view class="uni-form-item uni-column">
          <view class="title">收货人姓名</view>
          <input class="uni-input" name="nickname" placeholder="请输入姓名" />
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">性别</view>
          <radio-group name="gender">
            <label>
              <radio value="男" />
              <text>男</text>
            </label>
            <label>
              <radio value="女" />
              <text>女</text>
            </label>
          </radio-group>
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">电话号码</view>
          <input class="uni-input" name="phoneno" placeholder="请输入电话号码" />
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">详细地址</view>
          <input class="uni-input" name="address_d" placeholder="详细地址，例1层101" maxlength="20"/>
        </view>
        <!-- <view class="uni-form-item uni-column">
					<view class="title">保留选项</view>
					<view>
						<switch name="switch" />
					</view>
        </view>-->
        <view class="uni-btn-v">
          <button form-type="submit">Submit</button>
          <button type="default" form-type="reset">Reset</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import {
  getSetting,
  openSetting,
  getUserInfo,
  getLocation,
} from "../../utils/asyncWx";
var graceChecker = require("../../common/graceChecker.js");
export default {
  data() {
    return {
      address: "",
      formMsg: {},
      provinceName: "",
      cityName: "",
      countyName: "",
      village: "",
    };
  },
  methods: {
    //选择并获取定位
    async handlegetlocation() {
      //获取权限状态
      try {
        const res1 = await getSetting();
        const scopeLocation = res1.authSetting["scope.userLocation"];
        if (scopeLocation === false) {
          await openSetting();
        }
        const res2 = await getLocation();
        console.log("详细位置为：" + res2.address);
        this.address = res2.address;
        this.formatAddress();
      } catch (error) {
        console.log(error);
      }
    },

    // getlocation() {
    //   var that = this;
    //   uni.chooseLocation({
    //     success: function (res) {
    //       console.log("详细位置为：" + res.address);
    //       that.address = res.address;
    //       that.formatAddress();
    //     },
    //   });
    // },
    //格式化地址信息
    formatAddress() {
      let regex =
        "(?<province>[^省]+省|.+自治区)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)";
      let address = this.address;
      console.log("分解后的地址：", address.match(regex));
      return address.match(regex);
    },
    //发送地址到后台
    sendAddress() {
      var that = this;
      this.request({
        url: "https://hzycode.cn/WechatTakeOut/address/addAddress",
        data: {
          openId: uni.getStorageSync("openid"),
          nick: that.formMsg.nickname,
          gender: that.formMsg.gender,
          phone: that.formMsg.phoneno,
          province: that.provinceName,
          city: that.cityName,
          district: that.countyName,
          address: that.village + that.formMsg.address_d,
        },
        methods: "GET",
      }).then((res) => {
        console.log(res);
        uni.setStorageSync("addressMessage", res.data);
        uni.navigateTo({
          url: "/pages/myaddress/address",
        });
      });
    },
    //提交
    formSubmit: function (e) {
      console.log(
        "form发生了submit事件，携带数据为：" + JSON.stringify(e.detail.value)
      );
      this.formMsg = e.detail.value;
      //定义表单规则
      var rule = [
        {
          name: "nickname",
          checkType: "string",
          checkRule: "1,3",
          errorMsg: "姓名应为1-3个字符",
        },
        {
          name: "gender",
          checkType: "in",
          checkRule: "男,女",
          errorMsg: "请选择性别",
        },
        {
          name: "phoneno",
          checkType: "phoneno",
          checkRule: "",
          errorMsg: "请输入合法的电话号码",
        },
        {
          name: "address_d",
          checkType: "notnull",
          checkRule: "",
          errorMsg: "请输入详细地址",
        },
      ];
      //进行表单检查
      var formData = e.detail.value;
      var checkRes = graceChecker.check(formData, rule);
      if (checkRes && this.address) {
        uni.showToast({ title: "验证通过!", icon: "none" });
        var addressList = this.formatAddress();
        this.provinceName = addressList[1];
        this.cityName = addressList[2];
        this.countyName = addressList[3];
        this.village = addressList[5];
        this.sendAddress();
      } else if (!this.address) {
        uni.showToast({ title: "请选择地址", icon: "none" });
      } else {
        uni.showToast({ title: graceChecker.error, icon: "none" });
      }
    },
    //重置
    formReset: function (e) {
      console.log("清空数据");
    },
  },
};
</script>
<style>
.uni-form-item .title {
  padding: 20rpx 0;
}
</style>