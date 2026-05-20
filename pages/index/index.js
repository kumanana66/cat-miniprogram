const app = getApp()
const storage = require('../../utils/storage')
const calc = require('../../utils/calc')

Page({
  data: {
    cats: [],
    currentCatId: null,
    currentCat: null,
    catAge: '',
    latestWeight: null,
    bcsStatus: '',
    dailyFood: 0,
    dewormingReminders: []
  },

  onShow() {
    this.loadData()
    typeof this.getTabBar === 'function' && this.getTabBar().setSelected(0)
  },

  loadData() {
    app.refreshCats()
    const cats = app.globalData.cats
    const currentCatId = app.globalData.currentCatId
    const currentCat = cats.find(c => c.id === currentCatId) || null

    let catAge = '', latestWeight = null, bcsStatus = '', dailyFood = 0, dewormingReminders = []

    if (currentCat) {
      catAge = calc.formatAge(currentCat.birthday)
      const weightRecords = storage.getWeightRecords(currentCatId)
      if (weightRecords.length > 0) {
        latestWeight = weightRecords[0]
        const bcs = calc.getBcsStatus(currentCat, latestWeight.weight)
        bcsStatus = bcs.status
        dailyFood = calc.calcDailyFood(currentCat, latestWeight.weight)
      }
      dewormingReminders = this.buildReminders(currentCat, currentCatId)
    }

    this.setData({ cats, currentCatId, currentCat, catAge, latestWeight, bcsStatus, dailyFood, dewormingReminders })
  },

  buildReminders(cat, catId) {
    const records = storage.getDewormingRecords(catId)
    const types = ['internal', 'external']
    const reminders = []

    types.forEach(type => {
      const typeRecords = records.filter(r => r.type === type)
      if (typeRecords.length === 0) return
      const last = typeRecords[0]
      const isFirstVaccinated = cat.isFirstVaccinated || false
      const nextDate = calc.calcNextDeworming(type, cat, last.date, isFirstVaccinated)
      if (!nextDate) return
      const days = calc.daysFromNow(nextDate)
      reminders.push({
        id: type,
        type,
        nextDate,
        days,
        urgent: days !== null && days <= 7
      })
    })

    return reminders.sort((a, b) => (a.days || 999) - (b.days || 999))
  },

  switchCat(e) {
    const id = e.currentTarget.dataset.id
    app.globalData.currentCatId = id
    storage.setCurrentCatId(id)
    this.loadData()
  },

  goAddCat() {
    wx.switchTab({ url: '/pages/profile/index' })
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/index' })
  },

  goHealth() {
    wx.switchTab({ url: '/pages/health/index' })
  }
})
