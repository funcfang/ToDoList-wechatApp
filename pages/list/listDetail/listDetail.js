import {
    list_api,
    task_api
} from '../../../api/common/index'

const util = require("../../../utils/util")
Page({

    data: {
        API_FILE: getApp().globalData.API_FILE,
        user: {},
        isShowTeamPop: false,
        list: {},
        tasks: [],
        weekArray: [],
        teamMates: [{
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            },
            {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            }, {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            },
            {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            }, {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            },
            {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            }, {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            },
            {
                name: "sss",
                avatar: "/upload/avatar/3d8418fc-ff58-4374-a40c-1c5173283193-13rvkpbo51q62260bca300ecfe08b4965f170147ebb6.jpg"
            },
        ],
        isFullScreen: false,
        isInputListName: false,
        isCloseSlider: false,
    },

    onLoad: function (options) {
        var that = this
        if (options.data) {  
            var list = JSON.parse(options.data)
            that.setData({
                list,
                user: getApp().globalData.user, //需要自己在重新setdata，不知道为什么data直接定义中不行
                weekArray: getApp().globalData.weekArray
            })
        }else{  //邀请
            let list = {
                id : options.list_id
            }
            that.setData({
                list
            })
            that.getUserInfo()

        }
    },

    onShow() {
        this.getTaskList()
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
            },
            fail: res => {
                util.showModalErrorAndMsg("错误", "网络超时")
            }
        })
    },

    tapTeam() {
        this.setData({
            isShowTeamPop: true
        })
    },

    tapFinish(e) {
        var task = e.currentTarget.dataset.item
        task.finished_date = util.getNowDateFormat()
        if (task.end_date) {
            task.end_date = util.setDateFormat(task.end_date)
        } else {
            task.end_date = "0001-01-01T23:59:59.000Z"
        }
        task_api.finish(task.id, task).then(() => {
            this.getTaskList()
        })
    },

    tapCancel(e) {
        var task = e.currentTarget.dataset.item
        task_api.cancelFinish(task.id).then(() => {
            this.getTaskList()
        })
    },

    getTaskList() {
        var that = this
        task_api.get_list({
            list_id: that.data.list.id
        }).then(e => {
            that.setData({
                tasks: e.data
            })
        })
    },

    isFullScreen() {
        util.isFullScreen().then(e => {
            if (e) {
                that.setData({
                    isFullScreen: true
                })
                getApp().globalData.isFullScreen = true
            }
        })
    },


    tapTask(e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '../../task/task?task=' + JSON.stringify(item),
        })
    },


    tapDeleteTask(e) {
        var that = this
        wx.showActionSheet({
            alertText: "将永久删除该任务，无法撤回",
            itemColor: "#f5222d",
            itemList: ['删除任务'],
            success() {
                task_api.delete(e.currentTarget.id).then(() => {
                    that.getTaskList()
                })
            },
            fail(res) {
                console.log(res.errMsg)
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
            url: '../../task/task?list_id=' + this.data.list.id,
        })
    },

    onShareAppMessage() {
        return {
            title: '加入我的小组-' + this.data.list.name,
            path: '/pages/list/listDetail/listDetail?list_id=' + this.data.list.id + "&from_user_id=" + getApp().globalData.user.id,
        }
    }

})