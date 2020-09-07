<template>
  <view>
    <!-- <search></search> -->
    <view class="store-good">
      <view class="head" @tap="showStoreDetail">
        <view class="head-img">
          <image :src="picPath"></image>
        </view>
        <view class="head-detail">
          <view class="info">
            <text>起送￥{{shopInfo.startTakeOut}}</text>
            <text>{{deliveryTime}}分钟</text>
            <text>3.2km</text>
          </view>
          <view class="publicMsg">{{shopInfo.announcement}}</view>
          <swiper class="actives" vertical autoplay circular>
            <swiper-item v-for="(item,index) in actives" :key="index" class="item" catchtouchmove="preventScrollSwiper">
              <view :class="'active-icon '+activesInfo[item.id].class">{{activesInfo[item.id].text}}</view>
              <view class="active-text">{{item.activeText}}</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="modal" v-if="showModal">
        <view class="top" @tap="closeModal"></view>
        <view class="bottom">
          <view class="modal-active" v-for="(item,index) in actives" :key="index">
            <view :class="'modal-icon '+activesInfo[item.id].class">{{activesInfo[item.id].text}}</view>
            <view class="modal-text">{{item.activeText}}</view>
          </view>
          <view class="info">
            <view class="title">配送</view>
            <view class="del-info">
              <text>起送￥2</text>
              <text>{{deliveryTime}}分钟</text>
              <text>2.5km</text>
            </view>
            <view class="time-info">配送时间：5:00-6:00</view>
          </view>
          <view class="public info">
            <view class="title info">公告</view>
            <view class="publicMsg">欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临欢迎光临</view>
          </view>
        </view>
      </view>
      <view class="tab" @tap="selectTabItem">
        <view class="tab-item" data-index="0">菜单</view>
        <view class="tab-item" data-index="1">评论</view>
        <view class="tab-item" data-index="2">商家</view>
        <view class="border" :style="'left:' + (30+tabIndex*160) + 'rpx'"></view>
      </view>
      <view class="food">
        <view class="food-class" :style="'height:' + listHeight + 'px'">
          <scroll-view scroll-y scroll-with>
          </scroll-view>
        </view>
        <view class="food-detail"></view>
      </view>
      <view class="cart"></view>
    </view>
    <!-- <view class="title-group">123</view> -->
    <goods :storeId="shopId"></goods>
  </view>
</template>

<script>
import goods from "../../components/goods.vue";
import search from "../../components/search.vue";
export default {
  data() {
    return {
      shopId: 0,
      shopInfo:{},
      goodsList: [],
      familiesList: [],
      picPath: uni.getStorageSync("pic"),
      actives:[
        {id:1,activeText:'123456789'},
        {id:2,activeText:'222222222'},
        {id:3,activeText:'122222222'},
        {id:4,activeText:'133333333'},
        {id:5,activeText:'666666666'},
        {id:6,activeText:'888888888'},
        {id:7,activeText:'999999999'},
      ],
      activesInfo: {
        1: {
          class: "manjian",
          text: "减",
        },
        2: {
          class: "xindian",
          text: "新",
        },
        3: {
          class: "zhekou",
          text: "折",
        },
        4: {
          class: "daijinquan",
          text: "券",
        },
        5: {
          class: "xinyonghu",
          text: "新",
        },
        6: {
          class: "peisong",
          text: "配",
        },
        7: {
          class: "lingdaijin",
          text: "领",
        },
        8: {
          class: "zengsong",
          text: "赠",
        },
      },
      showModal:false,
      tabIndex:0,
      deliveryTime:0
    };
  },
  onLoad(option) {
    console.log("option", option.id);
    // console.log("pic",option.pic);
    this.shopId = option.id;
    // this.picPath = option.pic;
    this.getShopInfo();
    this.getTimeArr();
  },
  components: {
    goods,
    search,
  },
  onReady(){
  },
  methods: {
    getShopInfo(){
      this.request({
        url:getApp().globalData.serverUrl+"/shop/getShop",
        data:{
          shopId:this.shopId,
        }
      })
      .then((res)=>{
        this.shopInfo = res.data;
        console.log("getShopInfo",this.shopInfo);
      })
    },
    selectTabItem(e) {
      if (e.target.dataset.index) {
          this.tabIndex = e.target.dataset.index
      }
    },
    showStoreDetail() {
     this.showModal = true
    },

    closeModal(e) {
      this.showModal = false
    },
    getTimeArr(){
      var timeArr = uni.getStorageSync("timeArr");
      console.log("getTimeArr的数据",timeArr);
      console.log("timeArr的长度",timeArr.length);
      for(var i = 0;i < timeArr.length;i++){
        if(timeArr[i].shopId == this.shopId){
          this.deliveryTime = timeArr[i].time;
        }
      }
    }
  },
};
</script>

<style>
@import "./storegoods.css";
</style>