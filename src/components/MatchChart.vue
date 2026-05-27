<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    formatter: '{b}: {c}人 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 12,
    textStyle: { color: '#64748b', fontSize: 12 },
  },
  series: [{
    type: 'pie',
    radius: ['60%', '80%'],
    center: ['42%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#fff',
      borderWidth: 3,
    },
    label: {
      show: true,
      position: 'center',
      formatter: '{total|96}\n{label|已筛选}',
      rich: {
        total: { fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 32 },
        label: { fontSize: 12, color: '#94a3b8', lineHeight: 20 },
      },
    },
    emphasis: {
      label: { show: true, fontSize: 16, fontWeight: 'bold' },
      scaleSize: 8,
    },
    data: [
      { value: 28, name: '80%以上', itemStyle: { color: '#22c55e' } },
      { value: 22, name: '60%-80%', itemStyle: { color: '#3b82f6' } },
      { value: 18, name: '40%-60%', itemStyle: { color: '#f59e0b' } },
      { value: 16, name: '20%-40%', itemStyle: { color: '#f97316' } },
      { value: 12, name: '20%以下', itemStyle: { color: '#ef4444' } },
    ],
  }],
}))
</script>

<template>
  <div class="card p-5">
    <h3 class="text-[15px] font-semibold text-slate-800 mb-2">简历匹配度分布</h3>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:280px" />
  </div>
</template>
