<script setup>
const stats = [
  { label: '已上传', value: 128, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
  { label: '已筛选', value: 96, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
  { label: '符合岗位', value: 28, color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
  { label: '不符合', value: 57, color: 'bg-red-50 text-red-600', iconBg: 'bg-red-100' },
  { label: '待复核', value: 11, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100' },
]
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <div
      v-for="(stat, i) in stats"
      :key="i"
      class="card p-4 flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', stat.iconBg]">
        <div :class="['w-2 h-2 rounded-full', stat.color.split(' ')[1]]"></div>
      </div>
      <div>
        <p class="text-2xl font-extrabold text-slate-800 tracking-tight">{{ stat.value }}</p>
        <p class="text-[13px] text-slate-500 font-medium">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>
