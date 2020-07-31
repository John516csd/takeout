<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    //登录
    uni.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        // console.log("code",code);
        uni.setStorageSync("code", code);
        var appId = "wx732fcdde42fd6ea8";
        var secret = "b98c76bfbd0f72e40cb3aa7d32c7972f";
        uni.request({
          url: "https://hzycode.cn/WechatTakeOut/key/openId",
          data: {
            code: uni.getStorageSync("code"),
          },
          success: (res) => {
            console.log("appres", res.data.openid);
            uni.setStorageSync("openid",res.data.openid); 
          },
        });
        uni.request({
          url:"https://hzycode.cn/WechatTakeOut/user/saveUser",
          data:{
            openId:uni.getStorageSync("openid"),
          },
          success:(res)=>{
            console.log(res);
          }
        })
      },
    });
    //获取用户信息
    uni.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          uni.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
</style>
