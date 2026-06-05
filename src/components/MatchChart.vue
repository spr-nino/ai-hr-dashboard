<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({ distribution: Array, hasResult: Boolean })

const defaultData = [
  { value: 28, name: '80% 以上', color: '#10b981' },
  { value: 22, name: '60%-80%', color: '#2563eb' },
  { value: 18, name: '40%-60%', color: '#f59e0b' },
  { value: 16, name: '20%-40%', color: '#f97316' },
  { value: 12, name: '20% 以下', color: '#ef4444' },
]

const data = computed(() => (props.hasResult && props.distribution?.length) ? props.distribution : defaultData)
const total = computed(() => data.value.reduce((sum, item) => sum + item.value, 0))

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: '{b}<br/><b>{c} 人</b> · {d}%',
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    itemWidth: 9,
    itemHeight: 9,
    itemGap: 14,
    textStyle: { color: '#64748b', fontSize: 12 },
  },
  series: [{
    type: 'pie',
    radius: ['56%', '76%'],
    center: ['38%', '50%'],
    itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 4 },
    label: {
      show: true,
      position: 'center',
      formatter: `{total|${total.value}}\n{label|已筛选}`,
      rich: {
        total: { fontSize: 31, fontWeight: 900, color: '#0f172a', lineHeight: 36 },
        label: { fontSize: 12, color: '#64748b', lineHeight: 20 },
      },
    },
    emphasis: { scaleSize: 7 },
    data: data.value.map(item => ({ value: item.value, name: item.name, itemStyle: { color: item.color } })),
  }],
}))
</script>

<template>
  <section class="card chart-card p-4 sm:p-5 reveal">
    <div class="section-title mb-2">
      <span class="icon-badge green">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3a9 9 0 109 9h-9V3z" />
        </svg>
      </span>
      <div>
        <h3>匹配度分布</h3>
        <p>{{ hasResult ? '基于本次分析结果' : '示例数据预览' }}</p>
      </div>
    </div>
    <v-chart :option="option" :autoresize="true" class="w-full" style="height:280px" />
  </section>
</template>
