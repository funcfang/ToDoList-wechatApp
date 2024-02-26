import {
    list_api,
    task_api,
    user_api
} from '../../../api/common/index'

const util = require("../../../utils/util")
Page({

    data: {
        API_FILE: getApp().globalData.API_FILE,
        user: {},
        isShowTeamPop: false,
        list: {},
        tasks: [],
        teamMembers: [],
        isFullScreen: false,
        isInputListName: false,
        isCloseSlider: false,
        setting: getApp().globalData.setting,
        Task_api: {},
    },

    onLoad: function (options) {
        var that = this
        that.setData({
            Task_api: task_api
        })
        that.data.setting = getApp().globalData.setting
        if (options.data) {
            var list = JSON.parse(options.data)
            that.setData({
                list,
                user: wx.getStorageSync('user'),
            })
        } else { //邀请
            let list = {
                id: options.list_id
            }
            that.setData({
                list,
            })
            that.joinTeam(options.list_id, options.from_user_id)
        }
    },

    onShow() {
        this.getTaskList()
    },

    joinTeam(list_id, from_user_id) {
        util.showLodaingIng("加入小组中")
        wx.login({
            success: res => { //这里写的太重复了，不知道为什么放util的话好像不能import接口
                if (res.code) {
                    user_api.login({
                        "code": res.code
                    }).then(e => {
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
                        if (from_user_id * 1 === e.user.id) {
                            wx.hideLoading()
                            util.showToast('不能加入自己的小组', "error", 1500, true)
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            }, 1500)
                            return
                        }
                        list_api.add_joinList({
                            user_id: e.user.id * 1,
                            list_id: list_id * 1,
                            is_join: true,
                        }).then(e => {
                            wx.hideLoading()
                            util.showToast("加入小组成功")
                        }).catch(err => {
                            util.showToast('错误，加入小组失败', "error", 1500, true)
                            setTimeout(() => {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            }, 1500)
                        })

                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                    util.showToast("加入失败,网络错误", "error", 1500, true)
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/index/index',
                        })
                    }, 1500)
                }
            },
            fail: res => {
                wx.hideLoading()
                util.showToast("加入失败,网络超时", "error", 1500, true)
                setTimeout(() => {
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }, 1500)

            },
        })
    },

    getTaskList() {
        var that = this
        task_api.get_list({
            list_id: that.data.list.id,
            is_finished: true
        }).then(e => {
            that.setData({
                finishedTasks: e.data
            })
        })
        task_api.get_list({
            list_id: that.data.list.id,
            is_finished: false
        }).then(e => {
            that.setData({
                unfinishedTasks: e.data
            })
        })
    },

    isFullScreen() {
        util.isFullScreen().then(isTrue => {
            if (isTrue) {
                that.setData({
                    isFullScreen: true
                })
                getApp().globalData.isFullScreen = true
            }
        })
    },

    tapDeleteList() {
        var that = this
        wx.showActionSheet({
            alertText: "将永久删除该清单，无法撤回",
            itemColor: "#f5222d",
            itemList: ['删除清单'],
            success() {
                list_api.delete(that.data.list.id).then(() => {
                    util.showToast("删除成功", "", 2000)
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/list/list',
                        })
                    }, 2000)
                })
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    tapInputListName() {
        this.setData({
            isInputListName: true
        })
    },

    input_listName(e) {
        var that = this
        that.setData({
            isInputListName: false
        })
        if (e.detail.value != "") {
            list_api.save(that.data.list.id, {
                name: e.detail.value
            })
        } else {
            util.showToast("请输入清单标题")
        }
    },


    tapAdd() {
        wx.navigateTo({
            url: '/pages/task/task?list_id=' + this.data.list.id,
        })
    },

    tapMembers() {
        this.getListMembers()
        this.setData({
            isShowTeamPop: true
        })
    },

    getListMembers() {
        list_api.get_listMember(this.data.list.id).then(e => {
            this.setData({
                teamMembers: e
            })
        })
    },

    onShareAppMessage() {
        return {
            title: '加入我的小组 “' + this.data.list.name + " ”",
            path: '/pages/list/listDetail/listDetail?list_id=' + this.data.list.id + "&from_user_id=" + getApp().globalData.user.id,
        }
    },

})