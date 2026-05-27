<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { analyzeCandidate, isCozeConfigured } from './services/coze.js'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

// ---- State ----
const jdText = ref('')
const resumeText = ref('')
const loading = ref(false)
const loadStatus = ref('')
const waitCount = ref(0)
const hasResult = ref(false)
const cozeReady = ref(isCozeConfigured())

const jdPlaceholder = `【岗位名称】高级前端开发工程师

【岗位职责】
1. 负责公司 SaaS 产品前端架构设计与核心模块开发
2. 参与前端工程化建设，包括性能优化、组件库维护
3. 与产品、后端紧密协作，推动产品迭代

【任职要求】
1. 本科及以上学历，计算机相关专业
2. 5年以上前端开发经验，精通 Vue3/React/TypeScript
3. 熟悉前端性能优化，有大型项目经验优先
4. 良好的沟通能力和团队协作精神`

const resumePlaceholder = `【个人信息】
姓名：张伟 | 年龄：29岁 | 学历：本科 - 计算机科学与技术

【工作经历】
2020-至今  ABC科技有限公司 | 高级前端工程师
- 主导公司核心 SaaS 平台前端重构，使用 Vue3 + TypeScript
- 搭建组件库，覆盖 50+ 业务组件
- 首屏加载优化从 4.2s 降至 1.1s

2018-2020  XYZ 网络科技 | 前端开发工程师
- 负责电商平台 H5 及管理后台开发
- 使用 React + Redux 技术栈

【技能】
Vue3, React, TypeScript, Node.js, Webpack, Vite, ECharts, Tailwind CSS`

// ---- Analysis Result ----
const result = reactive({
  overallScore: 0,
  dimensions: [],
  riskPoints: [],
  interviewQuestions: [],
  hrSuggestions: null,
})

const mockResult = {
  overallScore: 86,
  dimensions: [
    { name: '技能匹配', score: 92, maxScore: 100 },
    { name: '经验匹配', score: 85, maxScore: 100 },
    { name: '学历匹配', score: 80, maxScore: 100 },
    { name: '薪资预期', score: 75, maxScore: 100 },
    { name: '文化契合', score: 88, maxScore: 100 },
    { name: '稳定性', score: 82, maxScore: 100 },
  ],
  riskPoints: [
    { level: 'medium', content: '最近一份工作仅 1.5 年，需关注跳槽频率' },
    { level: 'low', content: '学历为非 985/211 院校，与岗位偏好可能有偏差' },
    { level: 'medium', content: '薪资预期高于岗位预算 15%，需 HR 沟通确认' },
    { level: 'low', content: '缺少 AI/大模型相关项目经验' },
  ],
  interviewQuestions: [
    { category: '技术能力', question: '请描述你在 SaaS 平台前端重构中遇到的最大技术挑战，以及你是如何解决的？' },
    { category: '架构设计', question: '如果让你从零搭建一个支持多租户的前端架构，你会如何设计？' },
    { category: '团队协作', question: '请分享一次你与后端团队产生分歧的经历，你是如何推动达成共识的？' },
    { category: '项目管理', question: '你如何评估一个前端需求的技术可行性和开发工时？' },
    { category: '职业规划', question: '未来 3 年，你希望在前端领域深耕哪个方向？为什么？' },
  ],
  hrSuggestions: {
    summary: '候选人整体匹配度较高，技术栈与岗位要求高度吻合，有大型 SaaS 项目经验。建议进入面试环节，重点关注架构设计能力和团队协作能力。',
    strengths: [
      'Vue3 + TypeScript 技术栈与岗位完美匹配',
      '有大型 SaaS 平台重构和组件库搭建经验',
      '性能优化能力突出，有具体数据支撑',
      '沟通表达清晰，简历逻辑性强',
    ],
    weaknesses: [
      '最近一份工作年限偏短，需了解离职原因',
      '薪资预期可能高于预算，需提前沟通',
      '缺少 AI 相关项目经验',
    ],
    recommendation: '建议进入下一轮',
    nextSteps: [
      '安排技术面试，重点考察系统设计能力',
      'HR 沟通薪资预期与离职原因',
      '准备一份架构设计场景题',
      '面试后 24h 内给出反馈',
    ],
  },
}

// ---- Computed ----
const scoreColor = computed(() => {
  const s = result.overallScore
  if (s >= 80) return '#22c55e'
  if (s >= 60) return '#f59e0b'
  return '#ef4444'
})

const scoreLabel = computed(() => {
  const s = result.overallScore
  if (s >= 85) return '强烈推荐'
  if (s >= 70) return '推荐面试'
  if (s >= 55) return '可以考虑'
  return '建议淘汰'
})

// ECharts option
const barOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(51, 65, 85, 0.5)',
    textStyle: { color: '#e2e8f0', fontSize: 13 },
    formatter: (params) => {
      const p = params[0]
      return `${p.name}<br/><span style="font-weight:700;font-size:16px">${p.value} 分</span>`
    },
  },
  grid: { left: 12, right: 40, top: 8, bottom: 8, containLabel: true },
  xAxis: {
    type: 'value',
    max: 100,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.3)' } },
    axisLabel: { color: '#64748b', fontSize: 10, formatter: '{value}' },
  },
  yAxis: {
    type: 'category',
    data: result.dimensions.map(d => d.name),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#cbd5e1', fontSize: 12 },
    inverse: true,
  },
  series: [{
    type: 'bar',
    data: result.dimensions.map((d) => ({
      value: d.score,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#8b5cf6' },
          ],
        },
        borderRadius: [0, 6, 6, 0],
      },
    })),
    barWidth: 16,
    label: {
      show: true,
      position: 'right',
      color: '#94a3b8',
      fontSize: 12,
      fontWeight: 600,
      formatter: '{c}分',
    },
  }],
}))

// ---- Methods ----
async function runAnalysis() {
  if (!jdText.value.trim() || !resumeText.value.trim()) return

  loading.value = true
  hasResult.value = false
  waitCount.value = 0

  if (!cozeReady.value) {
    // Demo mode
    loadStatus.value = 'analyzing'
    await new Promise(r => setTimeout(r, 1200))
    loadStatus.value = 'parsing'
    await new Promise(r => setTimeout(r, 600))
    Object.assign(result, JSON.parse(JSON.stringify(mockResult)))
    hasResult.value = true
    loading.value = false
    loadStatus.value = ''
    return
  }

  // Real Coze API
  try {
    const data = await analyzeCandidate(jdText.value, resumeText.value, (status, count) => {
      loadStatus.value = status
      if (count) waitCount.value = count
    })
    Object.assign(result, data)
    hasResult.value = true
  } catch (e) {
    console.error('Analysis failed:', e)
    alert('分析失败: ' + e.message + '\n\n将使用 Demo 数据展示。')
    Object.assign(result, JSON.parse(JSON.stringify(mockResult)))
    hasResult.value = true
  } finally {
    loading.value = false
    loadStatus.value = ''
  }
}

// Auto-fill demo data
onMounted(() => {
  jdText.value = jdPlaceholder
  resumeText.value = resumePlaceholder
})
</script>

<template>
  <div class="min-h-screen bg-[#080c14] text-slate-200">

    <!-- ===== HEADER ===== -->
    <header class="sticky top-0 z-50 border-b border-slate-800/60 bg-[#080c14]/85 backdrop-blur-xl">
      <div class="flex items-center justify-between px-6 py-3 max-w-[1600px] mx-auto">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold tracking-tight text-white">AI HR Dashboard</h1>
              <p class="text-[11px] text-slate-500 -mt-0.5">智能招聘分析系统</p>
            </div>
          </div>
          <div :class="['px-2.5 py-0.5 rounded-full text-[11px] font-medium border', cozeReady ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30']">
            <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5" :class="cozeReady ? 'bg-emerald-400' : 'bg-amber-400'"></span>
            {{ cozeReady ? 'Coze AI' : 'Demo 模式' }}
          </div>
        </div>
        <div class="text-[11px] text-slate-600 flex items-center gap-1.5">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Powered by Coze AI
        </div>
      </div>
    </header>

    <!-- ===== MAIN ===== -->
    <main class="max-w-[1600px] mx-auto p-4 lg:p-6">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">

        <!-- ===== LEFT PANEL ===== -->
        <div class="lg:col-span-2 space-y-4">

          <!-- JD Input -->
          <div class="glass-panel p-4 lg:p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 rounded-md bg-blue-500/15 flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <label class="text-sm font-semibold text-slate-300">岗位描述</label>
              <span class="text-[11px] text-slate-600 ml-auto">{{ jdText.length }} 字</span>
            </div>
            <textarea
              v-model="jdText"
              class="glass-input w-full min-h-[170px] p-3 text-sm resize-y font-mono leading-relaxed"
              placeholder="粘贴岗位 JD..."
            ></textarea>
          </div>

          <!-- Resume Input -->
          <div class="glass-panel p-4 lg:p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 rounded-md bg-purple-500/15 flex items-center justify-center">
                <svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <label class="text-sm font-semibold text-slate-300">候选人简历</label>
              <span class="text-[11px] text-slate-600 ml-auto">{{ resumeText.length }} 字</span>
            </div>
            <textarea
              v-model="resumeText"
              class="glass-input w-full min-h-[170px] p-3 text-sm resize-y font-mono leading-relaxed"
              placeholder="粘贴候选人简历..."
            ></textarea>
          </div>

          <!-- Analyze Button -->
          <button
            class="btn-primary w-full py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2"
            :disabled="loading || !jdText.trim() || !resumeText.trim()"
            @click="runAnalysis"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {{ loading ? (loadStatus === 'waiting' ? `AI 分析中... (${waitCount}s)` : '分析中...') : '开始 AI 分析' }}
          </button>

          <!-- Loading indicator -->
          <div v-if="loading" class="glass-panel p-4 flex items-center gap-3">
            <div class="flex gap-1">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style="animation-delay:0s"></span>
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style="animation-delay:0.15s"></span>
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style="animation-delay:0.3s"></span>
            </div>
            <span class="text-sm text-slate-500">
              {{ loadStatus === 'submitting' ? '提交数据...' : loadStatus === 'analyzing' ? 'AI 分析中...' : loadStatus === 'waiting' ? `等待返回 (${waitCount}s)...` : loadStatus === 'parsing' ? '解析结果...' : '处理中...' }}
            </span>
          </div>

          <!-- Coze Config Hint -->
          <div v-if="!cozeReady" class="glass-panel p-3.5 border-amber-500/20 bg-amber-500/3">
            <p class="text-xs text-amber-400/80 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              未配置 Coze API — 当前使用 Demo 数据。编辑 <code class="text-amber-300">src/services/coze.js</code> 填入 Bot ID 和 Token。
            </p>
          </div>
        </div>

        <!-- ===== RIGHT PANEL ===== -->
        <div class="lg:col-span-3 space-y-4">

          <!-- Empty state -->
          <div v-if="!hasResult && !loading" class="glass-panel p-16 text-center">
            <div class="w-18 h-18 mx-auto mb-4 rounded-2xl bg-slate-800/40 flex items-center justify-center">
              <svg class="w-9 h-9 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 class="text-base font-semibold text-slate-500 mb-2">准备就绪</h3>
            <p class="text-sm text-slate-600 max-w-sm mx-auto">输入 JD 和简历后点击分析，AI 将生成智能匹配报告</p>
          </div>

          <!-- Results -->
          <template v-if="hasResult">
            <!-- Row 1: Score + Chart -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Score Card -->
              <div class="glass-panel p-5">
                <h3 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">综合匹配度</h3>
                <div class="flex items-center gap-5">
                  <div class="relative w-26 h-26 flex-shrink-0">
                    <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(51,65,85,0.3)" stroke-width="7"/>
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        :stroke="scoreColor"
                        stroke-width="7" stroke-linecap="round"
                        :stroke-dasharray="2 * Math.PI * 40"
                        :stroke-dashoffset="2 * Math.PI * 40 * (1 - result.overallScore / 100)"
                        class="transition-[stroke-dashoffset] duration-1000 ease-out"
                      />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <span class="text-[28px] font-extrabold text-white" :style="{ color: scoreColor }">{{ result.overallScore }}</span>
                      <span class="text-[10px] text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <div class="text-lg font-bold mb-1" :style="{ color: scoreColor }">{{ scoreLabel }}</div>
                    <p class="text-xs text-slate-500 leading-relaxed">AI 多维度<br/>综合评估</p>
                    <div :class="['inline-block mt-2 px-2 py-0.5 rounded text-[11px] font-semibold', result.overallScore >= 80 ? 'bg-emerald-500/15 text-emerald-400' : result.overallScore >= 60 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400']">
                      {{ result.hrSuggestions?.recommendation || '待定' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dimension Chart -->
              <div class="glass-panel p-5">
                <h3 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">维度评分</h3>
                <v-chart
                  v-if="result.dimensions.length"
                  :option="barOption"
                  :autoresize="true"
                  class="w-full"
                  style="height:190px"
                />
              </div>
            </div>

            <!-- Row 2: Risk + Questions -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Risk Points -->
              <div class="glass-panel p-5">
                <h3 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  风险提示
                </h3>
                <div v-if="result.riskPoints?.length" class="space-y-2">
                  <div
                    v-for="(risk, i) in result.riskPoints"
                    :key="i"
                    :class="[
                      'flex items-start gap-2.5 p-2.5 rounded-lg text-sm',
                      risk.level === 'high' ? 'bg-red-500/8 border border-red-500/20' :
                      risk.level === 'medium' ? 'bg-amber-500/8 border border-amber-500/20' :
                      'bg-blue-500/8 border border-blue-500/20'
                    ]"
                  >
                    <span :class="[
                      'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold',
                      risk.level === 'high' ? 'bg-red-500/20 text-red-400' :
                      risk.level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    ]">!</span>
                    <span class="text-slate-400 text-xs leading-relaxed">{{ risk.content }}</span>
                  </div>
                </div>
                <div v-else class="text-sm text-slate-600 text-center py-8">未发现风险</div>
              </div>

              <!-- Interview Questions -->
              <div class="glass-panel p-5">
                <h3 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  智能面试问题
                </h3>
                <div v-if="result.interviewQuestions?.length" class="space-y-2">
                  <div
                    v-for="(q, i) in result.interviewQuestions"
                    :key="i"
                    class="p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/40 transition-colors"
                  >
                    <span class="text-[10px] font-semibold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded mb-1 inline-block">
                      {{ q.category }}
                    </span>
                    <p class="text-xs text-slate-300 leading-relaxed mt-1">{{ q.question }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: HR Suggestions -->
            <div class="glass-panel p-5">
              <h3 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">HR 建议</h3>

              <div v-if="result.hrSuggestions" class="space-y-4">
                <!-- Summary -->
                <div class="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/8 to-purple-500/8 border border-blue-500/15">
                  <p class="text-sm text-slate-300 leading-relaxed">{{ result.hrSuggestions.summary }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Strengths -->
                  <div>
                    <h4 class="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      候选人优势
                    </h4>
                    <ul class="space-y-1.5">
                      <li v-for="(s, i) in result.hrSuggestions.strengths" :key="i" class="flex items-start gap-2 text-xs text-slate-400">
                        <span class="text-emerald-500 mt-1 w-1 h-1 rounded-full flex-shrink-0"></span>
                        {{ s }}
                      </li>
                    </ul>
                  </div>

                  <!-- Weaknesses -->
                  <div>
                    <h4 class="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                      需要注意
                    </h4>
                    <ul class="space-y-1.5">
                      <li v-for="(w, i) in result.hrSuggestions.weaknesses" :key="i" class="flex items-start gap-2 text-xs text-slate-400">
                        <span class="text-amber-500 mt-1 w-1 h-1 rounded-full flex-shrink-0"></span>
                        {{ w }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Next Steps -->
                <div>
                  <h4 class="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    下一步行动
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(step, i) in result.hrSuggestions.nextSteps"
                      :key="i"
                      class="px-3 py-1.5 text-xs rounded-lg bg-slate-800/50 border border-slate-700/40 text-slate-300"
                    >
                      <span class="text-slate-500 mr-1">{{ i + 1 }}.</span>{{ step }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
textarea {
  field-sizing: content;
}
</style>
