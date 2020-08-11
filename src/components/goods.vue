<template>
  <view class="container">
    <view class="food">
      <view class="food-class">
        <scroll-view scroll-y scroll-with-animation :scroll-into-view="viewToLeft">
          <view
            v-for="(item,index) in families"
            :key="index"
            :class="'food-class-item '+(activeIndex==index?'active':'')"
            @tap="selectFood(item.uuid,index)"
            :data-index="index"
            :data-titleId="item.uuid"
            :id="item"
          >
            <view class="text" :data-index="index" :data-titleId="item.uuid">{{item.familyName}}</view>
          </view>
        </scroll-view>
      </view>
      <view class="food-detail">
        <scroll-view scroll-y scroll-with-animation :scroll-into-view="viewTo">
          <view class="title-group" v-for="(item,index) in list" :key="index">
            <view class="title" :id="item.title">{{item.title}}</view>
            <view class="food-info" v-for="(item2,index) in item.items" :key="index">
              <view class="img">
                <image :src="picBase+item2.pic"></image>
              </view>
              <view class="name">{{item2.title}}</view>
              <view class="note">{{item2.note}}</view>
              <view class="month">
                <text decode="true">月售{{item2.monthSell}}&nbsp;&nbsp;</text>
                <text>赞{{item2.good}}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    list: Array,
    families: Array,
  },
  data() {
    return {
      activeIndex: 0,
      viewToLeft: "",
      viewTo: "",
      picBase:getApp().globalData.serverUrl_p+'/',
    };
  },
  mounted() {
    this.getFoodsList();
  },
  methods: {
    getFoodsList() {
      this.request({
        url: getApp().globalData.serverUrl + "/menu/getMenusByShopId",
        data: {
          shopId: 1,
        },
      }).then((res) => {
        console.log("getFoodsList", res);
      });
    },
    selectFood(uuid, index) {
      console.log("selectFood_uuid", uuid, "index", index);
      this.activeIndex = index;
    },
  },
};
</script>
<style scoped>
page{
  width: 100%;
}
.active {
  background-color: #664663;
}
.food {
  display: flex;
  height:100%;
}
.food-class {
  flex: 2;
  background-color: #eee;
}
.food-detail {
  flex-grow: 1;
  flex: 5; 
  padding: 0 14rpx;
  font-size: 26rpx;
}

.food-detail .title {
  font-weight: 700;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  height: 50rpx;
  line-height: 50rpx;
  background-color: #eee;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.food-detail .title-group {
  padding-bottom: 30rpx;
}

.food-detail .title-group:last-child {
  margin-bottom: 120rpx;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.food-info {
  margin-bottom: 30rpx;
  display: flex;
}

.food-info:last-child {
  margin-bottom: 0;
}

.food-info .img {
  width: 120rpx;
  text-align: center;
}

.food-info .img image {
  width: 100rpx;
  height: 100rpx;
}

.food-info .info {
  flex-grow: 1;
}

.info .name {
  font-size: 36rpx;
  font-weight: 700;
}

.info .note {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>