
import {
    user_api
} from '../../api/common/index'

Page({

    data: {
        user:{
            username:"💻",
            avatar:"/images/mine/avatar.png"
        },
        taskStatus:{
            finished_task_amount:null,
            unfinished_task_amount:null,
        }
    },

    onLoad: function (options) {
    
    },




    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
        this.getUserTaskStatus()
        this.setData({
            user:wx.getStorageSync('user')
        })
    },

    getUserTaskStatus(){
        user_api.taskStatus().then(taskStatus=>{
            this.setData({
                taskStatus
            })
        })
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