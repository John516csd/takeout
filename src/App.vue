<script>
export default {
  methods: {
    async loginRequest() {
      var [err, res] = await uni.request({
        url: "https://hzycode.cn/WechatTakeOut/key/openId",
        data: {
          code: uni.getStorageSync("code"),
        },
      });
      console.log("appres", res.data.openid);
      uni.setStorageSync("openid", res.data.openid);
      console.log("res.data.openid",res.data.openid)
      console.log("我的打印了")
      var [openidErr, openidRes] = await uni.request({
        url: "https://hzycode.cn/WechatTakeOut/user/saveUser",
        data: {
          openId: uni.getStorageSync("openid"),
        },
        method:"POST"
      });
      console.log("openidRes",openidRes);
      console.log("login_success");
    },
  },
  globalData: {
    testUrl: "https://hzycode.utools.club/WechatTakeOut",
    testUrl_p: "https://hzycode.utools.club/WechatTakeOut/pics",
    serverUrl: "https://hzycode.cn/WechatTakeOut/mini",
    userAvatar:"https://hzycode.cn/WechatTakeOut/pics/pics/uploads/",
    serverUrl_p: "https://hzycode.cn/WechatTakeOut/pics/pics",
  },
  onLaunch: function () {
    console.log("App Launch");
    //登录
    var that = this; 
    uni.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        uni.setStorageSync("code", code);
        that.loginRequest();
      },
    });
    //获取用户信息
    uni.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          uni.getUserInfo({
            success: (res) => {
              console.log("uni.getUserInfo");
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
