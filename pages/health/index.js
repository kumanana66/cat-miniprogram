const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

Page({
  data: { activeTab: 'deworming', currentCat: null, dewormingRecords: [], weightRecords: [], nextDeworming: {} },

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setSelected(2)
    app.refreshCats()
    const cat = app.globalData.cats.find(c => c.id === app.globalData.currentCatId) || null
    this.setData({ currentCat: cat })
    if (cat) {
      this.loadDeworming(cat)
      this.loadWeight(cat)
    }
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  loadDeworming(cat) {
    const records = storage.getDewormingRecords(cat.id)
    const isFirstVaccinated = cat.isFirstVaccinated || false
    const internalLast = records.find(r => r.type === 'internal')
    const externalLast = records.find(r => r.type === 'external')
    const nextInternal = internalLast ? calc.calcNextDeworming('internal', cat, internalLast.date, isFirstVaccinated) : null
    const nextExternal = externalLast ? calc.calcNextDeworming('external', cat, externalLast.date, isFirstVaccinated) : null
    this.setData({
      dewormingRecords: records,
      nextDeworming: {
        internal: nextInternal,
        internalDays: nextInternal ? calc.daysFromNow(nextInternal) : null,
        external: nextExternal,
        externalDays: nextExternal ? calc.daysFromNow(nextExternal) : null
      }
    })
  },

  loadWeight(cat) {
    const records = storage.getWeightRecords(cat.id).map(r => {
      const bcs = calc.getBcsStatus(cat, r.weight)
      return { ...r, bcsStatus: bcs.status, diff: bcs.diff }
    })
    this.setData({ weightRecords: records })
  },

  addDeworming() {
    wx.navigateTo({ url: '/pages/health/deworming' })
  },

  addWeight() {
    wx.navigateTo({ url: '/pages/health/weight' })
  },

  deleteDeworming(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除', content: '确定删除此驱虫记录？', confirmColor: '#FF3B30',
      success: (res) => {
        if (!res.confirm) return
        storage.deleteDewormingRecord(this.data.currentCat.id, id)
        this.loadDeworming(this.data.currentCat)
      }
    })
  },

  deleteWeight(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除', content: '确定删除此体重记录？', confirmColor: '#FF3B30',
      success: (res) => {
        if (!res.confirm) return
        storage.deleteWeightRecord(this.data.currentCat.id, id)
        this.loadWeight(this.data.currentCat)
      }
    })
  }
})
