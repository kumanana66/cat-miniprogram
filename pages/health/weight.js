const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

const today = new Date().toISOString().split('T')[0]

Page({
  data: { form: { date: today, weight: '', note: '' }, bcsResult: null, dailyFood: 0 },

  onDateChange(e) { this.setData({ 'form.date': e.detail.value }) },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const val = e.detail.value
    this.setData({ [`form.${field}`]: val })
    if (field === 'weight') this.calcBcs(val)
  },

  calcBcs(weightStr) {
    const weight = parseFloat(weightStr)
    if (isNaN(weight) || weight <= 0) { this.setData({ bcsResult: null, dailyFood: 0 }); return }
    const cat = app.globalData.cats.find(c => c.id === app.globalData.currentCatId)
    if (!cat) return
    const bcsResult = calc.getBcsStatus(cat, weight)
    const dailyFood = calc.calcDailyFood(cat, weight)
    this.setData({ bcsResult, dailyFood })
  },

  save() {
    const { form } = this.data
    if (!form.date) { wx.showToast({ title: '请选择日期', icon: 'none' }); return }
    const weight = parseFloat(form.weight)
    if (isNaN(weight) || weight <= 0) { wx.showToast({ title: '请输入有效体重', icon: 'none' }); return }
    const catId = app.globalData.currentCatId
    if (!catId) { wx.showToast({ title: '请先选择猫咪', icon: 'none' }); return }
    storage.saveWeightRecord(catId, { ...form, weight, id: Date.now().toString() })
    wx.showToast({ title: '记录已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  }
})
