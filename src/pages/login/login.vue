<template>
    <view class="container">
        <view class="userinfo">
            <button v-if="check" open-type="getUserInfo" @getuserinfo="getUserInfo" type="success">登录授权</button>
            <view v-else>
                <image class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover"></image>
                <text class="userinfo-nickname">{{userInfo.nickName}}</text>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data(){
        return{
            userInfo:{},
            hasUserInfo:false,
            canIUse:uni.canIUse('button.open-type.getUserInfo'),
            check:true
        }
    },
    onLoad(){
        console.log("canIUse",this.canIUse);
        console.log("hasUserInfo",this.hasUserInfo);
        if(getApp().globalData.userInfo){
            this.userInfo=getApp().globalData.userInfo;
            this.hasUserInfo=true;
        }else if(this.data.canIUse){
            getApp().userInfoReadyCallback=res=>{
                this.userInfo = res.userInfo;
                this.hasUserInfo=true;
            }
        }else{
            uni.getUserInfo({
                success:res=>{
                    getApp().globalData.userInfo = res.userInfo;
                    this.userInfo = res.userInfo;
                    this.hasUserInfo = true;
                }
            })
        }
    },
    methods:{
        init(){
            this.check = !this.hasUserInfo && this.canIUse
        },
        getUserInfo(e){
            console.log(e);
            getApp().globalData.userInfo = e.detail.userInfo;
            this.userInfo = e.detail.userInfo;
            this.hasUserInfo = true;
            console.log(this.hasUserInfo,this.canIUse);
            console.log("userInfo",this.userInfo);
            this.check = false
        }
    }
}
</script>
<style scoped>
/**index.wxss**/
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  justify-content: center;
  color: rgb(174, 21, 21);
}

.usermotto {
  margin-top: 200px;
}
</style>