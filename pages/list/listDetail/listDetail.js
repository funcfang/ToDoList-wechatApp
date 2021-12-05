import {
    list_api
} from '../../../api/common/index'

const util = require("../../../utils/util")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:{},
        isInputListName:false
    },

    onLoad: function (options) {
        var list = JSON.parse(options.data)
        this.setData({
            list
        })
    },


    tapInputListName(){
        this.setData({
            isInputListName:true
        })
    },

    input_listName(e){
        var that=this
        that.setData({
            isInputListName:false
        })
        if(e.detail.value!="")
        {
            list_api.save(that.data.list.id, {
                name: e.detail.value
            })
        }else{
            util.showToast("请输入清单标题")
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
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