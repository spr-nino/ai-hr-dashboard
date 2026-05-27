<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({ distribution: Array, hasResult: Boolean, screenedCount: Number })

const defaultData = [
  { value: 28, name: '80%以上', color: '#22c55e' },
  { value: 22, name: '60%-80%', color: '#3b82f6' },
  { value: 18, name: '40%-60%', color: '#f59e0b' },
  { value: 16, name: '20%-40%', color: '#f97316' },
  { value: 12, name: '20%以下', color: '#ef4444' },
]

const data = computed(() => (props.hasResult && props.distribution?.length) ? props.distribution : defaultData)
const total = computed(() => data.value.reduce((s, d) => s + d.value, 0))

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: '#fff', borderColor: '#e8ecf1', borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    formatter: '{b}: {c}人 ({d}%)',
  },
  legend: {
    orient: 'vertical', right: 8, top: 'center',
    itemWidth: 8, itemHeight: 8, itemGap: 12,
    textStyle: { color: '#64748b', fontSize: 12 },
  },
  series: [{
    type: 'pie', radius: ['58%', '78%'], center: ['40%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 3 },
    label: {
      show: true, position: 'center',
      formatter: `{total|${total.value}}\n{label|已筛选}`,
      rich: {
        total: { fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 32 },
        label: { fontSize: 12, color: '#94a3b8', lineHeight: 20 },
      },
    },
    emphasis: { scaleSize: 8 },
    data: data.value.map(d => ({ value: d.value, name: d.name, itemStyle: { color: d.color } })),
  }],
}))
</script>

<template>
  <div class="card p-4">
    <div class="flex items-center gap-2 mb-1">
      <div class="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-slate-700">简历匹配度分布</h3>
    </div>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:260px" />
  </div>
</template>
