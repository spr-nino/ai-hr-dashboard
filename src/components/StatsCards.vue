<script setup>
import { computed } from 'vue'

const props = defineProps({ stats: Object, hasResult: Boolean })
const defaultStats = { uploaded: 0, screened: 0, matched: 0, rejected: 0, pending: 0 }
const display = computed(() => (props.hasResult && props.stats) ? props.stats : defaultStats)

const items = computed(() => [
  { label: '已上传', value: display.value.uploaded, tone: 'blue', icon: 'M7 16a4 4 0 01-.9-7.9A5 5 0 0115.9 6H16a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3' },
  { label: '已筛选', value: display.value.screened, tone: 'violet', icon: 'M3 4h18l-7 8v6l-4 2v-8L3 4z' },
  { label: '符合岗位', value: display.value.matched, tone: 'green', icon: 'M5 13l4 4L19 7' },
  { label: '不符合', value: display.value.rejected, tone: 'red', icon: 'M6 18L18 6M6 6l12 12' },
  { label: '待复核', value: display.value.pending, tone: 'amber', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
])
</script>

<template>
  <section class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
    <div v-for="item in items" :key="item.label" :class="['metric-card', item.tone]">
      <div class="metric-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
        </svg>
      </div>
      <div>
        <p>{{ item.value }}</p>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>
