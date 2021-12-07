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
        // 但其实没啥用，更新没上，拿的缓存
        user_api.update_user_info(that.data.user).then(e => {
            wx.setStorageSync('user', that.data.user)
            console.log(e)
            let setting={
                is_click_heavy:that.data.user.is_click_heavy,
                is_click_sound:that.data.user.is_click_sound
            }
            wx.setStorageSync('setting', setting)
        })
    }

})