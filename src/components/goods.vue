<template>
  <view class="container">
    <view class="food">
      <view class="food-class">
        <scroll-view
          scroll-y
          scroll-with-animation
          :scroll-into-view="viewToLeft"
          class="scroll-class"
        >
          <view
            v-for="(item,index) in families"
            :key="index"
            :class="'food-class-item '+(activeIndex==index?'active':'')"
            @tap="selectFood(item.uuid,index)"
            :data-index="index"
            :data-titleId="item.uuid"
            :id="'left'+index"
          >
            <view class="text" :data-index="index" :data-titleId="item.uuid">{{item.familyName}}</view>
          </view>
        </scroll-view>
      </view>
      <view class="food-detail">
        <scroll-view
          scroll-y
          scroll-with-animation
          :scroll-into-view="viewTo"
          class="scroll-detail"
          @scroll="scroll"
          @scrolltolower="scrolltolower"
        >
          <view class="title-group" v-for="(item,index) in list" :key="index" :id="'right'+index">
            <view class="title">{{item.title}}</view>
            <view class="food-info" v-for="(item2,index) in item.items" :key="index">
              <view class="img">
                <image lazy-load :src="(picBase+item2.pic)?(picBase+item2.pic):default_img"></image>
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
      viewTo: "right3",
      picBase: getApp().globalData.serverUrl_p + "/",
      heightArr: [],
      default_img:"../../static/store.png",
    };
  },
  mounted() {},
  onReady() {
    this.getFoodsList();
  },
  methods: {
    calculateHeight() {
      const query = uni.createSelectorQuery().in(this);
      query
        .selectAll(".title-group")
        .boundingClientRect()
        .exec((res) => {
          console.log("exec", res);
          let nodes = res[0];
          let rel = [];
          nodes.map((item) => {
            rel.push(item.top);
          });
          this.heightArr = rel;
          console.log("heightArr", this.heightArr);
        });
    },
    getFoodsList() {
      this.request({
        url: getApp().globalData.serverUrl + "/menu/getMenusByShopId",
        data: {
          shopId: 1,
        },
      }).then((res) => {
        console.log("getFoodsList", res);
        this.calculateHeight();
      });
    },
    selectFood(uuid, index) {
      console.log("selectFood_uuid", uuid, "index", index);
      this.activeIndex = index;
      this.viewTo = "right" + index;
      console.log("viewTo", this.viewTo);
    },
    scroll(e) {
      let scrollTop = e.detail.scrollTop;
      for (let i = 0; i < this.heightArr.length; i++) {
        let h1 = this.heightArr[i] - 200;
        let h2 = this.heightArr[i + 1] - 200;
        if (scrollTop > h1 && scrollTop < h2) {
          this.activeIndex = i;
        }
      }
    },
    scrolltolower(){
      setTimeout(()=>{
        this.activeIndex = this.list.length-1;
      },100)
    }
  },
};
</script>
<style scoped>
page {
  width: 100%;
}
.active {
  background-color: #664663;
}
.food {
  display: flex;
  height: calc(100vh - 240rpx - 78rpx);
}
.food-class {
  flex: 2;
  background-color: #eee;
}
.scroll-class {
  height: calc(100vh - 240rpx - 78rpx);
}
.food-detail {
  flex-grow: 1;
  flex: 5;
  padding: 0 14rpx;
  font-size: 26rpx;
}
.scroll-detail {
  height: calc(100vh - 240rpx - 78rpx);
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