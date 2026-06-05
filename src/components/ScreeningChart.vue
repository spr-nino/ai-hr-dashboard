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
  { name: '符合岗位', value: 28, colors: ['#34d399', '#059669'] },
  { name: '不符合', value: 57, colors: ['#fb7185', '#e11d48'] },
  { name: '待复核', value: 11, colors: ['#fbbf24', '#d97706'] },
  { name: '已淘汰', value: 8, colors: ['#94a3b8', '#64748b'] },
]

const data = computed(() => (props.hasResult && props.screening?.length) ? props.screening : defaultData)

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
  },
  grid: { left: 0, right: 18, top: 18, bottom: 0, containLabel: true },
  xAxis: {
    type: 'category',
    data: data.value.map(item => item.name),
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#64748b', fontSize: 12, fontWeight: 600 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#eef2f7', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
  },
  series: [{
    type: 'bar',
    barWidth: 34,
    data: data.value.map(item => ({
      value: item.value,
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: item.colors[0] },
            { offset: 1, color: item.colors[1] },
          ],
        },
      },
    })),
    label: { show: true, position: 'top', color: '#334155', fontSize: 13, fontWeight: 800 },
  }],
}))
</script>

<template>
  <section class="card chart-card p-4 sm:p-5 reveal">
    <div class="section-title mb-2">
      <span class="icon-badge violet">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
        </svg>
      </span>
      <div>
        <h3>筛选状态</h3>
        <p>{{ hasResult ? '本次筛选统计' : '历史看板示例' }}</p>
      </div>
    </div>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:280px" />
  </section>
</template>
