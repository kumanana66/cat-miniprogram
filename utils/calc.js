// 计算月龄
function getAgeInMonths(birthday) {
  if (!birthday) return 0
  const birth = new Date(birthday)
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

// 格式化年龄显示
function formatAge(birthday) {
  const months = getAgeInMonths(birthday)
  if (months < 1) return '不足1个月'
  if (months < 12) return `${months}个月`
  const years = Math.floor(months / 12)
  const m = months % 12
  return m > 0 ? `${years}岁${m}个月` : `${years}岁`
}

// 判断是否为幼猫（6个月以下）
function isKitten(birthday) {
  return getAgeInMonths(birthday) < 6
}

// 计算下次驱虫时间
function calcNextDeworming(type, cat, lastDate, isFirstVaccinated) {
  if (!lastDate) return null
  if (cat.gender === 'female' && cat.isPregnant) return null

  const last = new Date(lastDate)
  const ageMonths = getAgeInMonths(cat.birthday)
  const isOutdoor = cat.isOutdoor

  let days = 0

  if (ageMonths < 6 && !isFirstVaccinated) {
    if (type === 'internal') days = 14
    else days = 7
  } else {
    if (type === 'internal') {
      days = 90
    } else {
      days = isOutdoor ? 30 : 45
    }
  }

  const next = new Date(last)
  next.setDate(next.getDate() + days)
  return next.toISOString().split('T')[0]
}

// 距今天数（负数=已过期）
function daysFromNow(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - now) / (1000 * 60 * 60 * 24))
}

// BCS体重状态判断（保留你原来逻辑，更科学）
function getBcsStatus(cat, weight) {
  const ageMonths = getAgeInMonths(cat.birthday)
  const isSterilized = cat.isSterilized

  let idealMin, idealMax
  if (ageMonths < 3) { idealMin = 0.5; idealMax = 1.2 }
  else if (ageMonths < 6) { idealMin = 1.2; idealMax = 2.5 }
  else if (ageMonths < 12) { idealMin = 2.5; idealMax = 4.0 }
  else {
    idealMin = 3.5
    idealMax = isSterilized ? 5.5 : 5.0
  }

  let status
  if (weight < idealMin * 0.9) status = '偏瘦'
  else if (weight > idealMax * 1.1) status = '偏胖'
  else status = '标准'

  const idealMid = (idealMin + idealMax) / 2
  const diff = (weight - idealMid).toFixed(2)

  return { status, idealMin, idealMax, diff }
}


// 成猫：体重 × 3.5%
// 幼猫：体重 × 5.5%
// 偏胖 ×0.8 | 标准 ×1.0 | 偏瘦 ×1.2
function calcDailyFood(cat, weight) {
  if (!weight || weight <= 0) return 0

  const ageMonths = getAgeInMonths(cat.birthday)
  const { status } = getBcsStatus(cat, weight)

  // 1. 按年龄设定基础比例
  let basePercent = ageMonths >= 12 ? 0.035 : 0.055

  // 2. 按体型修正系数
  let factor = 1.0
  if (status === '偏胖') factor = 0.8
  if (status === '偏瘦') factor = 1.2

  // 3. 计算最终克数（kg → 克）
  const totalGram = Math.round(weight * 1000 * basePercent * factor)

  return totalGram
}

// 体重骤变分析：返回 { alert: bool, type: 'up'|'down', percent, msg }
function analyzeWeightChange(records) {
  if (records.length < 2) return null
  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
  const latest = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]
  const diff = latest.weight - prev.weight
  const percent = Math.abs(diff / prev.weight * 100)
  if (percent < 10) return null
  return {
    alert: true,
    type: diff > 0 ? 'up' : 'down',
    percent: percent.toFixed(1),
    msg: diff > 0 ? `体重骤增 ${percent.toFixed(1)}%，注意控制饮食` : `体重骤降 ${percent.toFixed(1)}%，建议就医检查`
  }
}

// 目标体重进度
function calcGoalProgress(currentWeight, goalWeight, startWeight) {
  if (!goalWeight || !startWeight) return null
  const total = Math.abs(goalWeight - startWeight)
  if (total === 0) return 100
  const done = Math.abs(currentWeight - startWeight)
  return Math.min(100, Math.round(done / total * 100))
}

// 月度报告数据
function buildMonthReport(cat, weightRecords, dewormingRecords, year, month) {
  const pad = n => String(n).padStart(2, '0')
  const prefix = `${year}-${pad(month)}`
  const wMonth = weightRecords.filter(r => r.date.startsWith(prefix))
  const dMonth = dewormingRecords.filter(r => r.date.startsWith(prefix))
  const wSorted = [...wMonth].sort((a, b) => new Date(a.date) - new Date(b.date))
  const weightChange = wSorted.length >= 2
    ? (wSorted[wSorted.length - 1].weight - wSorted[0].weight).toFixed(2)
    : null
  return {
    month: `${year}年${month}月`,
    catName: cat.name,
    weightCount: wMonth.length,
    weightStart: wSorted[0]?.weight,
    weightEnd: wSorted[wSorted.length - 1]?.weight,
    weightChange,
    dewormingCount: dMonth.length,
    dewormingList: dMonth.map(r => `${r.date} ${r.type === 'internal' ? '体内' : '体外'}${r.medicine ? '(' + r.medicine + ')' : ''}`)
  }
}

module.exports = {
  getAgeInMonths, formatAge, isKitten,
  calcNextDeworming, daysFromNow,
  getBcsStatus, calcDailyFood,
  analyzeWeightChange, calcGoalProgress, buildMonthReport
}