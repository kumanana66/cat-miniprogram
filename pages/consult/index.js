const symptomsUtil = require('../../utils/symptoms')

Page({
  data: {
    symptoms: symptomsUtil.SYMPTOMS,
    selectedIds: [],
    selectedMap: {},
    customSymptom: '',
    result: null
  },

  onShow() {
    typeof this.getTabBar === 'function' && this.getTabBar().setSelected(3)
  },

  toggleSymptom(e) {
    const id = e.currentTarget.dataset.id
    const selectedMap = { ...this.data.selectedMap }
    let selectedIds = [...this.data.selectedIds]
    if (selectedMap[id]) {
      delete selectedMap[id]
      selectedIds = selectedIds.filter(i => i !== id)
    } else {
      selectedMap[id] = true
      selectedIds.push(id)
    }
    this.setData({ selectedIds, selectedMap, result: null })
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
