const util = require("../../utils/util")
import {
    task_api
} from '../../api/common/index'

var CHOOSE_END_DATE

Page({

    data: {
        weekArray: [],
        isInputName: false,
        isSubmit: true,
        task: {},
        isShowCalendar: false,
        calendarConfig: {
            theme: 'elegant',
            inverse: true, // 单选模式下是否支持取消选中,
            showLunar: false,
            onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
            disableMode: { // 禁用某一天之前/之后的所有日期
                type: 'before', // [‘before’, 'after']
            },
        }
    },


    onLoad: function (options) {
        var that = this
        if (options.list_id) {
            that.data.task.list_id = options.list_id * 1
        } else {
            let task = JSON.parse(options.task)
            task.photos.map((item, index) => {
                task.photos[index].path = getApp().globalData.API_FILE + item.path
            })
            that.setData({
                task
            })
        }
        that.setData({
            weekArray: getApp().globalData.weekArray
        })
    },

    input_description(e) {
        this.data.task.description = e.detail.value
        if (this.data.task.id) {
            this.updateTask()
        }
    },

    tapSubmit() {
        task_api.save("", this.data.task).then(e => {
            wx.navigateBack({
                delta: 1,
            })
        })
    },

    async tapAddFile(e) {
        var task = this.data.task
        if (task.id) {
            if (task.files.length >= 6) {
                util.showToast("每位用户上传文件数不能超过6个")
                return
            }
        } else {
            util.showToast("需要先添加任务后才可以上传文件")
            return
        }
        util.chooseFile(1).then(e => {
            task_api.uploadFile(task.id, e[0]).then(res => {
                task = JSON.parse(res)
                task.photos.map((item, index) => {
                    task.photos[index].path = getApp().globalData.API_FILE + item.path
                })
                this.setData({
                    task
                })
            })
        })
    },

    readFile(e) {
        util.readFile(e.currentTarget.dataset.path)
    },

    tapPhoto() {
        var that = this
        var task = that.data.task
        if (task.id) {
            if (task.files.length >= 9) {
                util.showToast("每位用户上传图片数不能超过6个")
                return
            }
        } else {
            util.showToast("需要先添加任务后才可以上传图片")
            return
        }

        wx.chooseImage({
            count: 1,
            sizeType: 'original',
            success(res) {
                task_api.uploadPhoto(task.id, res.tempFilePaths[0]).then(res => {
                    console.log(res)
                    task = JSON.parse(res)
                    task.photos.map((item, index) => {
                        console.log(item, index)
                        task.photos[index].path = getApp().globalData.API_FILE + item.path
                    })
                    console.log("dsa", task)
                    that.setData({
                        task
                    })
                })
            }
        })
    },

    tapDelete() {
        var that = this
        wx.showActionSheet({
            alertText: "将永久删除该任务，无法撤回",
            itemColor: "#f5222d",
            itemList: ['删除任务'],
            success() {
                task_api.delete(that.data.task.id).then(() => {
                    wx.navigateBack({
                        delta: 1,
                    })
                })
            },
            fail(res) {
                console.log(res.errMsg)
            }
        })
    },

    tapChooseEndTime() {
        this.setData({
            isShowCalendar: true
        })
    },

    //日历选择日期
    afterTapDay(e) {
        var that = this
        if (e.detail.month < 10) {
            e.detail.month = '0' + e.detail.month
        }
        if (e.detail.day < 10) {
            e.detail.day = '0' + e.detail.day
        }
        CHOOSE_END_DATE = e.detail.year + "-" + e.detail.month + "-" + e.detail.day
        that.data.task.week = e.detail.week
    },

    //点击日历的确定
    confirmDate() {
        var that = this
        var task = that.data.task
        task.end_date = CHOOSE_END_DATE
        that.setData({
            task
        })
        that.data.task.end_date = CHOOSE_END_DATE
        if (that.data.task.id) {
            that.updateTask()
        }
        that.cancel()
    },

    //点击日历的取消
    cancel() {
        this.setData({
            isShowCalendar: false
        })
    },

    tapInputName() {
        this.setData({
            isInputName: true
        })
    },

    input_name(e) {
        var that = this
        that.setData({
            isInputName: false
        })
        if (e.detail.value === "") {
            util.showToast("请输入任务名称")
            return
        }
        that.data.task.name = e.detail.value
        if (that.data.task.id) {
            that.updateTask()
        }
    },


    updateTask() {
        var that = this
        // that.data.task.end_date = new Date(that.data.task.end_date).toJSON();
        // that.data.task.finished_date = new Date(that.data.task.finished_date).toJSON();  但是时间为空则是 2000-12-31T16:00:00.000Z
        that.data.task.end_date = util.setDateFormat(that.data.task.end_date)
        that.data.task.finished_date = util.setDateFormat(that.data.task.finished_date)
        task_api.save(that.data.task.id, that.data.task)
    }

})