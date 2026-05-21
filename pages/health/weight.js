const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

const today = new Date().toISOString().split('T')[0]

Page({
  data: {
    form: { date: today, weight: '', note: '' },
    bcsResult: null, dailyFood: 0,
    weightAlert: null,
    goal: null, goalProgress: 0
  },

  onShow() {
    const catId = app.globalData.currentCatId
    if (!catId) return
    const goal = storage.getWeightGoal(catId)
    this.setData({ goal })
  },

  onDateChange(e) { this.setData({ 'form.date': e.detail.value }) },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const val = e.detail.value
    this.setData({ [`form.${field}`]: val })
    if (field === 'weight') this.calcBcs(val)
  },

  calcBcs(weightStr) {
    const weight = parseFloat(weightStr)
    if (isNaN(weight) || weight <= 0) { this.setData({ bcsResult: null, dailyFood: 0, weightAlert: null }); return }
    const cat = app.globalData.cats.find(c => c.id === app.globalData.currentCatId)
    if (!cat) return
    const bcsResult = calc.getBcsStatus(cat, weight)
    const dailyFood = calc.calcDailyFood(cat, weight)
    // 骤变分析
    const records = storage.getWeightRecords(app.globalData.currentCatId)
    const mockRecords = [{ weight, date: today }, ...records]
    const weightAlert = calc.analyzeWeightChange(mockRecords)
    // 目标进度
    const { goal } = this.data
    let goalProgress = 0
    if (goal && records.length > 0) {
      goalProgress = calc.calcGoalProgress(weight, goal.target, goal.start) || 0
    }
    this.setData({ bcsResult, dailyFood, weightAlert, goalProgress })
  },

  setGoal() {
    const catId = app.globalData.currentCatId
    const records = storage.getWeightRecords(catId)
    const currentWeight = records.length > 0 ? records[0].weight : null
    wx.showModal({
      title: '设置目标体重',
      editable: true,
      placeholderText: '请输入目标体重(kg)',
      success: res => {
        if (!res.confirm || !res.content) return
        const target = parseFloat(res.content)
        if (isNaN(target) || target <= 0) { wx.showToast({ title: '请输入有效体重', icon: 'none' }); return }
        const goal = { target, start: currentWeight || target, setDate: today }
        storage.setWeightGoal(catId, goal)
        this.setData({ goal })
        wx.showToast({ title: '目标已设置', icon: 'success' })
      }
    })
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
