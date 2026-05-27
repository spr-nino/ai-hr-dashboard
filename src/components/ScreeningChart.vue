<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  grid: { left: 10, right: 30, top: 10, bottom: 10, containLabel: true },
  xAxis: {
    type: 'category',
    data: ['符合岗位', '不符合', '待复核', '已淘汰'],
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
    type: 'bar',
    barWidth: 28,
    itemStyle: { borderRadius: [8, 8, 0, 0] },
    data: [
      { value: 28, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#22c55e' }, { offset: 1, color: '#16a34a' }] } } },
      { value: 57, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#ef4444' }, { offset: 1, color: '#dc2626' }] } } },
      { value: 11, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#d97706' }] } } },
      { value: 8, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#94a3b8' }, { offset: 1, color: '#64748b' }] } } },
    ],
    label: {
      show: true,
      position: 'top',
      color: '#64748b',
      fontSize: 13,
      fontWeight: 700,
    },
  }],
}))
</script>

<template>
  <div class="card p-5">
    <h3 class="text-[15px] font-semibold text-slate-800 mb-2">筛选状态分布</h3>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:280px" />
  </div>
</template>
