import {
    user_api
} from '../../api/common/index'


Page({

    data: {
        user: {
            is_click_sound: true,
            is_click_heavy: true
        }
    },

    onShow: function () {
        this.setData({
            user: wx.getStorageSync('user')
        })
    },

    onChange(e) {
        var that = this
        let id = e.currentTarget.id
        if (id === "touch") {
            that.data.user.is_click_heavy = e.detail.value
        } else {
            that.data.user.is_click_sound = e.detail.value
        }
        user_api.update_user_info(that.data.user).then(e => {
            wx.setStorageSync('user', that.data.user)
        })
    }

})