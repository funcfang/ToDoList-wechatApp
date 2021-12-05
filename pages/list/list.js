import {
    list_api
} from '../../api/common/index'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        total_task: 1,
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
        myLists: []
    },

    onLoad: function (options) {

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            })
        }
        this.getMyLists()
    },

    tapCreateList() {
        var that = this
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
        list_api.get_list().then(e => {
            that.setData({
                myLists: e.data
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

    tapCreateConfirm() {
        var that = this
        list_api.save(null, {
            name: this.data.listName
        }).then((e) => {
            that.getMyLists()
            that.tapPopCancel()
            that.setData({
                listName: ""
            })  
            this.navigatetoDetail(e)
        })
    },


    tapPopCancel() {
        let popShow = this.data.popShow
        popShow.isShowCreatePop = false
        popShow.isShowJoinPop = false
        this.setData({
            popShow
        })
    },


    tapMyList(e) {
        var item = e.currentTarget.dataset.item
        this.navigatetoDetail(item)
    },

    navigatetoDetail(item){
        wx.navigateTo({
          url: './listDetail/listDetail?data='+JSON.stringify(item),
        })
    },

    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})