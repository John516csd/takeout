<template>
  <view class="container">
    <!-- <page-head title="form"></page-head> -->
    <view class="uni-padding-wrap uni-common-mt">
      <view class="uni-form-item" @click="handlegetLocation">
        <view class="title">收货地址</view>
        <view class="inputSpace">
          <view class="got_location">{{address==null?"请选择你的收货地址":address}}</view>
        </view>
      </view>
      <form @submit="formSubmit" @reset="formReset">
        <view class="uni-form-item uni-column">
          <view class="title">收货人姓名</view>
          <view class="inputSpace">
            <input class="uni-input" name="nickname" placeholder="请输入姓名" v-model="nickname" />
          </view>
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">性别</view>
          <view class="inputSpace">
            <radio-group name="gender">
              <label>
                <radio value="男" :checked="gender=='男'" />
                <text>男</text>
              </label>
              <label>
                <radio value="女" :checked="gender=='女'" />
                <text>女</text>
              </label>
            </radio-group>
          </view>
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">电话号码</view>
          <view class="inputSpace">
            <input class="uni-input" name="phoneno" placeholder="请输入电话号码" v-model="phoneno" />
          </view>
        </view>
        <view class="uni-form-item uni-column">
          <view class="title">详细地址</view>
          <view class="inputSpace">
            <input
              class="uni-input"
              name="address_d"
              placeholder="详细地址，例1层101"
              maxlength="20"
              v-model="address_d"
            />
          </view>
        </view>
        <view class="uni-btn-v">
          <button class="mini-btn" plain="true" type="primary" size="mini" form-type="submit">保存地址</button>
          <button class="mini-btn" plain="true" type="primary" size="mini" form-type="reset" v-if="!uuid">重置信息</button>
          <button class="mini-btn" plain="true" type="primary" size="mini" form-type="delete" v-else @click="deleteAddress">删除地址</button>
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
      latitude: "",
      longitude: "",
      //编辑拿到的数据
      uuid: "",
      nickname: "",
      gender: "",
      phoneno: "",
      address_d: "",
      //是否来自submit的
      fromSubmit: false,
      shopId: 0,
    };
  },
  onLoad(options) {
    console.log("options", options);
    this.fromSubmit = options.fromSubmit == null ? false : true;
    this.shopId = options.shopId = options.shopId;
    console.log("fromSubmit", this.fromSubmit);
    this.uuid = options.uuid;
    this.request({
      url: getApp().globalData.serverUrl + "/address/getAddressByUuid",
      data: {
        openId:uni.getStorageSync("openid"),
        uuid: this.uuid,
      },
    }).then((res) => {
      console.log("addAddress", res.data);
      this.address = res.data.province + res.data.city + res.data.district;
      this.nickname = res.data.nick;
      this.phoneno = res.data.phone;
      this.gender = res.data.gender;
      this.address_d = res.data.address;
    });
  },
  methods: {
    test() {
      uni.chooseAddress({
        success(res) {
          console.log("chooseAddress的数据", res);
        },
      });
    },
    //选择并获取定位
    async handlegetLocation() {
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
        this.latitude = (res2.latitude + "").substring(0, 9);
        this.longitude = (res2.longitude + "").substring(0, 9);
        console.log("经纬度", this.latitude, this.longitude);
        this.formatAddress();
      } catch (error) {
        console.log(error);
      }
    },
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
        url: getApp().globalData.serverUrl + "/address/addAddress",
        data: {
          openId: uni.getStorageSync("openid"),
          nick: that.formMsg.nickname,
          gender: that.formMsg.gender,
          phone: that.formMsg.phoneno,
          province: that.provinceName,
          city: that.cityName,
          district: that.countyName,
          address: that.village + that.formMsg.address_d,
          lngAndLat: that.latitude + "," + that.longitude,
        },
        method: "POST",
      }).then((res) => {
        console.log(res);
        uni.setStorageSync("addressMessage", res.data);
        if (this.fromSubmit) {
          uni.navigateTo({
            url: "/pages/submit/submit?shopId=" + this.shopId,
          });
        } else {
          uni.reLaunch({
            url: "/pages/myaddress/address",
          });
        }
      });
    },
    //更新地址
    updateAddress() {
      var that = this;
      this.request({
        url: getApp().globalData.serverUrl + "/address/updateAddress",
        data: {
          uuid: that.uuid,
          openId: uni.getStorageSync("openid"),
          nick: that.formMsg.nickname,
          gender: that.formMsg.gender,
          phone: that.formMsg.phoneno,
          province: that.provinceName,
          city: that.cityName,
          district: that.countyName,
          address: that.village + that.formMsg.address_d,
          lngAndLat: that.latitude + "," + that.longitude,
        },
        method: "POST",
      }).then((res) => {
        console.log(res);
        uni.setStorageSync("addressMessage", res.data);
        uni.reLaunch({
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
        if (this.uuid) {
          this.updateAddress();
        } else {
          this.sendAddress();
        }
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
    deleteAddress() {
      this.request({
        url: getApp().globalData.serverUrl + "/address/deleteAddress",
        method: "POST",
        data: {
          uuid: this.uuid,
          openId: uni.getStorageSync("openid"),
        },
      }).then((res) => {
        console.log("delete", res);
        uni.setStorageSync("addressMessage", res.data);
        uni.reLaunch({
          url: "/pages/myaddress/address",
        });
      });
    },
  },
};
</script>
<style>
@import "./newAddress.css";
</style>