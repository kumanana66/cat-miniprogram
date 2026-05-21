const app = getApp()
const storage = require('../../utils/storage')

Page({
  data: { currentCat: null, photos: [], photoGroups: [], selectMode: false, selectedMap: {}, selectedCount: 0 },

  onShow() {
    app.refreshCats()
    const cat = app.globalData.cats.find(c => c.id === app.globalData.currentCatId) || null
    this.setData({ currentCat: cat })
    if (cat) this.loadPhotos()
  },

  loadPhotos() {
    const photos = storage.getPhotos(app.globalData.currentCatId)
    const groupMap = {}
    photos.forEach(p => { if (!groupMap[p.date]) groupMap[p.date] = []; groupMap[p.date].push(p) })
    const photoGroups = Object.keys(groupMap).sort((a, b) => b.localeCompare(a)).map(date => ({ date, photos: groupMap[date] }))
    this.setData({ photos, photoGroups })
  },

  choosePhotos() {
    wx.chooseMedia({
      count: 9, mediaType: ['image'], sourceType: ['album', 'camera'],
      success: res => {
        const today = new Date().toISOString().split('T')[0]
        const newPhotos = res.tempFiles.map(f => ({ id: Date.now().toString() + Math.random().toString(36).slice(2), src: f.tempFilePath, date: today }))
        storage.addPhotos(app.globalData.currentCatId, newPhotos)
        this.loadPhotos()
      }
    })
  },

  onPhotoTap(e) {
    if (this.data.selectMode) {
      const id = e.currentTarget.dataset.id
      const selectedMap = { ...this.data.selectedMap }
      if (selectedMap[id]) delete selectedMap[id]; else selectedMap[id] = true
      this.setData({ selectedMap, selectedCount: Object.keys(selectedMap).length })
    } else {
      const { date, src } = e.currentTarget.dataset
      const group = this.data.photoGroups.find(g => g.date === date)
      wx.previewImage({ current: src, urls: group ? group.photos.map(p => p.src) : [src] })
    }
  },

  enterSelectMode(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ selectMode: true, selectedMap: { [id]: true }, selectedCount: 1 })
  },

  exitSelectMode() { this.setData({ selectMode: false, selectedMap: {}, selectedCount: 0 }) },

  saveSelected() {
    const ids = Object.keys(this.data.selectedMap)
    const photos = this.data.photos.filter(p => ids.includes(p.id))
    let done = 0
    photos.forEach(p => wx.saveImageToPhotosAlbum({ filePath: p.src, success: () => { done++; if (done === photos.length) wx.showToast({ title: `已保存${done}张`, icon: 'success' }) } }))
  },

  deleteSelected() {
    const ids = Object.keys(this.data.selectedMap)
    wx.showModal({
      title: '确认删除', content: `确定删除选中的 ${ids.length} 张照片？`, confirmColor: '#FF3B30',
      success: res => {
        if (!res.confirm) return
        const catId = app.globalData.currentCatId
        const photos = storage.getPhotos(catId).filter(p => !ids.includes(p.id))
        storage.savePhotos(catId, photos)
        this.exitSelectMode(); this.loadPhotos()
      }
    })
  }
})
