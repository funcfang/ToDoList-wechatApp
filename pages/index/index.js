import {
    user_api
} from '../../api/common/index'

Page({

    data: {
        now_date: "",
        momentIcon_show: "morning"
    },

    onLoad: function (options) {
        var that = this
        that.getUserInfo()
        that.updateTodayMoment()
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
                        e.user.username = e.user.username === "" ? "💻" : e.user.username
                        e.user.avatar = e.user.avatar === "" ? "/images/mine/avatar.png" : getApp().globalData.API_FILE + e.user.avatar
                        wx.setStorageSync('user', e.user)
                        wx.setStorageSync('token', e.data.token)
                        getApp().globalData.user = e.user
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },


    //更新当前时间
    updateTodayMoment() {
        var that = this
        let weekArray = ['周日', "周一", "周二", "周三", "周四", "周五", "周六", ]
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

    onHide: function () {

    },



    onPullDownRefresh: function () {

    },


    onReachBottom: function () {

    },


    onShareAppMessage: function () {

    }
})