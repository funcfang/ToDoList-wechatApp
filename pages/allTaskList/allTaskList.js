import {
    list_api,
    task_api,
    user_api
} from '../../api/common/index'

const util = require("../../utils/util")
Page({

    data: {
        finishedTasks: [],
        unfinishedTasks: [],
        Task_api: {},
    },

    onLoad: function (options) {
        var that = this
        that.setData({
            Task_api: task_api
        })
    },

    onShow() {
        this.getTaskList()
    },
    getTaskList() {
        var that = this
        task_api.get_list({
            is_finished:true
        }).then(e => {
            that.setData({
                finishedTasks: e.data
            })
        })
        task_api.get_list({
            is_finished:false
        }).then(e => {
            that.setData({
                unfinishedTasks: e.data
            })
        })
    },
})