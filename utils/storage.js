// 存储Key常量
const KEYS = {
  CATS: 'miaowu_cats',
  DEWORMING: 'miaowu_deworming',
  WEIGHT: 'miaowu_weight',
  CURRENT_CAT: 'miaowu_current_cat'
}

// 猫咪档案
function getCats() {
  return wx.getStorageSync(KEYS.CATS) || []
}
function saveCats(cats) {
  wx.setStorageSync(KEYS.CATS, cats)
}
function getCurrentCatId() {
  return wx.getStorageSync(KEYS.CURRENT_CAT) || null
}
function setCurrentCatId(id) {
  wx.setStorageSync(KEYS.CURRENT_CAT, id)
}

// 驱虫记录
function getDewormingRecords(catId) {
  const all = wx.getStorageSync(KEYS.DEWORMING) || {}
  return (all[catId] || []).sort((a, b) => new Date(b.date) - new Date(a.date))
}
function saveDewormingRecord(catId, record) {
  const all = wx.getStorageSync(KEYS.DEWORMING) || {}
  if (!all[catId]) all[catId] = []
  all[catId].push(record)
  wx.setStorageSync(KEYS.DEWORMING, all)
}
function deleteDewormingRecord(catId, recordId) {
  const all = wx.getStorageSync(KEYS.DEWORMING) || {}
  if (all[catId]) {
    all[catId] = all[catId].filter(r => r.id !== recordId)
    wx.setStorageSync(KEYS.DEWORMING, all)
  }
}
function deleteCatDewormingRecords(catId) {
  const all = wx.getStorageSync(KEYS.DEWORMING) || {}
  delete all[catId]
  wx.setStorageSync(KEYS.DEWORMING, all)
}

// 体重记录
function getWeightRecords(catId) {
  const all = wx.getStorageSync(KEYS.WEIGHT) || {}
  return (all[catId] || []).sort((a, b) => new Date(b.date) - new Date(a.date))
}
function saveWeightRecord(catId, record) {
  const all = wx.getStorageSync(KEYS.WEIGHT) || {}
  if (!all[catId]) all[catId] = []
  all[catId].push(record)
  wx.setStorageSync(KEYS.WEIGHT, all)
}
function deleteWeightRecord(catId, recordId) {
  const all = wx.getStorageSync(KEYS.WEIGHT) || {}
  if (all[catId]) {
    all[catId] = all[catId].filter(r => r.id !== recordId)
    wx.setStorageSync(KEYS.WEIGHT, all)
  }
}
function deleteCatWeightRecords(catId) {
  const all = wx.getStorageSync(KEYS.WEIGHT) || {}
  delete all[catId]
  wx.setStorageSync(KEYS.WEIGHT, all)
}

module.exports = {
  getCats, saveCats, getCurrentCatId, setCurrentCatId,
  getDewormingRecords, saveDewormingRecord, deleteDewormingRecord, deleteCatDewormingRecords,
  getWeightRecords, saveWeightRecord, deleteWeightRecord, deleteCatWeightRecords
}
