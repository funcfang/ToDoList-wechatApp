// pages/about/about.js
Page({
    tapCopyLink(e) {
        var url = e.currentTarget.dataset.path
        wx.setClipboardData({
            data: url,
        })
    },
    onShareAppMessage: function () {

    }
})