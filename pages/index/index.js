import {
    user_api
} from '../../api/common/index'

const util = require("../../utils/util")

Page({

    data: {
        isFullScreen: false,
        now_date: "",
        momentIcon_show: "morning"
    },

    onLoad: function (options) {
        var that = this
        // that.getUserInfo()
        that.updateTodayMoment()
        util.isFullScreen().then(e => {
            if (e) {
                that.setData({
                    isFullScreen: true
                })
                getApp().globalData.isFullScreen = true
            }
        })
    },

    onReady: function () {

    },

    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
    },

    getUserInfo() {
        wx.login({
            success: res => {
                if (res.code) {
                    user_api.login({
                        "code": res.code
                    }).then(e => {
                        // 害，早知道后端初始化用户得了
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


    //更新当前时间
    updateTodayMoment() {
        var that = this
        let weekArray = getApp().globalData.weekArray
        let now_date = (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日"
        let now_week = new Date().getDay()
        now_date = now_date + " " + weekArray[now_week]
        that.setData({
            now_date: now_date
        })
        let now_hour = new Date().getHours()
        let momentIcon_show
        if (now_hour > 18 || now_hour < 6) {
            momentIcon_show = "evening"
        } else if (now_hour >= 6 && now_hour < 12) {
            momentIcon_show = "morning"
        } else {
            momentIcon_show = "afternoon"
        }
        if (momentIcon_show != that.data.momentIcon_show) {
            that.setData({
                momentIcon_show: momentIcon_show
            })
        }
    },

})