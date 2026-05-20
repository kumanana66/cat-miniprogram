const SYMPTOMS = [
  {
    id: 'vomit',
    name: '呕吐',
    level: 'medium',
    care: '禁食4-6小时，少量多次补充水分，观察呕吐物性状。若呕吐物含血丝或持续超过24小时请立即就医。',
    advice: '若偶发性呕吐（如吐毛球）属正常现象，可喂食化毛膏。频繁呕吐需就医排查肠胃炎、异物等。'
  },
  {
    id: 'diarrhea',
    name: '腹泻',
    level: 'medium',
    care: '暂停零食，喂食易消化食物，补充益生菌。保持猫砂盆清洁，观察粪便颜色。',
    advice: '腹泻超过2天、含血便或伴随精神萎靡需立即就医。'
  },
  {
    id: 'cough',
    name: '咳嗽',
    level: 'medium',
    care: '保持室内空气流通，避免烟雾刺激，观察咳嗽频率和痰液情况。',
    advice: '持续咳嗽超过3天或伴随呼吸困难需就医，排查上呼吸道感染、哮喘等。'
  },
  {
    id: 'sneeze',
    name: '打喷嚏',
    level: 'low',
    care: '保持环境清洁，减少灰尘刺激，观察鼻腔分泌物颜色。',
    advice: '偶发喷嚏属正常，若伴随流脓鼻涕、眼屎增多需就医排查猫鼻支。'
  },
  {
    id: 'no_appetite',
    name: '食欲不振',
    level: 'medium',
    care: '尝试更换口味猫粮，适当加热食物增加香气，检查食盆是否清洁。',
    advice: '超过24小时不进食需就医，尤其是幼猫和老年猫，可能存在严重疾病。'
  },
  {
    id: 'lethargy',
    name: '精神萎靡',
    level: 'high',
    care: '保持安静温暖环境，确保饮水充足，密切观察其他症状变化。',
    advice: '精神萎靡是多种严重疾病的共同症状，建议24小时内就医检查。'
  },
  {
    id: 'soft_stool',
    name: '软便',
    level: 'low',
    care: '检查近期饮食变化，减少零食，补充益生菌，观察2-3天。',
    advice: '若软便持续超过3天或转为水样腹泻需就医。'
  },
  {
    id: 'blood_urine',
    name: '血尿',
    level: 'high',
    care: '立即减少活动，确保饮水充足，记录排尿频率和尿量。',
    advice: '血尿属于紧急情况，请立即就医！可能是泌尿道感染、结石或其他严重疾病。'
  },
  {
    id: 'scratch',
    name: '频繁抓挠',
    level: 'low',
    care: '检查皮肤是否有红疹、脱毛，检查是否有跳蚤，保持皮肤清洁干燥。',
    advice: '若发现皮肤病变或大量脱毛需就医，可能是皮肤病或过敏。'
  },
  {
    id: 'eye_discharge',
    name: '眼屎增多',
    level: 'low',
    care: '用温湿棉球轻轻擦拭眼角，保持眼部清洁，避免强光刺激。',
    advice: '若眼屎呈黄绿色脓性分泌物或眼睛红肿需就医，排查结膜炎等。'
  }
]

const LEVEL_CONFIG = {
  high: { label: '高', color: '#FF3B30', tip: '建议立即就医！' },
  medium: { label: '中', color: '#FF9500', tip: '建议尽快就医观察' },
  low: { label: '低', color: '#34C759', tip: '居家观察，如加重及时就医' }
}

function getSymptomById(id) {
  return SYMPTOMS.find(s => s.id === id)
}

function analyzeSymptoms(selectedIds, customSymptom) {
  const results = selectedIds.map(id => {
    const s = getSymptomById(id)
    return s ? { ...s, levelConfig: LEVEL_CONFIG[s.level] } : null
  }).filter(Boolean)

  if (customSymptom && customSymptom.trim()) {
    results.push({
      id: 'custom',
      name: customSymptom.trim(),
      level: 'medium',
      care: '请密切观察猫咪状态变化，记录症状出现时间和频率。',
      advice: '自定义症状建议咨询专业兽医获取准确诊断。',
      levelConfig: LEVEL_CONFIG['medium']
    })
  }

  let maxLevel = 'low'
  if (results.some(r => r.level === 'high')) maxLevel = 'high'
  else if (results.some(r => r.level === 'medium')) maxLevel = 'medium'

  return { results, maxLevel, maxLevelConfig: LEVEL_CONFIG[maxLevel] }
}

module.exports = { SYMPTOMS, LEVEL_CONFIG, analyzeSymptoms }
