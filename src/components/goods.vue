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
            :id="item.id+'left'"
          >
            <view class="text" :data-index="index" :data-titleId="item.uuid">{{item.familyName}}</view>
          </view>
          <view class="food-detail">
            <scroll-view scroll-y scroll-with-animation :scroll-into-view="viewTo">
              <view class="title-group">
                <view class="title"></view>
              </view>
            </scroll-view>
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
      viewToLeft:"",
      viewTo:""
    };
  },
  methods: {
    selectFood(uuid,index) {
      console.log("selectFood_uuid", uuid,"index",index);
      this.activeIndex = index;
    },
  },
};
</script>
<style scoped>
.active{
  background-color: #664663;
}
</style>