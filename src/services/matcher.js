/**
 * Client-side resume-to-JD matching engine.
 * Takes one JD + one resume, returns real analysis for that single candidate.
 */

// ---- keyword extraction ----

function tokenize(text) {
  return text
    .replace(/[【】（）()、，。；：""''""]/g, ' ')
    .split(/[\s,，/\n]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length >= 2 && !isStopWord(s))
}

const STOP_WORDS = new Set([
  '的', '和', '与', '及', '或', '等', '在', '了', '是', '有', '为', '以', '及', '对', '等',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'and', 'or', 'in', 'on', 'at',
  'to', 'for', 'of', 'with', 'from', 'by', 'as', 'no'
])

function isStopWord(w) { return STOP_WORDS.has(w) }

const SKILL_PATTERNS = {
  frontend: ['react', 'vue', 'angular', 'javascript', 'js', 'typescript', 'ts', 'css', 'html', 'scss', 'less', 'tailwind', 'bootstrap', 'webpack', 'vite', 'next', 'nuxt', 'jquery', 'redux', 'mobx', '小程序', 'h5', '前端', 'sass', '组件', 'element', 'ant', 'svelte'],
  backend: ['java', 'spring', 'python', 'go', 'golang', 'node', 'express', 'koa', 'django', 'flask', 'ruby', 'php', 'laravel', 'c#', '.net', 'rust', 'c++', '后端', 'api', 'rest', 'graphql', 'grpc', '微服务', 'mybatis', 'hibernate', 'jpa', 'redis', 'mq', 'kafka', 'rabbitmq'],
  data: ['sql', 'mysql', 'postgresql', 'mongodb', 'oracle', '数据库', 'etl', 'hadoop', 'spark', 'flink', 'clickhouse', '数据仓库', '数据湖', '数据分析', '数据挖掘', '机器学习', '算法', 'pandas', 'numpy', 'tensorflow', 'pytorch', '建模', 'bi', 'tableau', 'finebi'],
  design: ['figma', 'sketch', 'ps', 'ai', 'photoshop', 'illustrator', 'ui', 'ux', '设计', '原型', '交互', '视觉', '动效', 'c4d', 'blender', 'ae', '用户体验', '用户研究'],
  product: ['产品', '需求', '用户', 'axure', '墨刀', '原型', 'prd', '竞品', '增长', 'ab测试', '项目管理', '敏捷', 'scrum', 'kanban', 'sprint', '迭代'],
  mobile: ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native', 'weex', 'harmonyos', '鸿蒙', '移动端', 'app'],
  devops: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'gitlab', 'github', 'linux', 'shell', 'nginx', 'devops', '运维', '监控', 'prometheus', 'grafana', 'aws', '阿里云', 'azure', 'gcp', 'terraform', 'ansible'],
  general: ['本科', '硕士', '博士', '英语', '沟通', '团队', '管理', '领导', '规划', '执行', '文档', '协作', '跨部门', '汇报', '演讲', '培训', '客户', '销售', '市场', '运营', '营销', '品牌', '电商', '供应链', '财务', '法务', '人力资源', 'hr', '招聘'],
  retail: ['销售', '导购', '客户服务', '商品', '陈列', '库存', '收银', '促销', '门店', '零售', '服务', '接待', '售后', '会员', 'vip', '客户关系', '推销', '货品', '盘点', '排班', '培训', '新人'],
}

const CATEGORY_LABELS = {
  frontend: '前端开发', backend: '后端开发', data: '数据/AI',
  design: '设计', product: '产品/管理', mobile: '移动开发',
  devops: 'DevOps', general: '综合能力', retail: '零售/服务'
}

function extractSkills(text) {
  const lower = text.toLowerCase()
  const found = []
  for (const [cat, keywords] of Object.entries(SKILL_PATTERNS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) found.push({ category: cat, keyword: kw, label: CATEGORY_LABELS[cat] })
    }
  }
  const seen = new Set()
  return found.filter(s => { const k = s.keyword; if (seen.has(k)) return false; seen.add(k); return true })
}

function extractYears(text) {
  const patterns = [
    /(\d+)\s*年(?:\s*以[上下])?\s*(?:工作|经验|从业)/,
    /(?:工作|从业)\s*(\d+)\s*年/,
    /(\d+)\s*年/,
    /(\d+)\s*以上/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return parseInt(m[1])
  }
  return null
}

function extractEducation(text) {
  if (text.includes('博士')) return { level: '博士', rank: 4 }
  if (text.includes('硕士') || text.includes('研究生')) return { level: '硕士', rank: 3 }
  if (text.includes('本科') || text.includes('学士')) return { level: '本科', rank: 2 }
  if (text.includes('大专') || text.includes('专科')) return { level: '大专', rank: 1 }
  return { level: '未知', rank: 0 }
}

function extractName(text) {
  const m = text.match(/姓名[：:]\s*([^\s|，。\n]{2,4})/)
  if (m) return m[1]
  const m2 = text.match(/([^\s|，。\n]{2,4})\s*\|/)
  if (m2) return m2[1]
  return null
}

// ---- main analysis ----

export function analyzeMatch(jdText, resumeText) {
  const jdTokens = tokenize(jdText)
  const resumeTokens = tokenize(resumeText)
  const jdSkills = extractSkills(jdText)
  const resumeSkills = extractSkills(resumeText)

  // Skill match
  const jdKeywordSet = new Set(jdSkills.map(s => s.keyword))
  const matchedSkills = resumeSkills.filter(s => jdKeywordSet.has(s.keyword))
  const jdUniqueSkills = [...new Set(jdSkills.map(s => s.keyword))]
  const skillScore = jdUniqueSkills.length > 0
    ? Math.round((matchedSkills.length / jdUniqueSkills.length) * 100)
    : 50

  // Experience match
  const jdYears = extractYears(jdText) || 3
  const resumeYears = extractYears(resumeText) || 1
  const expScore = Math.min(100, Math.round((resumeYears / Math.max(jdYears, 1)) * 100))

  // Education match
  const jdEdu = extractEducation(jdText)
  const resEdu = extractEducation(resumeText)
  const eduScore = resEdu.rank >= jdEdu.rank ? 100 : Math.max(30, resEdu.rank * 25)

  // Token overlap
  const jdTokenSet = new Set(jdTokens)
  const overlapCount = resumeTokens.filter(t => jdTokenSet.has(t)).length
  const overlapScore = jdTokens.length > 0
    ? Math.round((overlapCount / jdTokens.length) * 100)
    : 50

  // Overall score
  const overallScore = Math.round(
    skillScore * 0.45 + expScore * 0.15 + eduScore * 0.10 + overlapScore * 0.30
  )

  // Dimensions
  const dimensions = [
    { name: '技能匹配', score: skillScore, maxScore: 100 },
    { name: '经验匹配', score: expScore, maxScore: 100 },
    { name: '学历匹配', score: eduScore, maxScore: 100 },
    { name: '关键词覆盖', score: overlapScore, maxScore: 100 },
    { name: '行业契合', score: Math.round((skillScore + overlapScore) / 2), maxScore: 100 },
    { name: '综合潜力', score: Math.round(overallScore * 0.9 + 10), maxScore: 100 },
  ]

  // Risk points
  const riskPoints = []
  if (resumeYears < jdYears) riskPoints.push({ level: 'medium', content: `简历经验约 ${resumeYears} 年，低于岗位要求的 ${jdYears} 年` })
  if (resEdu.rank < jdEdu.rank && jdEdu.rank > 0) riskPoints.push({ level: 'medium', content: `学历 ${resEdu.level} 低于岗位要求 ${jdEdu.level}` })
  if (matchedSkills.length < jdUniqueSkills.length * 0.6) riskPoints.push({ level: 'high', content: `技能匹配度不足 60%，核心技能缺失较多` })
  const missingSkills = jdSkills.filter(s => !resumeSkills.map(r => r.keyword).includes(s.keyword)).slice(0, 3)
  if (missingSkills.length > 0 && skillScore < 80) riskPoints.push({ level: 'low', content: `缺少关键技能: ${missingSkills.map(s => s.keyword).join('、')}` })

  // Interview questions
  const interviewQuestions = []
  if (skillScore < 80) interviewQuestions.push({ category: '技能考察', question: `岗位要求 ${jdSkills.slice(0, 3).map(s => s.keyword).join('、')} 等技能，请描述你在这些领域的具体项目经验` })
  if (expScore < 80) interviewQuestions.push({ category: '经验考察', question: `岗位要求 ${jdYears} 年以上经验，请分享你在工作中遇到的最大挑战及解决方案` })
  interviewQuestions.push({ category: '综合能力', question: '请描述一个你主导或深度参与的项目，说明你的角色、贡献和成果' })
  interviewQuestions.push({ category: '沟通协作', question: '当与团队成员意见不一致时，你通常如何处理？请举例说明' })
  interviewQuestions.push({ category: '职业规划', question: '未来 3 年你的职业规划是什么？希望深耕哪个方向？' })

  // HR suggestions
  const strengths = []
  const weaknesses = []
  if (skillScore >= 70) strengths.push(`技能匹配度 ${skillScore}%，核心技能覆盖良好`)
  else weaknesses.push(`技能匹配仅 ${skillScore}%，关键领域有缺口`)
  if (expScore >= 90) strengths.push(`经验 ${resumeYears} 年，满足或超出岗位要求`)
  else if (expScore < 70) weaknesses.push(`经验 ${resumeYears} 年，低于岗位 ${jdYears} 年要求`)
  if (matchedSkills.length > 0) strengths.push(`具备关键技能: ${matchedSkills.slice(0, 5).map(s => s.keyword).join('、')}`)
  if (eduScore >= 100) strengths.push('学历符合或超出岗位要求')

  const recommendation = overallScore >= 80 ? '强烈推荐' : overallScore >= 65 ? '推荐面试' : overallScore >= 50 ? '可以考虑' : '建议淘汰'

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
        ? `候选人综合匹配度 ${overallScore}%，技能与经验高度匹配，建议优先安排面试`
        : overallScore >= 65
          ? `候选人综合匹配度 ${overallScore}%，整体匹配度良好，建议进入面试环节重点考察`
          : overallScore >= 50
            ? `候选人综合匹配度 ${overallScore}%，部分条件符合，建议 HR 电话沟通后再决定`
            : `候选人综合匹配度 ${overallScore}%，匹配度偏低，建议继续寻找更合适的人选`,
      strengths: strengths.length > 0 ? strengths : ['暂无突出优势'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['暂无显著问题'],
      recommendation,
      nextSteps: overallScore >= 70
        ? ['安排技术面试，重点考察项目经验和问题解决能力', 'HR 沟通薪资预期和入职时间', '面试后 24h 内反馈']
        : ['建议 HR 电话初筛沟通', '关注其他岗位匹配可能性', '将候选人纳入人才库备选'],
    },
  }
}
