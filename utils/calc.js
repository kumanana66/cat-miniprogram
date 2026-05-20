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

// BCS体重状态判断
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

// 每日建议喂食克数
function calcDailyFood(cat, weight) {
  const ageMonths = getAgeInMonths(cat.birthday)
  const isSterilized = cat.isSterilized
  let rer = 70 * Math.pow(weight, 0.75)
  let factor
  if (ageMonths < 6) factor = 2.5
  else if (ageMonths < 12) factor = 2.0
  else factor = isSterilized ? 1.2 : 1.4
  const dailyKcal = rer * factor
  return Math.round(dailyKcal / 350 * 100)
}

module.exports = { getAgeInMonths, formatAge, isKitten, calcNextDeworming, daysFromNow, getBcsStatus, calcDailyFood }
