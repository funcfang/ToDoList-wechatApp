import {
    list_api,
    user_api
} from '../../api/common/index'
const util = require("../../utils/util")
var join_form = {}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        taskStatus: {
            finished_task_amount: null,
            unfinished_task_amount: null,
        },
        collapse: {
            create_expand: true,
            join_expand: false,
        },
        popShow: {
            isShowCreatePop: false,
            isShowJoinPop: false,
        },
        isListName: false,
        listName: "",
        create_list: [],
        join_list: [],
    },

    onLoad: function (options) {

    },

    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
        this.getMyLists()
        this.getUserTaskStatus()
    },

    getUserTaskStatus() {
        user_api.taskStatus().then(taskStatus => {
            this.setData({
                taskStatus
            })
        })
    },

    tapShowPop(e) {
        var that = this
        console.log(e)
        that.setData({
            popType: e.currentTarget.id
        })
        let popShow = that.data.popShow
        popShow.isShowCreatePop = true
        that.setData({
            popShow
        })
    },

    tap_collapse(e) {
        var that = this
        var collapse = that.data.collapse
        if (e.currentTarget.id === "mycreate") {
            collapse.create_expand = !collapse.create_expand
        } else {
            collapse.join_expand = !collapse.join_expand
        }
        that.setData({
            collapse
        })
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

    input_listName(e) {
        var that = this
        let listName = e.detail.value
        that.data.listName = listName
        if (listName == "") {
            that.setData({
                isListName: false
            })
        } else if (that.data.isListName == false) {
            that.setData({
                isListName: true
            })
        }
    },

    input(e) {
        if (e.currentTarget.id === 'man') {
            join_form.user_id = e.detail.value * 1
        } else {
            join_form.list_id = e.detail.value * 1
        }
    },

    async tapConfirm() {
        var that = this
        join_form.name = this.data.listName
        if (this.data.listName == '') return
        if (join_form.name === '' || join_form.user_id === '' || join_form.list_id === '') {
            util.showToast("请填写完整信息")
            return
        }
        var e
        if (that.data.popType === 'create') {
            e = await list_api.save(null, {
                name: this.data.listName
            })
        } else {
            join_form.is_join = true
            e = await list_api.add_joinList(join_form)
        }
        that.getMyLists()
        that.tapPopCancel()
        that.setData({
            listName: "",
            join_form:{}
        })
        this.navigatetoDetail(e)
    },


    tapPopCancel() {
        let popShow = this.data.popShow
        popShow.isShowCreatePop = false
        popShow.isShowJoinPop = false
        this.setData({
            popShow
        })
    },


    tapList(e) {
        var item = e.currentTarget.dataset.item
        this.navigatetoDetail(item)
    },

    navigatetoDetail(item) {
        wx.navigateTo({
            url: '/pages/list/listDetail/listDetail?data=' + JSON.stringify(item),
        })
    },

})