<script setup>
import { ref, reactive } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import UploadCard from './components/UploadCard.vue'
import AnalysisCard from './components/AnalysisCard.vue'
import JobInfoCard from './components/JobInfoCard.vue'
import StatsCards from './components/StatsCards.vue'
import MatchChart from './components/MatchChart.vue'
import ScreeningChart from './components/ScreeningChart.vue'
import CandidatesTable from './components/CandidatesTable.vue'
import { analyzeMatch, generateCandidateResults } from './services/matcher.js'

const sidebarOpen = ref(true)
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

// ---- Demo resume ----
const demoResume = `【个人信息】
姓名：张伟 | 年龄：29岁 | 学历：本科 - 计算机科学与技术

【工作经历】
2020-至今 ABC科技有限公司 | 高级产品经理
- 主导公司核心 SaaS 平台产品重构，DAU 提升 40%
- 搭建数据看板，覆盖 50+ 业务指标
- 推动跨部门协作，项目交付周期缩短 30%

2018-2020 XYZ 网络科技 | 产品经理
- 负责电商平台产品设计及管理后台迭代
- 使用数据分析驱动产品决策

【技能】
产品规划, 用户研究, 数据分析, Axure, SQL, Python, 跨团队协作, 项目管理`

// ---- Job Description State ----
const jobInfo = reactive({
  title: '高级产品经理（社招）',
  location: '上海 · 浦东新区',
  type: '全职',
  skills: ['5年以上经验', '产品规划', '用户研究', '数据分析', '跨团队协作'],
  description: '负责公司核心产品线的规划与迭代，通过数据驱动的方式持续优化产品体验，推动业务增长。',
})

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
const resumeText = ref(demoResume)
const resumeFileName = ref('张伟-高级产品经理.txt')

function onResumeInput(text, fileName) {
  resumeText.value = text
  resumeFileName.value = fileName || 'manual-input.txt'
}

// ---- Analysis State ----
const isAnalyzing = ref(false)
const analysisProgress = ref(0)
const currentStep = ref(0)
const steps = ['文件解析', '信息抽取', '技能匹配', '综合评估', '结果生成']
const hasResult = ref(true)

const analysisResult = reactive({
  overallScore: 0,
  dimensions: [],
  riskPoints: [],
  interviewQuestions: [],
  hrSuggestions: null,
  stats: { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 },
  candidates: [],
  distribution: [],
  screening: [],
})

// ---- Actions ----
async function runAnalysis() {
  const jd = rawJdText.value
  const resume = resumeText.value

  if (!jd.trim()) { alert('请填写岗位信息'); return }
  if (!resume.trim()) { alert('请粘贴简历文本'); return }

  isAnalyzing.value = true
  hasResult.value = false
  analysisProgress.value = 0
  currentStep.value = 0

  const duration = 1500
  const totalSteps = duration / 30
  let ticks = 0

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
  analysisProgress.value = 100
  currentStep.value = 4

  // Real matching with our engine
  const baseResult = analyzeMatch(jd, resume)
  const fullResult = generateCandidateResults(jd, resume)

  analysisResult.overallScore = baseResult.overallScore
  analysisResult.dimensions = baseResult.dimensions
  analysisResult.riskPoints = baseResult.riskPoints
  analysisResult.interviewQuestions = baseResult.interviewQuestions
  analysisResult.hrSuggestions = baseResult.hrSuggestions
  analysisResult.stats = fullResult.stats
  analysisResult.candidates = fullResult.candidates
  analysisResult.distribution = fullResult.distribution
  analysisResult.screening = fullResult.screening

  await new Promise(r => setTimeout(r, 200))
  isAnalyzing.value = false
  hasResult.value = true
}

// Run initial analysis on mount
import { onMounted } from 'vue'
onMounted(() => {
  runAnalysis()
})
</script>

<template>
  <div class="min-h-screen bg-[#f5f7fa]">
    <Sidebar v-if="sidebarOpen" />
    <div :class="['transition-all duration-300', sidebarOpen ? 'ml-[240px]' : 'ml-0']">
      <Header @toggle-sidebar="toggleSidebar" />
      <main class="p-5 space-y-5">
        <!-- Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-3">
            <UploadCard
              :resume-text="resumeText"
              :resume-file-name="resumeFileName"
              :demo-resume="demoResume"
              :is-analyzing="isAnalyzing"
              @update:resume="onResumeInput"
              @analyze="runAnalysis"
            />
          </div>
          <div class="lg:col-span-5">
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
          <div class="lg:col-span-4">
            <JobInfoCard
              :title="jobInfo.title"
              :location="jobInfo.location"
              :type="jobInfo.type"
              :skills="jobInfo.skills"
              :description="jobInfo.description"
              @update="onJobInfoChange"
            />
          </div>
        </div>

        <!-- Row 2: Stats -->
        <StatsCards :stats="analysisResult.stats" :has-result="hasResult" />

        <!-- Row 3: Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MatchChart :distribution="analysisResult.distribution" :has-result="hasResult" :screened-count="analysisResult.stats.screened" />
          <ScreeningChart :screening="analysisResult.screening" :has-result="hasResult" />
        </div>

        <!-- Row 4: Table -->
        <CandidatesTable :candidates="analysisResult.candidates" :has-result="hasResult" />
      </main>
    </div>
  </div>
</template>

<style>
.card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
}
</style>
