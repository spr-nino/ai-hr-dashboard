<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  screening: Array,
  hasResult: Boolean,
})

const defaultData = [
  { name: '符合岗位', value: 28, colors: ['#22c55e', '#16a34a'] },
  { name: '不符合', value: 57, colors: ['#ef4444', '#dc2626'] },
  { name: '待复核', value: 11, colors: ['#f59e0b', '#d97706'] },
  { name: '已淘汰', value: 8, colors: ['#94a3b8', '#64748b'] },
]

const data = computed(() => {
  if (props.hasResult && props.screening?.length) return props.screening
  return defaultData
})

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: data.value.map(d => d.name),
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#64748b', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
  },
  series: [{
    type: 'bar', barWidth: 28,
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
  <div class="card p-5">
    <h3 class="text-[15px] font-semibold text-slate-800 mb-2">筛选状态分布</h3>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:280px" />
  </div>
</template>
