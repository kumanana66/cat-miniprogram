const app = getApp()
const storage = require('../../utils/storage')

const today = new Date().toISOString().split('T')[0]

Page({
  data: { form: { type: 'internal', date: today, medicine: '', note: '' } },

  setType(e) { this.setData({ 'form.type': e.currentTarget.dataset.val }) },
  onDateChange(e) { this.setData({ 'form.date': e.detail.value }) },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }) },

  save() {
    const { form } = this.data
    if (!form.date) { wx.showToast({ title: '请选择驱虫日期', icon: 'none' }); return }
    const catId = app.globalData.currentCatId
    if (!catId) { wx.showToast({ title: '请先选择猫咪', icon: 'none' }); return }
    storage.saveDewormingRecord(catId, { ...form, id: Date.now().toString() })
    wx.showToast({ title: '记录已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  }
})
