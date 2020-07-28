import { resolve, reject } from "core-js/fn/promise"
//封装request请求
export default (params) => {
    //加载中
    uni.showLoading({
        title: "加载中"
    })

    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: {
                "content-type": "application/json", // 默认值
            },
            success(res) {
                resolve(res);
            },
            fail(err) {
                reject(err);
            },
            complete() {
                uni.hideLoading();
            }
        })
    })
}