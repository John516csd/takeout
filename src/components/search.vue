<template>
  <view class="container">
    <view class="search_input">
      <navigator url="/pages/search/search">搜索</navigator>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      msg: "这是子组件的msg",
    };
  },
  props: {
    aaa: {
      type: String,
      value: "",
    },
  },
  methods: {
    sendMsg() {
      this.$emit("func", this.msg);
    },
  },
};
</script>
<style scoped>
.search_input{
    height: 70rpx;
    padding: 10rpx;
    background-color: #66bb6a;
}
navigator{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 15rpx;
    color: #666;
}
</style>