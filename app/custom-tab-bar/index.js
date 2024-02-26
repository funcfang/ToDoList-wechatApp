Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#1296db",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/tabbar/index.png",
      selectedIconPath: "/images/tabbar/index_0.png",
      text: "今日"
    }, {
      pagePath: "/pages/list/list",
      iconPath: "/images/tabbar/menu.png",
      selectedIconPath: "/images/tabbar/menu_0.png",
      text: "清单"
    },
    {
      pagePath: "/pages/mine/mine",
      iconPath: "/images/tabbar/mine.png",
      selectedIconPath: "/images/tabbar/mine_0.png",
      text: "我的"
    },
  ]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.vibrateShort({
        type: "light"
      })
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})