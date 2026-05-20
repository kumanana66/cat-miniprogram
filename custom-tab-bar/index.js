Component({
  data: {
    selected: 0,
    list: [
      { pagePath: 'pages/index/index',   text: '首页',   color: '#FF6B9D' },
      { pagePath: 'pages/profile/index', text: '猫咪档案', color: '#00C9A7' },
      { pagePath: 'pages/health/index',  text: '健康记录', color: '#FFD93D' },
      { pagePath: 'pages/consult/index', text: '健康咨询', color: '#A78BFA' }
    ]
  },

  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      this.setData({ selected: index })
      wx.switchTab({ url: '/' + path })
    },

    // 供各页面 onShow 调用以同步选中态
    setSelected(index) {
      this.setData({ selected: index })
    }
  }
})
