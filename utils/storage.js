const KEYS = {
  CATS: 'miaowu_cats',
  DEWORMING: 'miaowu_deworming',
  WEIGHT: 'miaowu_weight',
  CURRENT_CAT: 'miaowu_current_cat',
  PHOTOS: 'miaowu_photos',
  REMINDERS: 'miaowu_reminders',
  WEIGHT_GOAL: 'miaowu_weight_goal'
}

function getCats() { return wx.getStorageSync(KEYS.CATS) || [] }
function saveCats(cats) { wx.setStorageSync(KEYS.CATS, cats) }
function getCurrentCatId() { return wx.getStorageSync(KEYS.CURRENT_CAT) || null }
function setCurrentCatId(id) { wx.setStorageSync(KEYS.CURRENT_CAT, id) }

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
  if (all[catId]) { all[catId] = all[catId].filter(r => r.id !== recordId); wx.setStorageSync(KEYS.DEWORMING, all) }
}
function deleteCatDewormingRecords(catId) {
  const all = wx.getStorageSync(KEYS.DEWORMING) || {}
  delete all[catId]; wx.setStorageSync(KEYS.DEWORMING, all)
}

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
  if (all[catId]) { all[catId] = all[catId].filter(r => r.id !== recordId); wx.setStorageSync(KEYS.WEIGHT, all) }
}
function deleteCatWeightRecords(catId) {
  const all = wx.getStorageSync(KEYS.WEIGHT) || {}
  delete all[catId]; wx.setStorageSync(KEYS.WEIGHT, all)
}

// 照片
function getPhotos(catId) {
  const all = wx.getStorageSync(KEYS.PHOTOS) || {}
  return (all[catId] || []).sort((a, b) => new Date(b.date) - new Date(a.date))
}
function savePhotos(catId, photos) {
  const all = wx.getStorageSync(KEYS.PHOTOS) || {}
  all[catId] = photos
  wx.setStorageSync(KEYS.PHOTOS, all)
}
function addPhotos(catId, newPhotos) {
  const all = wx.getStorageSync(KEYS.PHOTOS) || {}
  if (!all[catId]) all[catId] = []
  all[catId] = [...newPhotos, ...all[catId]]
  wx.setStorageSync(KEYS.PHOTOS, all)
}
function deleteCatPhotos(catId) {
  const all = wx.getStorageSync(KEYS.PHOTOS) || {}
  delete all[catId]; wx.setStorageSync(KEYS.PHOTOS, all)
}

// 自定义提醒
function getReminders(catId) {
  const all = wx.getStorageSync(KEYS.REMINDERS) || {}
  return (all[catId] || []).sort((a, b) => new Date(a.date) - new Date(b.date))
}
function saveReminder(catId, reminder) {
  const all = wx.getStorageSync(KEYS.REMINDERS) || {}
  if (!all[catId]) all[catId] = []
  all[catId].push(reminder)
  wx.setStorageSync(KEYS.REMINDERS, all)
}
function updateReminder(catId, reminderId, patch) {
  const all = wx.getStorageSync(KEYS.REMINDERS) || {}
  if (all[catId]) {
    all[catId] = all[catId].map(r => r.id === reminderId ? { ...r, ...patch } : r)
    wx.setStorageSync(KEYS.REMINDERS, all)
  }
}
function deleteReminder(catId, reminderId) {
  const all = wx.getStorageSync(KEYS.REMINDERS) || {}
  if (all[catId]) { all[catId] = all[catId].filter(r => r.id !== reminderId); wx.setStorageSync(KEYS.REMINDERS, all) }
}
function deleteCatReminders(catId) {
  const all = wx.getStorageSync(KEYS.REMINDERS) || {}
  delete all[catId]; wx.setStorageSync(KEYS.REMINDERS, all)
}

// 目标体重
function getWeightGoal(catId) {
  const all = wx.getStorageSync(KEYS.WEIGHT_GOAL) || {}
  return all[catId] || null
}
function setWeightGoal(catId, goal) {
  const all = wx.getStorageSync(KEYS.WEIGHT_GOAL) || {}
  all[catId] = goal
  wx.setStorageSync(KEYS.WEIGHT_GOAL, all)
}

module.exports = {
  getCats, saveCats, getCurrentCatId, setCurrentCatId,
  getDewormingRecords, saveDewormingRecord, deleteDewormingRecord, deleteCatDewormingRecords,
  getWeightRecords, saveWeightRecord, deleteWeightRecord, deleteCatWeightRecords,
  getPhotos, savePhotos, addPhotos, deleteCatPhotos,
  getReminders, saveReminder, updateReminder, deleteReminder, deleteCatReminders,
  getWeightGoal, setWeightGoal
}
