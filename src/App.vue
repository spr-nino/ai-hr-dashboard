<script setup>
import { ref, reactive, computed } from 'vue'
import Header from './components/Header.vue'
import UploadCard from './components/UploadCard.vue'
import AnalysisCard from './components/AnalysisCard.vue'
import JobInfoCard from './components/JobInfoCard.vue'
import StatsCards from './components/StatsCards.vue'
import MatchChart from './components/MatchChart.vue'
import ScreeningChart from './components/ScreeningChart.vue'
import CandidatesTable from './components/CandidatesTable.vue'
import { analyzeMatch } from './services/matcher.js'

const demoResume = `姓名：张予安 | 年龄：29岁 | 学历：本科 - 计算机科学与技术

【工作经历】
2020-至今  星河科技有限公司 | 高级产品经理
- 主导公司核心 SaaS 平台重构，DAU 提升 40%，续费率提升 18%
- 搭建数据看板，覆盖 50+ 业务指标，推动销售、运营、研发协同决策
- 负责用户调研、竞品分析、PRD 输出、项目排期和跨部门推进

2018-2020  云启网络科技 | 产品经理
- 负责电商平台商品、订单、会员模块设计，支持千万级交易规模
- 通过 A/B 测试优化转化链路，核心页面转化率提升 12%

【技能】
产品规划、用户研究、数据分析、Axure、SQL、Python、敏捷项目管理、跨团队协作`

const sampleJob = {
  title: '高级产品经理',
  location: '上海 · 浦东新区',
  type: '全职',
  skills: ['产品规划', '用户研究', '数据分析', 'SQL', '项目管理', '跨部门协作'],
  description: `1. 负责企业级 SaaS 产品的规划、需求分析、版本迭代和商业化落地。
2. 通过用户研究、数据分析和竞品洞察识别增长机会，持续优化产品体验。
3. 联动研发、设计、销售、运营团队推进项目按期交付，并对关键业务指标负责。
4. 需要 3 年以上产品经验，本科及以上学历，有 B 端或数据产品经验优先。`,
}

const jobInfo = reactive({ title: '', location: '', type: '全职', skills: [], description: '' })

function buildJdText(info) {
  return [
    `【岗位名称】${info.title}`,
    `【岗位职责】${info.description}`,
    `【任职要求】${info.skills.join('、')}`,
    `【工作地点】${info.location}`,
    `【工作性质】${info.type}`,
  ].join('\n')
}

const rawJdText = ref(buildJdText(jobInfo))
const resumeText = ref('')
const resumeFileName = ref('')
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const currentStep = ref(0)
const steps = ['文件解析', '信息抽取', '技能匹配', '综合评估', '结果生成']
const hasResult = ref(false)
const toast = ref('')

const analysisResult = reactive({
  overallScore: 0,
  dimensions: [],
  riskPoints: [],
  interviewQuestions: [],
  hrSuggestions: null,
  stats: { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 },
  candidate: null,
  distribution: [],
  screening: [],
})

const bookmarked = reactive(new Set())
const bookmarkedCandidates = computed(() => {
  if (!analysisResult.candidate) return []
  return bookmarked.has(analysisResult.candidate.name) ? [analysisResult.candidate] : []
})

function notify(message) {
  toast.value = message
  window.clearTimeout(notify.timer)
  notify.timer = window.setTimeout(() => { toast.value = '' }, 2400)
}

function onJobInfoChange(info) {
  Object.assign(jobInfo, info)
  rawJdText.value = buildJdText(info)
}

function loadSampleJob() {
  onJobInfoChange(sampleJob)
  notify('已载入示例岗位')
}

function onResumeInput(text, fileName) {
  resumeText.value = text
  resumeFileName.value = fileName || 'manual-input.txt'
}

function clearResume() {
  resumeText.value = ''
  resumeFileName.value = ''
  hasResult.value = false
  bookmarked.clear()
  notify('简历内容已清空')
}

function resetAll() {
  onJobInfoChange({ title: '', location: '', type: '全职', skills: [], description: '' })
  clearResume()
  Object.assign(analysisResult, {
    overallScore: 0,
    dimensions: [],
    riskPoints: [],
    interviewQuestions: [],
    hrSuggestions: null,
    stats: { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 },
    candidate: null,
    distribution: [],
    screening: [],
  })
  notify('工作台已重置')
}

function toggleBookmark(name) {
  if (bookmarked.has(name)) {
    bookmarked.delete(name)
    notify('已取消收藏')
  } else {
    bookmarked.add(name)
    notify('已加入收藏')
  }
}

function removeBookmark(name) {
  bookmarked.delete(name)
  notify('已移出收藏')
}

async function copyReport() {
  if (!hasResult.value || !analysisResult.candidate) {
    notify('请先完成一次分析')
    return
  }
  const report = [
    `候选人：${analysisResult.candidate.name}`,
    `匹配分：${analysisResult.overallScore}/100`,
    `建议：${analysisResult.hrSuggestions?.recommendation || '-'}`,
    `摘要：${analysisResult.hrSuggestions?.summary || '-'}`,
    `优势：${analysisResult.hrSuggestions?.strengths?.join('；') || '-'}`,
    `风险：${analysisResult.riskPoints.map(r => r.content).join('；') || '暂无'}`,
    `下一步：${analysisResult.hrSuggestions?.nextSteps?.join('；') || '-'}`,
  ].join('\n')

  try {
    await navigator.clipboard.writeText(report)
    notify('分析报告已复制')
  } catch {
    notify('当前浏览器不支持复制，请手动复制结果')
  }
}

async function runAnalysis() {
  const jd = rawJdText.value
  const resume = resumeText.value
  if (!jobInfo.title.trim() || !jobInfo.description.trim()) {
    notify('请先填写岗位名称和职责')
    return
  }
  if (!resume.trim()) {
    notify('请先粘贴候选人简历')
    return
  }

  isAnalyzing.value = true
  hasResult.value = false
  analysisProgress.value = 0
  currentStep.value = 0
  bookmarked.clear()

  const duration = 1700
  const totalSteps = duration / 34
  let ticks = 0
  const timer = window.setInterval(() => {
    ticks += 1
    analysisProgress.value = Math.min(98, Math.round((ticks / totalSteps) * 100))
    if (analysisProgress.value >= 20 && currentStep.value === 0) currentStep.value = 1
    if (analysisProgress.value >= 42 && currentStep.value === 1) currentStep.value = 2
    if (analysisProgress.value >= 62 && currentStep.value === 2) currentStep.value = 3
    if (analysisProgress.value >= 82 && currentStep.value === 3) currentStep.value = 4
  }, 34)

  await new Promise(resolve => window.setTimeout(resolve, duration))
  window.clearInterval(timer)
  analysisProgress.value = 100
  currentStep.value = 4

  const result = analyzeMatch(jd, resume)
  const candidateName = result.candidateName || '候选人'
  const isMatched = result.overallScore >= 65
  const now = new Date().toLocaleString('zh-CN', { hour12: false })

  Object.assign(analysisResult, {
    overallScore: result.overallScore,
    dimensions: result.dimensions,
    riskPoints: result.riskPoints,
    interviewQuestions: result.interviewQuestions,
    hrSuggestions: result.hrSuggestions,
    candidate: {
      name: candidateName,
      resume: resumeFileName.value || 'manual-input.txt',
      match: result.overallScore,
      result: isMatched ? '符合' : (result.overallScore >= 50 ? '待复核' : '不符合'),
      resultTone: isMatched ? 'success' : (result.overallScore >= 50 ? 'warning' : 'danger'),
      keyStrength: result.matchedSkills.length ? result.matchedSkills.slice(0, 5).join('、') : '简历已解析',
      time: now,
    },
    stats: {
      uploaded: 1,
      screened: 1,
      matched: isMatched ? 1 : 0,
      rejected: result.overallScore < 50 ? 1 : 0,
      pending: (result.overallScore >= 50 && result.overallScore < 65) ? 1 : 0,
    },
    distribution: [
      { value: result.overallScore >= 80 ? 1 : 0, name: '80% 以上', color: '#10b981' },
      { value: result.overallScore >= 60 && result.overallScore < 80 ? 1 : 0, name: '60%-80%', color: '#2563eb' },
      { value: result.overallScore >= 40 && result.overallScore < 60 ? 1 : 0, name: '40%-60%', color: '#f59e0b' },
      { value: result.overallScore >= 20 && result.overallScore < 40 ? 1 : 0, name: '20%-40%', color: '#f97316' },
      { value: result.overallScore < 20 ? 1 : 0, name: '20% 以下', color: '#ef4444' },
    ],
    screening: [
      { name: '符合岗位', value: isMatched ? 1 : 0, colors: ['#34d399', '#059669'] },
      { name: '不符合', value: result.overallScore < 50 ? 1 : 0, colors: ['#fb7185', '#e11d48'] },
      { name: '待复核', value: (result.overallScore >= 50 && result.overallScore < 65) ? 1 : 0, colors: ['#fbbf24', '#d97706'] },
      { name: '已淘汰', value: 0, colors: ['#94a3b8', '#64748b'] },
    ],
  })

  await new Promise(resolve => window.setTimeout(resolve, 220))
  isAnalyzing.value = false
  hasResult.value = true
  notify('分析完成')
}
</script>

<template>
  <div class="app-shell min-h-screen text-slate-900">
    <div class="ambient ambient-a"></div>
    <div class="ambient ambient-b"></div>
    <Header @copy-report="copyReport" @reset-all="resetAll" />

    <main class="relative z-10 w-full max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-7 space-y-5">
      <section class="hero-panel">
        <div class="space-y-3">
          <div class="eyebrow">AI Recruitment Intelligence</div>
          <h1>候选人智能初筛工作台</h1>
          <p>将岗位需求、简历解析、匹配评分和面试建议集中到一个可操作的招聘看板中。</p>
        </div>
        <div class="hero-actions">
          <button class="btn-secondary" @click="loadSampleJob">示例岗位</button>
          <button class="btn-primary" @click="copyReport">复制报告</button>
        </div>
      </section>

      <JobInfoCard
        :title="jobInfo.title"
        :location="jobInfo.location"
        :type="jobInfo.type"
        :skills="jobInfo.skills"
        :description="jobInfo.description"
        @update="onJobInfoChange"
        @load-sample="loadSampleJob"
      />

      <div class="grid grid-cols-1 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.7fr)] gap-5">
        <UploadCard
          :resume-text="resumeText"
          :resume-file-name="resumeFileName"
          :demo-resume="demoResume"
          :is-analyzing="isAnalyzing"
          @update:resume="onResumeInput"
          @analyze="runAnalysis"
          @clear="clearResume"
        />
        <AnalysisCard
          :progress="analysisProgress"
          :current-step="currentStep"
          :steps="steps"
          :is-analyzing="isAnalyzing"
          :has-result="hasResult"
          :overall-score="analysisResult.overallScore"
          :recommendation="analysisResult.hrSuggestions?.recommendation"
          :dimensions="analysisResult.dimensions"
          :risk-points="analysisResult.riskPoints"
          :interview-questions="analysisResult.interviewQuestions"
          :hr-suggestions="analysisResult.hrSuggestions"
          @copy-report="copyReport"
        />
      </div>

      <StatsCards :stats="analysisResult.stats" :has-result="hasResult" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MatchChart :distribution="analysisResult.distribution" :has-result="hasResult" :screened-count="analysisResult.stats.screened" />
        <ScreeningChart :screening="analysisResult.screening" :has-result="hasResult" />
      </div>

      <section v-if="bookmarkedCandidates.length" class="card p-4 sm:p-5 reveal">
        <div class="section-title mb-4">
          <span class="icon-badge amber">★</span>
          <div>
            <h3>收藏候选人</h3>
            <p>{{ bookmarkedCandidates.length }} 位候选人已加入重点跟进</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="c in bookmarkedCandidates" :key="'bm-' + c.name" class="bookmark-card">
            <div class="avatar">{{ c.name[0] }}</div>
            <div class="min-w-0">
              <p class="font-semibold truncate">{{ c.name }}</p>
              <p class="text-xs text-slate-500">{{ c.match }}% · {{ c.result }}</p>
            </div>
            <button class="icon-button ml-auto" title="移出收藏" @click="removeBookmark(c.name)">×</button>
          </div>
        </div>
      </section>

      <CandidatesTable
        :candidate="analysisResult.candidate"
        :has-result="hasResult"
        :bookmarked="bookmarked"
        @toggle-bookmark="toggleBookmark"
      />
    </main>

    <transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>
  </div>
</template>
