import {user_api} from './api/common/index'
const util = require('./utils/util')
App({
  onLaunch() {
    util.isFullScreen().then(e => {
      if (e) {
          that.setData({
              isFullScreen: true
          })
          getApp().globalData.isFullScreen = true
          wx.setStorageSync('isFullScreen', isFullScreen)
      }
  })

    wx.login({
      success: res => {
          if (res.code) {
              user_api.login({
                  "code": res.code
              }).then(e => {
                  // 害，早知道后端初始化用户得了
                  // console.log("hello")
                  e.user.username = e.user.username === "" ? "💻" : e.user.username
                  e.user.avatar = e.user.avatar === "" ? "/images/mine/avatar.png" : getApp().globalData.API_FILE + e.user.avatar
                  wx.setStorageSync('user', e.user)
                  wx.setStorageSync('token', e.data.token)
                  let setting = {
                      is_click_heavy: e.user.is_click_heavy,
                      is_click_sound: e.user.is_click_sound,
                  }
                  getApp().globalData.user = e.user
                  getApp().globalData.setting = setting
                  wx.setStorageSync('setting', setting)
              })
          } else {
              console.log('登录失败！' + res.errMsg)
          }
      },
      fail: res => {
          util.showModalErrorAndMsg("错误", "网络超时")
      }
  })
  },
  globalData: {
    API_FILE: "https://funcfang.cn/api/",
    user: {
      id: "",
      username: "",
      avatar: "",
    },
    setting: {
      is_click_heavy: true,
      is_click_sound: true,
    },
    token: null,
    isFullScreen: false,
    weekArray: ['hello','周日', "周一", "周二", "周三", "周四", "周五", "周六", ]
  }
})