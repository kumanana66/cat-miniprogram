const app = getApp()
const storage = require('../../utils/storage')

const today = new Date().toISOString().split('T')[0]

Page({
  data: {
    activeTab: 'pending',
    pendingList: [], doneList: [],
    showModal: false,
    form: { title: '', date: today, note: '' }
  },

  onShow() { this.loadData() },

  loadData() {
    const catId = app.globalData.currentCatId
    if (!catId) return
    const all = storage.getReminders(catId)
    this.setData({
      pendingList: all.filter(r => !r.done),
      doneList: all.filter(r => r.done).reverse()
    })
  },

  switchTab(e) { this.setData({ activeTab: e.currentTarget.dataset.tab }) },

  toggleEnabled(e) {
    const id = e.currentTarget.dataset.id
    const catId = app.globalData.currentCatId
    const item = this.data.pendingList.find(r => r.id === id)
    if (item) storage.updateReminder(catId, id, { enabled: !item.enabled })
    this.loadData()
  },

  markDone(e) {
    storage.updateReminder(app.globalData.currentCatId, e.currentTarget.dataset.id, { done: true })
    this.loadData()
  },

  deleteReminder(e) {
    wx.showModal({
      title: '确认删除', content: '确定删除此提醒？', confirmColor: '#FF3B30',
      success: res => {
        if (!res.confirm) return
        storage.deleteReminder(app.globalData.currentCatId, e.currentTarget.dataset.id)
        this.loadData()
      }
    })
  },

  showAdd() { this.setData({ showModal: true, form: { title: '', date: today, note: '' } }) },
  hideAdd() { this.setData({ showModal: false }) },
  onInput(e) { this.setData({ [`form.${e.currentTarget.dataset.field}`]: e.detail.value }) },
  onDateChange(e) { this.setData({ 'form.date': e.detail.value }) },

  addReminder() {
    const { form } = this.data
    if (!form.title.trim()) { wx.showToast({ title: '请输入提醒内容', icon: 'none' }); return }
    if (!form.date) { wx.showToast({ title: '请选择日期', icon: 'none' }); return }
    storage.saveReminder(app.globalData.currentCatId, {
      ...form, id: Date.now().toString(), done: false, enabled: true
    })
    this.setData({ showModal: false })
    this.loadData()
  }
})
