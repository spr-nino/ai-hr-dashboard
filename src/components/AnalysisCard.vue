<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  progress: Number,
  currentStep: Number,
  steps: Array,
  isAnalyzing: Boolean,
  hasResult: Boolean,
  overallScore: Number,
  recommendation: String,
  dimensions: Array,
  riskPoints: Array,
  interviewQuestions: Array,
  hrSuggestions: Object,
})
defineEmits(['copy-report'])

const scoreTone = computed(() => {
  const score = props.overallScore
  if (score >= 80) return { color: '#059669', label: '高匹配' }
  if (score >= 65) return { color: '#2563eb', label: '可推进' }
  if (score >= 50) return { color: '#d97706', label: '需复核' }
  return { color: '#e11d48', label: '低匹配' }
})

const barOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: params => `${params[0].name}<br/><b>${params[0].value} 分</b>`,
  },
  grid: { left: 8, right: 42, top: 8, bottom: 4, containLabel: true },
  xAxis: {
    type: 'value',
    max: 100,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#eef2f7' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 },
  },
  yAxis: {
    type: 'category',
    data: (props.dimensions || []).map(d => d.name),
    inverse: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#475569', fontSize: 12, fontWeight: 600 },
  },
  series: [{
    type: 'bar',
    barWidth: 13,
    data: (props.dimensions || []).map((d, index) => ({
      value: d.score,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: index % 2 ? '#2563eb' : '#14b8a6' },
            { offset: 1, color: index % 2 ? '#60a5fa' : '#5eead4' },
          ],
        },
        borderRadius: [0, 8, 8, 0],
      },
    })),
    label: { show: true, position: 'right', color: '#64748b', fontSize: 11, fontWeight: 700, formatter: '{c}' },
  }],
}))
</script>

<template>
  <section class="card p-4 sm:p-6 min-h-[520px] reveal">
    <template v-if="isAnalyzing">
      <div class="analysis-loading">
        <div>
          <p class="text-sm font-bold text-slate-600 mb-2">正在进行智能分析</p>
          <div class="flex items-end gap-2">
            <span class="text-6xl font-black tracking-tight text-slate-950">{{ progress }}</span>
            <span class="text-xl font-bold text-slate-400 mb-2">%</span>
          </div>
        </div>
        <div class="ai-orbit">
          <span>AI</span>
        </div>
      </div>

      <div class="progress-track mt-6">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="steps mt-6">
        <div v-for="(step, index) in steps" :key="step" class="step">
          <span :class="['step-dot', index <= currentStep && 'active']">
            <svg v-if="index < currentStep" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <b v-else>{{ index + 1 }}</b>
          </span>
          <span :class="index <= currentStep ? 'text-slate-800' : 'text-slate-400'">{{ step }}</span>
        </div>
      </div>
    </template>

    <template v-else-if="hasResult">
      <div class="flex flex-col xl:flex-row xl:items-center gap-5 mb-6">
        <div class="score-ring" :style="{ '--score-color': scoreTone.color, '--score': overallScore }">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" />
            <circle cx="60" cy="60" r="48" />
          </svg>
          <div>
            <strong>{{ overallScore }}</strong>
            <span>{{ scoreTone.label }}</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="result-pill" :style="{ color: scoreTone.color, backgroundColor: scoreTone.color + '14' }">{{ recommendation || '待评估' }}</span>
            <button class="mini-action" @click="$emit('copy-report')">复制报告</button>
          </div>
          <h2 class="text-xl sm:text-2xl font-black tracking-tight text-slate-950 mb-2">综合评估结果</h2>
          <p class="text-sm text-slate-600 leading-6">{{ hrSuggestions?.summary }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div class="panel-soft">
          <div class="flex items-center justify-between mb-3">
            <h3 class="subhead">维度评分</h3>
            <span class="text-xs text-slate-500">满分 100</span>
          </div>
          <v-chart v-if="dimensions?.length" :option="barOption" :autoresize="true" class="w-full" style="height:210px" />
        </div>

        <div class="space-y-3">
          <div class="panel-soft">
            <h3 class="subhead mb-2">优势亮点</h3>
            <ul class="compact-list">
              <li v-for="item in (hrSuggestions?.strengths || []).slice(0, 3)" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="panel-soft">
            <h3 class="subhead mb-2">短板与风险</h3>
            <ul v-if="riskPoints?.length" class="compact-list warning">
              <li v-for="risk in riskPoints.slice(0, 3)" :key="risk.content">{{ risk.content }}</li>
            </ul>
            <p v-else class="text-sm text-slate-500">暂未发现明显风险。</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <div class="panel-soft">
          <h3 class="subhead mb-3">面试问题建议</h3>
          <div class="space-y-2">
            <div v-for="item in interviewQuestions?.slice(0, 4)" :key="item.question" class="question-item">
              <span>{{ item.category }}</span>
              <p>{{ item.question }}</p>
            </div>
          </div>
        </div>
        <div class="panel-soft">
          <h3 class="subhead mb-3">下一步动作</h3>
          <div class="space-y-2">
            <div v-for="(step, index) in (hrSuggestions?.nextSteps || [])" :key="step" class="next-step">
              <span>{{ index + 1 }}</span>
              <p>{{ step }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty-state">
      <div class="empty-visual">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9.75 17L9 21l3-1.5L15 21l-.75-4M7 10a5 5 0 1110 0c0 2.4-1.7 4.4-4 4.9V17h-2v-2.1A5 5 0 017 10z" />
        </svg>
      </div>
      <h2>等待分析</h2>
      <p>填写岗位画像并粘贴简历后，系统会生成匹配分、风险点、面试问题和下一步建议。</p>
    </div>
  </section>
</template>
