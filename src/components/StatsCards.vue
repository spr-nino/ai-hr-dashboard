<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: Object,
  hasResult: Boolean,
})

const defaultStats = { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 }

const display = computed(() => (props.hasResult && props.stats) ? props.stats : defaultStats)

const items = computed(() => [
  { label: '已上传', value: display.value.uploaded, iconBg: 'bg-blue-100', dotClass: 'bg-blue-500' },
  { label: '已筛选', value: display.value.screened, iconBg: 'bg-green-100', dotClass: 'bg-green-500' },
  { label: '符合岗位', value: display.value.matched, iconBg: 'bg-emerald-100', dotClass: 'bg-emerald-500' },
  { label: '不符合', value: display.value.rejected, iconBg: 'bg-red-100', dotClass: 'bg-red-500' },
  { label: '待复核', value: display.value.pending, iconBg: 'bg-amber-100', dotClass: 'bg-amber-500' },
])
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <div
      v-for="(stat, i) in items"
      :key="i"
      class="card p-4 flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', stat.iconBg]">
        <div :class="['w-2.5 h-2.5 rounded-full', stat.dotClass]"></div>
      </div>
      <div>
        <p class="text-2xl font-extrabold text-slate-800 tracking-tight">{{ stat.value }}</p>
        <p class="text-[13px] text-slate-500 font-medium">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>
