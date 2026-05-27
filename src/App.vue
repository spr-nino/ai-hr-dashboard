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

const demoResume = `姓名：张伟 | 年龄：29岁 | 学历：本科 - 计算机科学与技术

【工作经历】
2020-至今 ABC科技有限公司 | 高级产品经理
- 主导公司核心 SaaS 平台产品重构，DAU 提升 40%
- 搭建数据看板，覆盖 50+ 业务指标

2018-2020 XYZ 网络科技 | 产品经理
- 负责电商平台产品设计及管理后台迭代

【技能】
产品规划, 用户研究, 数据分析, Axure, SQL, Python, 跨团队协作, 项目管理`

// ---- Job Description State ----
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

function onJobInfoChange(info) {
  Object.assign(jobInfo, info)
  rawJdText.value = buildJdText(info)
}

// ---- Resume State ----
const resumeText = ref('')
const resumeFileName = ref('')
function onResumeInput(text, fileName) {
  resumeText.value = text
  resumeFileName.value = fileName || 'manual-input.txt'
}

// ---- Analysis State ----
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const currentStep = ref(0)
const steps = ['文件解析', '信息抽取', '技能匹配', '综合评估', '结果生成']
const hasResult = ref(false)

const analysisResult = reactive({
  overallScore: 0, dimensions: [], riskPoints: [], interviewQuestions: [],
  hrSuggestions: null,
  stats: { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 },
  candidate: null,
  distribution: [], screening: [],
})

// ---- Bookmarked ----
const bookmarked = reactive(new Set())
function toggleBookmark(name) {
  if (bookmarked.has(name)) bookmarked.delete(name)
  else bookmarked.add(name)
}
const bookmarkedCandidates = computed(() => {
  if (!analysisResult.candidate) return []
  return bookmarked.has(analysisResult.candidate.name) ? [analysisResult.candidate] : []
})
function removeBookmark(name) { bookmarked.delete(name) }

// ---- Run Analysis ----
async function runAnalysis() {
  const jd = rawJdText.value
  const resume = resumeText.value
  if (!jd.trim()) { alert('请先填写岗位信息'); return }
  if (!resume.trim()) { alert('请先粘贴简历文本'); return }

  isAnalyzing.value = true; hasResult.value = false; analysisProgress.value = 0; currentStep.value = 0
  bookmarked.clear()

  const duration = 1500; const totalSteps = duration / 30; let ticks = 0
  const timer = setInterval(() => {
    ticks++
    analysisProgress.value = Math.min(98, Math.round((ticks / totalSteps) * 100))
    if (analysisProgress.value >= 20 && currentStep.value === 0) currentStep.value = 1
    if (analysisProgress.value >= 40 && currentStep.value === 1) currentStep.value = 2
    if (analysisProgress.value >= 60 && currentStep.value === 2) currentStep.value = 3
    if (analysisProgress.value >= 80 && currentStep.value === 3) currentStep.value = 4
  }, 30)

  await new Promise(r => setTimeout(r, duration))
  clearInterval(timer)
  analysisProgress.value = 100; currentStep.value = 4

  // Real matching
  const result = analyzeMatch(jd, resume)

  analysisResult.overallScore = result.overallScore
  analysisResult.dimensions = result.dimensions
  analysisResult.riskPoints = result.riskPoints
  analysisResult.interviewQuestions = result.interviewQuestions
  analysisResult.hrSuggestions = result.hrSuggestions

  // Build single real candidate
  const candidateName = result.candidateName || '候选人'
  const isMatched = result.overallScore >= 65
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16)

  analysisResult.candidate = {
    name: candidateName,
    resume: resumeFileName || '简历',
    match: result.overallScore,
    result: isMatched ? '符合' : (result.overallScore >= 50 ? '待复核' : '不符合'),
    resultColor: isMatched ? 'bg-emerald-50 text-emerald-600' : (result.overallScore >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'),
    keyStrength: result.matchedSkills.length > 0 ? result.matchedSkills.slice(0, 4).join('、') : '简历已解析',
    time: now,
  }

  // Stats from real data
  analysisResult.stats = {
    uploaded: 1,
    screened: 1,
    matched: isMatched ? 1 : 0,
    rejected: result.overallScore < 50 ? 1 : 0,
    pending: (result.overallScore >= 50 && result.overallScore < 65) ? 1 : 0,
  }

  // Distribution for pie chart
  const s = result.overallScore
  analysisResult.distribution = [
    { value: s >= 80 ? 1 : 0, name: '80%以上', color: '#22c55e' },
    { value: (s >= 60 && s < 80) ? 1 : 0, name: '60%-80%', color: '#3b82f6' },
    { value: (s >= 40 && s < 60) ? 1 : 0, name: '40%-60%', color: '#f59e0b' },
    { value: (s >= 20 && s < 40) ? 1 : 0, name: '20%-40%', color: '#f97316' },
    { value: s < 20 ? 1 : 0, name: '20%以下', color: '#ef4444' },
  ]

  // Screening for bar chart
  analysisResult.screening = [
    { name: '符合岗位', value: isMatched ? 1 : 0, colors: ['#22c55e', '#16a34a'] },
    { name: '不符合', value: result.overallScore < 50 ? 1 : 0, colors: ['#ef4444', '#dc2626'] },
    { name: '待复核', value: (result.overallScore >= 50 && result.overallScore < 65) ? 1 : 0, colors: ['#f59e0b', '#d97706'] },
    { name: '已淘汰', value: 0, colors: ['#94a3b8', '#64748b'] },
  ]

  await new Promise(r => setTimeout(r, 200))
  isAnalyzing.value = false; hasResult.value = true
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f9] flex flex-col">
    <Header />
    <main class="flex-1 w-full px-3 sm:px-5 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      <!-- Job Info -->
      <JobInfoCard
        :title="jobInfo.title"
        :location="jobInfo.location"
        :type="jobInfo.type"
        :skills="jobInfo.skills"
        :description="jobInfo.description"
        @update="onJobInfoChange"
      />

      <!-- Upload + Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <UploadCard
          :resume-text="resumeText"
          :resume-file-name="resumeFileName"
          :demo-resume="demoResume"
          :is-analyzing="isAnalyzing"
          @update:resume="onResumeInput"
          @analyze="runAnalysis"
        />
        <div class="lg:col-span-2">
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
          />
        </div>
      </div>

      <!-- Stats -->
      <StatsCards :stats="analysisResult.stats" :has-result="hasResult" />

      <!-- Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <MatchChart :distribution="analysisResult.distribution" :has-result="hasResult" :screened-count="analysisResult.stats.screened" />
        <ScreeningChart :screening="analysisResult.screening" :has-result="hasResult" />
      </div>

      <!-- Bookmarked candidates -->
      <div v-if="bookmarkedCandidates.length > 0" class="card p-4 sm:p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-700">已收藏候选人 ({{ bookmarkedCandidates.length }})</h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <div v-for="c in bookmarkedCandidates" :key="'bm-' + c.name" class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-xs font-bold text-amber-700">{{ c.name[0] }}</div>
              <div>
                <p class="text-sm font-semibold text-slate-700">{{ c.name }}</p>
                <p class="text-xs text-slate-500">{{ c.match }}% · {{ c.result }}</p>
              </div>
            </div>
            <button @click="removeBookmark(c.name)" class="text-amber-500 hover:text-red-500 transition-colors text-lg leading-none">&times;</button>
          </div>
        </div>
      </div>

      <!-- Candidates Table -->
      <CandidatesTable
        :candidate="analysisResult.candidate"
        :has-result="hasResult"
        :bookmarked="bookmarked"
        @toggle-bookmark="toggleBookmark"
      />
    </main>
  </div>
</template>

<style>
.card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: box-shadow 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
