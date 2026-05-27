<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  progress: Number, currentStep: Number, steps: Array, isAnalyzing: Boolean,
  hasResult: Boolean, overallScore: Number, recommendation: String,
  dimensions: Array, riskPoints: Array, interviewQuestions: Array, hrSuggestions: Object,
})

const scoreColor = computed(() => {
  const s = props.overallScore
  if (s >= 80) return '#22c55e'
  if (s >= 60) return '#f59e0b'
  return '#ef4444'
})

const barOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff', borderColor: '#e8ecf1', borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    formatter: (params) => `${params[0].name}<br/><span style="font-weight:700;font-size:16px">${params[0].value} 分</span>`,
  },
  grid: { left: 8, right: 36, top: 4, bottom: 4, containLabel: true },
  xAxis: {
    type: 'value', max: 100,
    axisLine: { show: false }, axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f1f5f9' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 },
  },
  yAxis: {
    type: 'category',
    data: (props.dimensions || []).map(d => d.name),
    axisLine: { show: false }, axisTick: { show: false },
    axisLabel: { color: '#64748b', fontSize: 12 },
    inverse: true,
  },
  series: [{
    type: 'bar', barWidth: 14,
    data: (props.dimensions || []).map(d => ({
      value: d.score,
      itemStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#a855f7' }] },
        borderRadius: [0, 6, 6, 0],
      },
    })),
    label: { show: true, position: 'right', color: '#64748b', fontSize: 11, fontWeight: 600, formatter: '{c}分' },
  }],
}))
</script>

<template>
  <div class="card p-5 h-full relative overflow-hidden">
    <!-- ANALYZING -->
    <template v-if="isAnalyzing">
      <div class="flex items-center gap-4 mb-5">
        <span class="text-5xl font-extrabold text-slate-900 tracking-tight">{{ progress }}%</span>
        <div>
          <p class="text-sm font-semibold text-slate-700">正在智能分析中...</p>
          <p class="text-xs text-slate-400 mt-0.5">AI 正在解析简历内容、识别关键信息与岗位匹配度</p>
        </div>
        <div class="relative w-12 h-12 flex-shrink-0 ml-auto">
          <div class="absolute inset-0 rounded-full border-2 border-blue-100 animate-rotate-glow"></div>
          <div class="absolute inset-1.5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-400/30">
            <span class="text-[10px] font-extrabold text-white">AI</span>
          </div>
        </div>
      </div>
      <div class="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" :style="{ width: progress + '%' }">
          <div class="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-30deg] animate-pulse"></div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div v-for="(step, i) in (steps || [])" :key="i" class="flex items-center gap-1.5">
          <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300', i <= currentStep ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-slate-100 text-slate-400']">
            <svg v-if="i < currentStep" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span :class="['text-[11px] font-medium transition-colors', i <= currentStep ? 'text-slate-700' : 'text-slate-400']">{{ step }}</span>
          <div v-if="i < steps.length - 1" :class="['w-3 lg:w-6 h-0.5 rounded transition-colors', i < currentStep ? 'bg-blue-400' : 'bg-slate-200']"></div>
        </div>
      </div>
    </template>

    <!-- RESULT -->
    <template v-else-if="hasResult">
      <div class="flex items-center gap-4 mb-4">
        <div class="relative w-20 h-20 flex-shrink-0">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" stroke-width="6"/>
            <circle cx="50" cy="50" r="38" fill="none" :stroke="scoreColor" stroke-width="6" stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 38"
              :stroke-dashoffset="2 * Math.PI * 38 * (1 - overallScore / 100)"
              class="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-xl font-extrabold text-slate-800" :style="{ color: scoreColor }">{{ overallScore }}</span>
            <span class="text-[9px] text-slate-400">/ 100</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold mb-0.5" :style="{ color: scoreColor }">{{ recommendation || '待评估' }}</div>
          <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">{{ hrSuggestions?.summary || '' }}</p>
        </div>
        <div v-if="recommendation" :class="['px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0', overallScore >= 80 ? 'bg-emerald-50 text-emerald-600' : overallScore >= 60 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600']">
          {{ recommendation }}
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4 space-y-4">
        <div>
          <h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">维度评分</h4>
          <v-chart v-if="dimensions?.length" :option="barOption" :autoresize="true" class="w-full" style="height:150px" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">风险提示</h4>
            <div v-if="riskPoints?.length" class="space-y-1.5">
              <div v-for="(r, i) in riskPoints.slice(0, 3)" :key="i" :class="['text-xs p-2 rounded-lg', r.level === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : r.level === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-blue-50 text-blue-700 border border-blue-100']">{{ r.content }}</div>
            </div>
            <p v-else class="text-xs text-slate-400">未发现风险</p>
          </div>
          <div>
            <h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">面试问题建议</h4>
            <div v-if="interviewQuestions?.length" class="space-y-1.5">
              <div v-for="(q, i) in interviewQuestions.slice(0, 3)" :key="i" class="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                <span class="font-semibold text-indigo-500">{{ q.category }}：</span>{{ q.question }}
              </div>
            </div>
            <p v-else class="text-xs text-slate-400">暂无建议</p>
          </div>
        </div>
      </div>
    </template>

    <!-- EMPTY -->
    <div v-else class="flex flex-col items-center justify-center py-10 text-center h-full">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-500 mb-1">准备就绪</p>
      <p class="text-xs text-slate-400">填写岗位信息与简历后，点击"开始 AI 分析"开始</p>
    </div>
  </div>
</template>
