const storage = require('./utils/storage')

App({
  globalData: {
    currentCatId: null,
    cats: []
  },

  onLaunch() {
    this.globalData.cats = storage.getCats()
    this.globalData.currentCatId = storage.getCurrentCatId()
    // 若无当前猫咪但有档案，默认选第一只
    if (!this.globalData.currentCatId && this.globalData.cats.length > 0) {
      this.globalData.currentCatId = this.globalData.cats[0].id
      storage.setCurrentCatId(this.globalData.currentCatId)
    }
  },

  // 刷新全局猫咪数据
  refreshCats() {
    this.globalData.cats = storage.getCats()
    if (!this.globalData.cats.find(c => c.id === this.globalData.currentCatId)) {
      this.globalData.currentCatId = this.globalData.cats.length > 0 ? this.globalData.cats[0].id : null
      storage.setCurrentCatId(this.globalData.currentCatId)
    }
  }
})
