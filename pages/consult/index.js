const symptomsUtil = require('../../utils/symptoms')

Page({
  data: {
    symptoms: symptomsUtil.SYMPTOMS,
    selectedIds: [],
    customSymptom: '',
    result: null
  },

  toggleSymptom(e) {
    const id = e.currentTarget.dataset.id
    let selectedIds = [...this.data.selectedIds]
    const idx = selectedIds.indexOf(id)
    if (idx === -1) selectedIds.push(id)
    else selectedIds.splice(idx, 1)
    this.setData({ selectedIds, result: null })
  },

  onCustomInput(e) {
    this.setData({ customSymptom: e.detail.value, result: null })
  },

  analyze() {
    const { selectedIds, customSymptom } = this.data
    if (selectedIds.length === 0 && !customSymptom.trim()) {
      wx.showToast({ title: '请选择或输入症状', icon: 'none' })
      return
    }
    const result = symptomsUtil.analyzeSymptoms(selectedIds, customSymptom)
    this.setData({ result })
    // 高紧急等级震动提示
    if (result.maxLevel === 'high') wx.vibrateShort({})
  },

  findHospital() {
    wx.chooseLocation({
      success() {},
      fail() {
        // 降级：打开地图搜索
        wx.openLocation({
          latitude: 0, longitude: 0,
          name: '附近宠物医院',
          fail() {
            wx.showToast({ title: '请在地图中搜索宠物医院', icon: 'none' })
          }
        })
      }
    })
  }
})
