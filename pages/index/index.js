import {
    user_api,
    list_api,
    task_api,
} from '../../api/common/index'

const util = require("../../utils/util")

Page({

    data: {
        isFullScreen: false,
        now_date: "",
        momentIcon_show: "morning",
        isShowPop: false,
        create_list: [],
        join_list: [],
        finishedTasks_today: [],
        unfinishedTasks_today: [],
    },

    onLoad: function (options) {
        var that = this
        that.updateTodayMoment()
        that.setData({
            isFullScreen: getApp().globalData.isFullScreen,
            Task_api: task_api,
            weekArray: getApp().globalData.weekArray,
        })
    },

    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        this.getTodayTasks()
    },

    getTodayTasks() {
        this.setData({
            unfinishedTasks_today: wx.getStorageSync('unfinishedTasks_today'),
            finishedTasks_today: wx.getStorageSync('finishedTasks_today'),
            todayFinished_amount: wx.getStorageSync('todayFinished_amount') === '' ? 0 : wx.getStorageSync('todayFinished_amount'), // 咋双问号语法不行捏
        })
        // console.log(this.data.unfinishedTasks_today, this.data.finishedTasks_today)
    },

    getMyLists() {
        var that = this
        list_api.get_createList().then(e => {
            that.setData({
                create_list: e
            })
        })
        list_api.get_joinList().then(e => {
            that.setData({
                join_list: e
            })
        })
    },


    //这里要记得优化后台
    tapList(e) {
        var type = e.currentTarget.id
        var index = e.currentTarget.dataset.index
        var list_id = e.currentTarget.dataset.list_id
        var that = this
        task_api.get_list({
            list_id: list_id,
            is_finished: false
        }).then(e => {
            if (type === 'create') {
                let create_list = that.data.create_list
                create_list[index]['tasks'] = e.data
                that.setData({
                    create_list
                })
            }
            if (type === 'join') {
                let join_list = that.data.join_list
                join_list[index]['tasks'] = e.data
                that.setData({
                    join_list
                })
            }
        })
    },

    // 弹出窗的添加任务
    tapAddTask(e) {
        // console.log(e)
        var task = e.currentTarget.dataset.item
        var unfinishedTasks_today = this.data.unfinishedTasks_today
        if (!unfinishedTasks_today) {
            unfinishedTasks_today = []
        }
        unfinishedTasks_today.push(task)
        this.setData({
            unfinishedTasks_today,
            isShowPop: false
        })
        wx.setStorageSync('unfinishedTasks_today', unfinishedTasks_today)
    },


    //组件的取消
    cancelTodayTask(e) {
        var that = this
        var unfinishedTasks_today = that.data.unfinishedTasks_today
        var finishedTasks_today = that.data.finishedTasks_today
        finishedTasks_today.splice(e.detail.index, 1)
        if (!unfinishedTasks_today) {
            unfinishedTasks_today = []
        }
        unfinishedTasks_today.push(e.detail.task)
        this.setData({
            unfinishedTasks_today,
            finishedTasks_today
        })
        var todayFinished_amount = that.data.todayFinished_amount - 1
        wx.setStorageSync('todayFinished_amount', todayFinished_amount)
        wx.setStorageSync('unfinishedTasks_today', unfinishedTasks_today)
        wx.setStorageSync('finishedTasks_today', finishedTasks_today)

    },

    //组件的完成
    finishTodayTask(e) {
        var that = this
        var unfinishedTasks_today = that.data.unfinishedTasks_today
        var finishedTasks_today = that.data.finishedTasks_today
        if (!finishedTasks_today) {
            finishedTasks_today = []
        }
        unfinishedTasks_today.splice(e.detail.index, 1)
        finishedTasks_today.push(e.detail.task)
        this.setData({
            unfinishedTasks_today,
            finishedTasks_today
        })
        var todayFinished_amount = that.data.todayFinished_amount + 1
        wx.setStorageSync('todayFinished_amount', todayFinished_amount)
        wx.setStorageSync('unfinishedTasks_today', unfinishedTasks_today)
        wx.setStorageSync('finishedTasks_today', finishedTasks_today)
    },


    delTodayTask(e) {
        var that = this
        var unfinishedTasks_today = that.data.unfinishedTasks_today
        var finishedTasks_today = that.data.finishedTasks_today
        var todayFinished_amount = that.data.todayFinished_amount
        if (e.detail.type === 'finished') {
            finishedTasks_today.splice(e.detail.index, 1)
            todayFinished_amount -= 1
        } else {
            unfinishedTasks_today.splice(e.detail.index, 1)
        }
        this.setData({
            unfinishedTasks_today,
            finishedTasks_today
        })
        wx.setStorageSync('todayFinished_amount', todayFinished_amount)
        wx.setStorageSync('unfinishedTasks_today', unfinishedTasks_today)
        wx.setStorageSync('finishedTasks_today', finishedTasks_today)
    },

    // 下边的icon
    tapAddIcon() {
        // console.log("ss")
    },

    tapSHowChooseTaskPop() {
        this.getMyLists()
        this.setData({
            isShowPop: true,
        })
    },


    //更新当前时间
    updateTodayMoment() {
        var that = this
        let weekArray = getApp().globalData.weekArray
        let now_date = (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日"
        let now_week = new Date().getDay()
        now_date = now_date + " " + weekArray[now_week+1]
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