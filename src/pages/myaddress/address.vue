<template>
  <view class="container">
    <!-- <view class="address" v-for="(item1) in addressMessage" :key="item1">
      <view class="address_message">
        <text>
          {{item1.address}}
          {{item1.nick}} {{item1.gender=="男"?"先生":"女士"}}
          --------------{{item1.tag==1?"默认":" "}}
        </text>
      </view>
      <view class="btn icon iconfont icon-sheweimoren" @click="setdefault(item1.uuid)"></view>
      <view class="edit icon iconfont icon-bianji" @click="editAddress(item1.uuid)"></view>
    </view>-->
    <i-cell-group>
      <i-cell
        v-for="(item1) in addressMessage"
        :key="item1"
        :title="item1.address"
        :label="item1.nick+(item1.gender=='男'?'  先生':'  女士')"
      >
        <view class="editor" slot="footer" @click="editAddress(item1.uuid)">
          <i-icon type="editor" size="20" />
        </view>
        <view class="setDefault" @click="setdefault(item1.uuid)" slot="icon">
          <i-icon :color="item1.tag==1?'#ffe600':'#ccc'" :type="item1.tag==1?'collection_fill':'collection'" size="20" />
        </view>
      </i-cell>
    </i-cell-group>
    <view class="newAddress" @tap="toNewAddress">
      <i-icon type="add" size="25" />添加新地址
    </view>
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
    toNewAddress() {
      uni.navigateTo({
        url: "/pages/newAddress/newAddress",
      });
    },
  },
};
</script>
<style scoped>
/* @import '../../style/icons.css'; */
@import "./address.css";
</style>