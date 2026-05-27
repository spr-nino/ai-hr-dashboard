<script setup>
import { computed } from 'vue'

const props = defineProps({ stats: Object, hasResult: Boolean })
const defaultStats = { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 }
const display = computed(() => (props.hasResult && props.stats) ? props.stats : defaultStats)

const items = computed(() => [
  { label: '已上传', value: display.value.uploaded, color: '#3b82f6', bg: 'bg-blue-50', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: '已筛选', value: display.value.screened, color: '#8b5cf6', bg: 'bg-violet-50', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
  { label: '符合岗位', value: display.value.matched, color: '#22c55e', bg: 'bg-emerald-50', icon: 'M5 13l4 4L19 7' },
  { label: '不符合', value: display.value.rejected, color: '#ef4444', bg: 'bg-red-50', icon: 'M6 18L18 6M6 6l12 12' },
  { label: '待复核', value: display.value.pending, color: '#f59e0b', bg: 'bg-amber-50', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
])
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    <div v-for="(s, i) in items" :key="i" class="card p-4 flex items-center gap-3.5 group cursor-default">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors', s.bg]">
        <svg class="w-5 h-5" :color="s.color" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon" />
        </svg>
      </div>
      <div>
        <p class="text-xl font-extrabold text-slate-800 tracking-tight leading-6">{{ s.value }}</p>
        <p class="text-[12px] text-slate-500 font-medium">{{ s.label }}</p>
      </div>
    </div>
  </div>
</template>
