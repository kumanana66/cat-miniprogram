const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

Page({
  data: { cats: [] },

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setSelected(1)
    app.refreshCats()
    const cats = app.globalData.cats.map(c => ({
      ...c,
      ageText: calc.formatAge(c.birthday)
    }))
    this.setData({ cats })
  },

  addCat() {
    wx.navigateTo({ url: '/pages/profile/edit?mode=add' })
  },

  editCat(e) {
    wx.navigateTo({ url: `/pages/profile/edit?mode=edit&id=${e.currentTarget.dataset.id}` })
  },

  deleteCat(e) {
    const { id, name } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${name}」的档案吗？相关驱虫和体重记录也将一并删除。`,
      confirmColor: '#FF3B30',
      success: (res) => {
        if (!res.confirm) return
        let cats = storage.getCats().filter(c => c.id !== id)
        storage.saveCats(cats)
        storage.deleteCatDewormingRecords(id)
        storage.deleteCatWeightRecords(id)
        app.refreshCats()
        const updatedCats = app.globalData.cats.map(c => ({ ...c, ageText: calc.formatAge(c.birthday) }))
        this.setData({ cats: updatedCats })
        wx.showToast({ title: '已删除', icon: 'success' })
      }
    })
  }
})
