import { resolve, reject } from "core-js/fn/promise"

export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}
export const getUserInfo = () => {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}