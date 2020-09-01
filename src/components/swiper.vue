<template>
  <view>
    <page-head title="swiper,可滑动视图"></page-head>
    <view class="uni-margin-wrap">
      <swiper
        class="swiper"
        circular
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item>
          <view class="swiper-item">
            <image mode="widthFix"  src="https://hzycode.cn/WechatTakeOut/pages/pics/fontPic1.jpg"></image>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image mode="widthFix"  src="https://hzycode.cn/WechatTakeOut/pages/pics/fontPic2.jpg"></image>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item">
            <image mode="widthFix"  src="https://hzycode.cn/WechatTakeOut/pages/pics/fontPic3.jpg"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
    };
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots;
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay;
    },
    intervalChange(e) {
      this.interval = e.detail.value;
    },
    durationChange(e) {
      this.duration = e.detail.value;
    },
  },
};
</script>

<style>
@import "./style/swiper.css";
</style>
