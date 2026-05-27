<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({ screening: Array, hasResult: Boolean })

const defaultData = [
  { name: '符合岗位', value: 28, colors: ['#22c55e', '#16a34a'] },
  { name: '不符合', value: 57, colors: ['#ef4444', '#dc2626'] },
  { name: '待复核', value: 11, colors: ['#f59e0b', '#d97706'] },
  { name: '已淘汰', value: 8, colors: ['#94a3b8', '#64748b'] },
]

const data = computed(() => (props.hasResult && props.screening?.length) ? props.screening : defaultData)

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff', borderColor: '#e8ecf1', borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  grid: { left: 0, right: 24, top: 8, bottom: 0, containLabel: true },
  xAxis: {
    type: 'category',
    data: data.value.map(d => d.name),
    axisLine: { lineStyle: { color: '#e8ecf1' } },
    axisTick: { show: false },
    axisLabel: { color: '#64748b', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
  },
  series: [{
    type: 'bar', barWidth: 32,
    itemStyle: { borderRadius: [8, 8, 0, 0] },
    data: data.value.map(d => ({
      value: d.value,
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: d.colors[0] }, { offset: 1, color: d.colors[1] }] } },
    })),
    label: { show: true, position: 'top', color: '#64748b', fontSize: 13, fontWeight: 700 },
  }],
}))
</script>

<template>
  <div class="card p-4">
    <div class="flex items-center gap-2 mb-1">
      <div class="w-6 h-6 rounded-md bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-slate-700">筛选状态分布</h3>
    </div>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:260px" />
  </div>
</template>
