const app = getApp()
const storage = require('../../utils/storage')

Page({
  data: { year: 0, month: 0, weekDays: ['日','一','二','三','四','五','六'], calendarDays: [], monthRecords: [] },

  onLoad() {
    const now = new Date()
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 })
    this.buildCalendar()
  },

  onShow() { this.buildCalendar() },

  prevMonth() {
    let { year, month } = this.data
    month--; if (month < 1) { month = 12; year-- }
    this.setData({ year, month }); this.buildCalendar()
  },

  nextMonth() {
    let { year, month } = this.data
    month++; if (month > 12) { month = 1; year++ }
    this.setData({ year, month }); this.buildCalendar()
  },

  buildCalendar() {
    const { year, month } = this.data
    const catId = app.globalData.currentCatId
    const records = catId ? storage.getDewormingRecords(catId) : []
    const pad = n => String(n).padStart(2, '0')
    const prefix = `${year}-${pad(month)}`
    const monthRecords = records.filter(r => r.date.startsWith(prefix))

    // 标注日期
    const dateMap = {}
    monthRecords.forEach(r => {
      const d = parseInt(r.date.split('-')[2])
      if (!dateMap[d]) dateMap[d] = {}
      if (r.type === 'internal') dateMap[d].internal = true
      else dateMap[d].external = true
    })

    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month
    const todayDate = today.getDate()

    const calendarDays = []
    for (let i = 0; i < firstDay; i++) calendarDays.push({ empty: true, day: '' })
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push({
        day: d,
        isToday: isCurrentMonth && d === todayDate,
        internal: !!(dateMap[d] && dateMap[d].internal),
        external: !!(dateMap[d] && dateMap[d].external)
      })
    }
    this.setData({ calendarDays, monthRecords })
  }
})
