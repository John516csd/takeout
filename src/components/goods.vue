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
          <view
            class="title-group"
            v-for="(item,groupIndex) in list"
            :key="groupIndex"
            :id="'right'+groupIndex"
          >
            <view class="title">{{item.title}}</view>
            <view class="food-info" v-for="(item2,index) in item.items" :key="index">
              <view class="img">
                <image lazy-load :src="(picBase+item2.pic)?(picBase+item2.pic):default_img"></image>
              </view>
              <view class="info">
                <view class="name">{{item2.title}}</view>
                <view class="note">{{item2.note}}</view>
                <view class="month">
                  <text decode="true">月售{{item2.monthSell}}&nbsp;&nbsp;</text>
                  <text>赞{{item2.good}}</text>
                </view>
                <view class="price-count">
                  <view class="price">￥{{item2.money/100}}</view>
                  <view class="count">
                    <view
                      class="add btn"
                      @tap="add"
                      :data-index="index"
                      :data-item="item2"
                      :data-groupIndex="groupIndex"
                    >+</view>
                    <view class="num">{{item2.count}}</view>
                    <view
                      class="reduce btn"
                      @tap="reduce"
                      v-if="item2.count>0?true:false"
                      :data-index="index"
                      :data-item="item2"
                      :data-groupIndex="groupIndex"
                    >-</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="space"></view>
        </scroll-view>
      </view>
    </view>
    <view class="cart">
      <view class="cart-container" @tap="listCart">
        <view :class="'cart-img '+'has-food'">
          <image src="./static/gouwuche.png"></image>
        </view>
        <view class="del-price-money">
          <view class="money">￥{{totalMoney/100}}</view>
          <view
            class="del-price"
          >{{shopInfo.startTakeOut>0?'另需配送费'+shopInfo.startTakeOut+'元':'免配送费'}}</view>
        </view>
        <view
          :class="'start-del ' + ((totalMoney>=shopInfo.startTakeOut&&cart.length>0)?'has-food':'')"
          @tap="submitMenu"
        >{{(totalMoney>=shopInfo.startTakeOut&&cart.length>0)?'去结算':shopInfo.startTakeOut+'元起送'}}</view>
      </view>
      <view class="cart-list" v-if="showCart">
        <view class="top" @tap="closeModal"></view>
        <view class="cart-list-header" @tap="clearAll">清空购物车</view>
        <view class="cart-list-item">
          <view class="item" v-for="(item,index) in cart" :key="index">
            <view class="cart-detail">{{item.title}}</view>
            <view class="cart-detail" style="color:red">￥{{item.money/100}}</view>
            <view class="cart-detail cart-count">
              <view
                class="reduce btn"
                @tap="cartReduce"
                :data-index="index"
                :data-titleId="item.family"
                :data-uuid="item.uuid"
              >-</view>
              <view class="count">{{item.count}}</view>
              <view
                class="add btn"
                @tap="cartAdd"
                :data-index="index"
                :data-titleId="item.family"
                :data-uuid="item.uuid"
              >+</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    storeId: Number,
  },
  data() {
    return {
      shopId: 1,
      shopInfo: {},
      list: [],
      families: [],
      activeIndex: 0,
      viewToLeft: "",
      viewTo: "right0",
      picBase: getApp().globalData.serverUrl_p + "/",
      heightArr: [],
      default_img: "../../static/store.png",
      count: 0,
      showCart: false,
      cart: [],
      totalMoney: 0,
      submitShowcart: false,
    };
  },
  mounted() {},
  onReady() {
    this.changeShopId();
    this.getShopInfo();
    this.getFaimlies();
    this.getFoodsList();
    setTimeout(() => {
      this.calculateHeight();
    }, 500);
  },
  methods: {
    changeShopId(){
      this.shopId = this.storeId;
      console.log("shopId",this.shopId);
    },
    getShopInfo() {
      this.request({
        url: getApp().globalData.serverUrl + "/shop/getShop",
        data: {
          shopId: this.storeId,
        },
      }).then((res) => {
        this.shopInfo = res.data;
        console.log("getShopInfo", this.shopInfo);
      });
    },
    getFaimlies() {
      this.request({
        url: getApp().globalData.serverUrl + "/family/getFamilies",
        data: {
          shopId: this.storeId,
        },
      }).then((res) => {
        console.log("families", res.data);
        this.families = res.data;
      });
    },
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
          shopId: this.storeId,
        },
      }).then((res) => {
        this.list = res.data;
        console.log("list", this.list);
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
          this.viewToLeft = "left" + i;
        }
      }
    },
    scrolltolower() {
      setTimeout(() => {
        this.activeIndex = this.list.length - 1;
      }, 100);
    },
    add(e) {
      console.log(e);
      this.isOne = true;
      let groupIndex = e.target.dataset.groupindex;
      let index = e.target.dataset.index;
      let foodCount = this.list[groupIndex].items[index].count;
      let foodId = this.list[groupIndex].items[index].uuid;
      foodCount += 1;
      this.list[groupIndex].items[index].count = foodCount;
      console.log("list", this.list);
      let cart = this.cart;
      let isIncart = false;

      for (var i = 0; i < cart.length; i++) {
        if (cart[i].uuid == foodId) {
          isIncart = true;
          break;
        }
      }

      if (isIncart) {
        cart[i].count++;
      } else {
        cart.push({ ...this.list[groupIndex].items[index], groupIndex });
      }

      let totalMoney = this.totalMoney;
      totalMoney += this.list[groupIndex].items[index].money;
      this.totalMoney = totalMoney;
      this.cart = cart;
      console.log("cart", this.cart);
      console.log("totalMoney", this.totalMoney);
    },
    reduce(e) {
      console.log(e);
      let groupIndex = e.target.dataset.groupindex;
      let index = e.target.dataset.index;
      let foodCount = this.list[groupIndex].items[index].count;
      let foodId = this.list[groupIndex].items[index].uuid;
      foodCount -= 1;
      this.list[groupIndex].items[index].count = foodCount;
      console.log("list", this.list);

      let cart = this.cart;
      if (!(cart.length > 0)) {
        this.isOne = false;
      }

      for (var i = 0; i < cart.length; i++) {
        if (cart[i].uuid == foodId) {
          if (cart[i].count == 1) {
            cart.splice(i, 1);
          } else {
            cart[i].count--;
          }
          break;
        }
      }
      let totalMoney = this.totalMoney;
      totalMoney -= this.list[groupIndex].items[index].money;
      this.totalMoney = totalMoney;
      this.cart = cart;
      console.log("cart", this.cart);
      console.log("totalMoney", this.totalMoney);
    },
    listCart() {
      console.log("listCart", this.showCart);
      if (this.cart.length > 0 && this.submitShowcart == false) {
        this.showCart = !this.showCart;
      }
    },
    clearAll() {
      for (var i = 0; i < this.cart.length; i++) {
        for (var j = 0; j < this.list.length; j++) {
          if (this.cart[i].family == this.list[j].titleId) {
            for (var k = 0; k < this.list[j].items.length; k++) {
              if (this.list[j].items[k].uuid == this.cart[i].uuid) {
                console.log("执行了");
                this.list[j].items[k].count = 0;
              }
            }
          }
        }
      }
      this.cart = [];
      this.showCart = false;
      console.log("清除后的", this.list, this.cart);
      this.totalMoney = 0;
    },
    cartAdd(e) {
      console.log("cartAdd", e);
      var index = e.target.dataset.index;
      var titleId = e.target.dataset.titleid;
      var uuid = e.target.dataset.uuid;
      console.log(index, titleId, uuid);

      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].titleId == titleId) {
          for (var j = 0; j < this.list[i].items.length; j++) {
            if (this.list[i].items[j].uuid == uuid) {
              this.list[i].items[j].count += 1;
              this.cart[index].count += 1;
              this.totalMoney += this.cart[index].money;
              console.log("cartAdd", this.list, this.cart);
            }
          }
        }
      }
    },
    cartReduce(e) {
      var index = e.target.dataset.index;
      var titleId = e.target.dataset.titleid;
      var uuid = e.target.dataset.uuid;
      console.log(index, titleId, uuid);
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].titleId == titleId) {
          for (var j = 0; j < this.list[i].items.length; j++) {
            if (this.list[i].items[j].uuid == uuid) {
              this.list[i].items[j].count -= 1;
              this.totalMoney -= this.cart[index].money;
              if (this.list[i].items[j].count < 1) {
                this.cart.splice(index, 1);
              } else {
                this.cart[index].count -= 1;
              }
              if (this.cart.length == 0) {
                this.showCart = false;
              }
              console.log("cartReduce", this.list, this.cart);
            }
          }
        }
      }
    },
    submitMenu() {
      this.submitShowcart = true;
      console.log("submit", this.showCart);
      uni.setStorageSync("cart", this.cart);
      var dataArr = [];
      for (var i = 0; i < this.cart.length; i++) {
        var uuid = this.cart[i].uuid;
        var number = this.cart[i].count;
        dataArr.push({ uuid: uuid, number: number });
      }
      var res = {
        menuList: dataArr,
      };
      this.request({
        method: "POST",
        url: getApp().globalData.serverUrl + "/toPay/prePay",
        data: JSON.stringify(res),
      }).then((res) => {
        console.log("submitMenu", res);
        if (res.data == this.totalMoney) {
          uni.navigateTo({
            url: "/pages/submit/submit?shopId="+this.shopId,
          }),
            (this.submitShowcart = false);
        }
      });
    },
  },
};
</script>
<style scoped>
@import "./style/goods.css";
</style>