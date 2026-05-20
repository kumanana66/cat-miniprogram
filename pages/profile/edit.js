const app = getApp()
const storage = require('../../utils/storage')

const DEFAULT_FORM = { name: '', breed: '', birthday: '', gender: 'male', isSterilized: false, isOutdoor: false, isPregnant: false, isFirstVaccinated: false, avatar: '' }

Page({
  data: { mode: 'add', catId: null, form: { ...DEFAULT_FORM } },

  onLoad(options) {
    this.setData({ mode: options.mode || 'add' })
    if (options.mode === 'edit' && options.id) {
      const cat = storage.getCats().find(c => c.id === options.id)
      if (cat) this.setData({ catId: options.id, form: { ...DEFAULT_FORM, ...cat } })
    }
    wx.setNavigationBarTitle({ title: options.mode === 'edit' ? '编辑档案' : '添加猫咪' })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onDateChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onSwitch(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  setGender(e) {
    this.setData({ 'form.gender': e.currentTarget.dataset.val })
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ 'form.avatar': res.tempFiles[0].tempFilePath })
      }
    })
  },

  save() {
    const { form, mode, catId } = this.data
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入猫咪名字', icon: 'none' })
      return
    }
    const cats = storage.getCats()
    if (mode === 'add') {
      const newCat = { ...form, id: Date.now().toString(), name: form.name.trim() }
      cats.push(newCat)
      storage.saveCats(cats)
      if (!app.globalData.currentCatId) {
        app.globalData.currentCatId = newCat.id
        storage.setCurrentCatId(newCat.id)
      }
    } else {
      const idx = cats.findIndex(c => c.id === catId)
      if (idx !== -1) cats[idx] = { ...cats[idx], ...form, name: form.name.trim() }
      storage.saveCats(cats)
    }
    app.refreshCats()
    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  }
})
