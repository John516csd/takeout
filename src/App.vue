<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    //登录
    uni.login({
      //获取code
      success: function (res) {
        var code = res.code; //返回code
        // console.log(code);
        var appId = "wx732fcdde42fd6ea8";
        var secret = "b98c76bfbd0f72e40cb3aa7d32c7972f";
        uni.request({
          url:
            "https://api.weixin.qq.com/sns/jscode2session?appid=" +
            appId +
            "&secret=" +
            secret +
            "&js_code=" +
            code +
            "&grant_type=authorization_code",
          data: {},
          header: {
            "content-type": "json",
          },
          success: function (res) {
            var openid = res.data.openid; //返回openid
            console.log("openid为" + openid);
            uni.setStorageSync("openid", openid);
          },
        });
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
