const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

Page({
  data: { currentCat: null, report: null, year: 0, month: 0 },

  onLoad() {
    const now = new Date()
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 })
  },

  onShow() {
    app.refreshCats()
    const cat = app.globalData.cats.find(c => c.id === app.globalData.currentCatId) || null
    this.setData({ currentCat: cat })
    if (cat) this.buildReport()
  },

  prevMonth() {
    let { year, month } = this.data
    month--; if (month < 1) { month = 12; year-- }
    this.setData({ year, month }); this.buildReport()
  },

  nextMonth() {
    let { year, month } = this.data
    month++; if (month > 12) { month = 1; year++ }
    this.setData({ year, month }); this.buildReport()
  },

  buildReport() {
    const { currentCat, year, month } = this.data
    if (!currentCat) return
    const catId = app.globalData.currentCatId
    const weightRecords = storage.getWeightRecords(catId)
    const dewormingRecords = storage.getDewormingRecords(catId)
    const report = calc.buildMonthReport(currentCat, weightRecords, dewormingRecords, year, month)
    this.setData({ report })
  },

  exportData() {
    const catId = app.globalData.currentCatId
    const cat = this.data.currentCat
    const data = {
      exportTime: new Date().toISOString(),
      cat,
      weightRecords: storage.getWeightRecords(catId),
      dewormingRecords: storage.getDewormingRecords(catId)
    }
    const json = JSON.stringify(data, null, 2)
    const fs = wx.getFileSystemManager()
    const path = `${wx.env.USER_DATA_PATH}/${cat.name}_健康数据.json`
    fs.writeFile({
      filePath: path, data: json, encoding: 'utf8',
      success: () => {
        wx.shareFileMessage({ filePath: path, fileName: `${cat.name}_健康数据.json` })
      },
      fail: () => wx.showToast({ title: '导出失败', icon: 'none' })
    })
  },

  onShareAppMessage() {
    const { report, currentCat } = this.data
    return {
      title: `${currentCat?.name}的${report?.month}健康报告`,
      path: '/pages/report/index'
    }
  }
})
