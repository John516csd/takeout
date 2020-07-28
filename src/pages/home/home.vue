<template>
  <view class="content">
  </view>
</template>

<script>
export default {
  data() {
    return {
    };  
  },
  onShow(){
  },
  onLoad() {
    //获取菜品信息
    this.request({
      url:"https://hzycode.cn/WechatTakeOut/menu/getMenusByShopId",
      data:{
        shopId:1,
      },
      methods:"GET"
    })
    .then((res)=>{
      console.log(res);
    })
  },
  methods: {
  },
};
</script>

<style>
</style>
