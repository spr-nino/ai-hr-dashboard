/**
 * Client-side resume-to-JD matching engine.
 * It keeps the demo usable without a backend by extracting skills, experience,
 * education and keyword overlap from one JD plus one resume.
 */

const STOP_WORDS = new Set([
  '的', '了', '和', '与', '及', '或', '在', '对', '为', '是', '有', '进行', '负责', '相关',
  'the', 'a', 'an', 'is', 'are', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
])

const SKILL_PATTERNS = {
  frontend: ['react', 'vue', 'angular', 'javascript', 'js', 'typescript', 'ts', 'css', 'html', 'scss', 'less', 'tailwind', 'webpack', 'vite', 'next', 'nuxt', '小程序', 'h5', '前端', '组件', 'element', 'ant design'],
  backend: ['java', 'spring', 'python', 'go', 'golang', 'node', 'express', 'koa', 'django', 'flask', 'php', 'laravel', 'c#', '.net', 'rust', 'c++', '后端', 'api', 'rest', 'graphql', 'grpc', '微服务', 'redis', 'mq', 'kafka'],
  data: ['sql', 'mysql', 'postgresql', 'mongodb', 'oracle', '数据库', 'etl', 'hadoop', 'spark', 'flink', 'clickhouse', '数据仓库', '数据湖', '数据分析', '数据挖掘', '机器学习', '算法', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'bi', 'tableau', 'finebi'],
  design: ['figma', 'sketch', 'photoshop', 'illustrator', 'ui', 'ux', '设计', '原型', '交互', '视觉', '动效', '用户体验', '用户研究'],
  product: ['产品', '需求', '用户', 'axure', '墨刀', '原型', 'prd', '竞品', '增长', 'ab测试', '项目管理', '敏捷', 'scrum', 'kanban', '迭代', '路线图'],
  mobile: ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native', 'harmonyos', '鸿蒙', '移动端', 'app'],
  devops: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'gitlab', 'github', 'linux', 'shell', 'nginx', 'devops', '运维', '监控', 'prometheus', 'grafana', 'aws', '阿里云', 'azure', 'gcp'],
  general: ['本科', '硕士', '博士', '英语', '沟通', '团队', '管理', '领导', '规划', '执行', '文档', '协作', '跨部门', '汇报', '培训', '客户', '销售', '市场', '运营', '营销', '品牌', '电商', '供应链', '财务', '法务', '人力资源', 'hr', '招聘'],
  retail: ['销售', '导购', '客户服务', '商品', '陈列', '库存', '收银', '促销', '门店', '零售', '服务', '接待', '售后', '会员', 'vip', '客户关系', '推销', '货品', '盘点', '排班'],
}

const CATEGORY_LABELS = {
  frontend: '前端开发',
  backend: '后端开发',
  data: '数据 / AI',
  design: '设计体验',
  product: '产品管理',
  mobile: '移动开发',
  devops: '工程效率',
  general: '综合能力',
  retail: '零售服务',
}

function tokenize(text) {
  return text
    .replace(/[【】（）()、，。；：:"'“”|/\\[\]{}]/g, ' ')
    .split(/[\s,，\n]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length >= 2 && !STOP_WORDS.has(s))
}

function extractSkills(text) {
  const lower = text.toLowerCase()
  const found = []
  for (const [category, keywords] of Object.entries(SKILL_PATTERNS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) found.push({ category, keyword, label: CATEGORY_LABELS[category] })
    }
  }
  const seen = new Set()
  return found.filter(skill => {
    if (seen.has(skill.keyword)) return false
    seen.add(skill.keyword)
    return true
  })
}

function extractYears(text) {
  const patterns = [
    /(\d+)\s*年(?:以上|左右)?\s*(?:工作|经验|从业)?/,
    /(?:工作|从业|经验)\s*(\d+)\s*年/,
    /(\d+)\s*\+\s*年/,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return Number.parseInt(match[1], 10)
  }
  return null
}

function extractEducation(text) {
  if (text.includes('博士')) return { level: '博士', rank: 4 }
  if (text.includes('硕士') || text.includes('研究生')) return { level: '硕士', rank: 3 }
  if (text.includes('本科') || text.includes('学士')) return { level: '本科', rank: 2 }
  if (text.includes('大专') || text.includes('专科')) return { level: '大专', rank: 1 }
  return { level: '未提及', rank: 0 }
}

function extractName(text) {
  const named = text.match(/姓名[：:]\s*([^\s|，。；、]{2,4})/)
  if (named) return named[1]
  const pipe = text.match(/^([^\s|，。；、]{2,4})\s*\|/m)
  return pipe?.[1] || null
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function analyzeMatch(jdText, resumeText) {
  const jdTokens = tokenize(jdText)
  const resumeTokens = tokenize(resumeText)
  const jdSkills = extractSkills(jdText)
  const resumeSkills = extractSkills(resumeText)
  const jdSkillSet = new Set(jdSkills.map(s => s.keyword))
  const matchedSkills = resumeSkills.filter(s => jdSkillSet.has(s.keyword))
  const jdUniqueSkills = [...jdSkillSet]

  const skillScore = jdUniqueSkills.length
    ? clampScore((matchedSkills.length / jdUniqueSkills.length) * 100)
    : 58

  const jdYears = extractYears(jdText) || 3
  const resumeYears = extractYears(resumeText) || 1
  const expScore = clampScore((resumeYears / Math.max(jdYears, 1)) * 100)

  const jdEdu = extractEducation(jdText)
  const resEdu = extractEducation(resumeText)
  const eduScore = resEdu.rank >= jdEdu.rank ? 100 : Math.max(35, resEdu.rank * 28)

  const jdTokenSet = new Set(jdTokens)
  const overlapCount = resumeTokens.filter(token => jdTokenSet.has(token)).length
  const overlapScore = jdTokens.length ? clampScore((overlapCount / jdTokens.length) * 100) : 55

  const industryScore = clampScore((skillScore * 0.65) + (overlapScore * 0.35))
  const potentialScore = clampScore((skillScore * 0.35) + (expScore * 0.25) + (eduScore * 0.20) + 18)
  const overallScore = clampScore(
    skillScore * 0.45 + expScore * 0.15 + eduScore * 0.10 + overlapScore * 0.30
  )

  const dimensions = [
    { name: '技能匹配', score: skillScore, maxScore: 100 },
    { name: '经验匹配', score: expScore, maxScore: 100 },
    { name: '学历匹配', score: eduScore, maxScore: 100 },
    { name: '关键词覆盖', score: overlapScore, maxScore: 100 },
    { name: '行业契合', score: industryScore, maxScore: 100 },
    { name: '综合潜力', score: potentialScore, maxScore: 100 },
  ]

  const missingSkills = jdSkills.filter(s => !resumeSkills.some(r => r.keyword === s.keyword)).slice(0, 4)
  const riskPoints = []
  if (resumeYears < jdYears) riskPoints.push({ level: 'medium', content: `简历经验约 ${resumeYears} 年，低于岗位要求的 ${jdYears} 年` })
  if (resEdu.rank < jdEdu.rank && jdEdu.rank > 0) riskPoints.push({ level: 'medium', content: `学历为${resEdu.level}，低于岗位要求${jdEdu.level}` })
  if (matchedSkills.length < jdUniqueSkills.length * 0.6) riskPoints.push({ level: 'high', content: '核心技能覆盖不足 60%，建议重点追问真实项目经验' })
  if (missingSkills.length && skillScore < 80) riskPoints.push({ level: 'low', content: `缺少关键能力：${missingSkills.map(s => s.keyword).join('、')}` })

  const interviewQuestions = []
  if (skillScore < 80) {
    interviewQuestions.push({
      category: '技能深挖',
      question: `岗位重点要求 ${jdSkills.slice(0, 3).map(s => s.keyword).join('、') || '核心技能'}，请候选人说明相关项目、职责和结果。`,
    })
  }
  if (expScore < 80) {
    interviewQuestions.push({
      category: '经验验证',
      question: `岗位期望 ${jdYears} 年以上经验，请候选人描述一次独立负责或主导推进的复杂任务。`,
    })
  }
  interviewQuestions.push({ category: '业务理解', question: '请候选人说明他如何理解该岗位的业务目标，以及入职后 30 天会优先做什么。' })
  interviewQuestions.push({ category: '协作能力', question: '当与跨部门伙伴意见不一致时，候选人通常如何推动达成共识？请举例。' })
  interviewQuestions.push({ category: '稳定性', question: '未来 2-3 年的职业规划是什么？希望在这个岗位上获得哪些成长？' })

  const strengths = []
  const weaknesses = []
  if (skillScore >= 70) strengths.push(`技能匹配度 ${skillScore}%，核心能力覆盖较好`)
  else weaknesses.push(`技能匹配度 ${skillScore}%，关键能力存在缺口`)
  if (expScore >= 90) strengths.push(`经验约 ${resumeYears} 年，满足或超过岗位要求`)
  else if (expScore < 70) weaknesses.push(`经验约 ${resumeYears} 年，低于岗位 ${jdYears} 年要求`)
  if (matchedSkills.length) strengths.push(`具备关键技能：${matchedSkills.slice(0, 6).map(s => s.keyword).join('、')}`)
  if (eduScore >= 100) strengths.push('学历条件符合岗位要求')

  const recommendation = overallScore >= 80
    ? '强烈推荐'
    : overallScore >= 65
      ? '推荐面试'
      : overallScore >= 50
        ? '进入复核'
        : '暂不推荐'

  return {
    overallScore,
    dimensions,
    riskPoints,
    interviewQuestions,
    candidateName: extractName(resumeText),
    matchedSkills: matchedSkills.map(s => s.keyword),
    jdSkills: jdUniqueSkills,
    hrSuggestions: {
      summary: overallScore >= 80
        ? `候选人综合匹配度 ${overallScore}%，技能、经验与岗位要求高度契合，建议优先安排面试。`
        : overallScore >= 65
          ? `候选人综合匹配度 ${overallScore}%，整体匹配良好，建议进入面试并重点验证风险项。`
          : overallScore >= 50
            ? `候选人综合匹配度 ${overallScore}%，部分条件符合，建议电话沟通后再判断。`
            : `候选人综合匹配度 ${overallScore}%，匹配度偏低，建议继续寻找更合适人选。`,
      strengths: strengths.length ? strengths : ['暂未发现突出优势'],
      weaknesses: weaknesses.length ? weaknesses : ['暂未发现显著短板'],
      recommendation,
      nextSteps: overallScore >= 70
        ? ['安排业务面试，重点验证项目深度', '同步薪资预期与到岗时间', '面试后 24 小时内形成录用建议']
        : ['建议 HR 电话初筛', '确认候选人是否适配其他岗位', '将候选人纳入人才库备用'],
    },
  }
}
