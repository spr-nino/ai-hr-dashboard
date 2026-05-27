<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ candidates: Array, hasResult: Boolean })
const searchQuery = ref('')

const filtered = computed(() => {
  if (!props.candidates) return []
  if (!searchQuery.value) return props.candidates
  const q = searchQuery.value.toLowerCase()
  return props.candidates.filter(c => c.name.includes(q) || c.resume.includes(q) || c.keyStrength.includes(q))
})

function getMatchColor(score) {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 70) return 'bg-amber-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-slate-700">候选人筛选结果</h3>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="搜索候选人..." class="w-44 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors" />
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-50">
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">候选人</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">简历</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">匹配度</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">结果</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">关键优势</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">时间</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-2.5">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!hasResult && !filtered.length">
            <td colspan="7" class="px-5 py-20 text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-400">填写岗位信息与简历后，点击"开始 AI 分析"</p>
            </td>
          </tr>
          <tr v-for="(c, i) in filtered" :key="i" class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
            <td class="px-5 py-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">{{ c.name[0] }}</div>
                <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
              </div>
            </td>
            <td class="px-5 py-3 text-sm text-slate-500">{{ c.resume }}</td>
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-16">
                  <div :class="['h-full rounded-full', getMatchColor(c.match)]" :style="{ width: c.match + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-slate-700">{{ c.match }}%</span>
              </div>
            </td>
            <td class="px-5 py-3">
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-md', c.resultColor]">{{ c.result }}</span>
            </td>
            <td class="px-5 py-3 text-sm text-slate-500 max-w-[160px] truncate">{{ c.keyStrength }}</td>
            <td class="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{{ c.time }}</td>
            <td class="px-5 py-3">
              <button class="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
      <span class="text-xs text-slate-500">共 <b class="text-slate-700">{{ filtered.length }}</b> 条</span>
      <div class="flex items-center gap-1">
        <button class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-500 text-white text-xs font-bold">1</button>
        <button class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>
