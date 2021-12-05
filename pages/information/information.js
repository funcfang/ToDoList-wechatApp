import {
    user_api
} from '../../api/common/index'
const util = require("../../utils/util")
Page({

    data: {
        user: {
            username: "",
            avatar: "",
        },
        isShowPop: true
    },

    onShow: function () {
        this.setData({
            user: wx.getStorageSync('user')
        })
    },

    inputName(e) {
        var that = this
        if(e.detail.value===""){
            util.showToast("请输入昵称")
            return
        }
        that.data.user.username = e.detail.value
        user_api.update_user_info(that.data.user).then(e => {
            wx.setStorageSync('user', that.data.user)
        })
    },

    changeAvatar() {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: 'original',
            async success(res) {
                var r = await user_api.upload_avatar(res.tempFilePaths[0])
                util.showToast("上传成功", "success")
                r = JSON.parse(r)
                that.data.user.avatar = getApp().globalData.API_FILE + r.data.avatar
                wx.setStorageSync('user', that.data.user)
                that.setData({
                    user:that.data.user
                })
            }
        })
    },




    tapName() {
        var that = this
        that.setData({
            isShowPop: !that.data.isShowPop
        })
    }


})