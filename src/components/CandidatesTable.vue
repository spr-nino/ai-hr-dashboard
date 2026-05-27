<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  candidates: Array,
  hasResult: Boolean,
  bookmarked: Set,
})
const emit = defineEmits(['toggle-bookmark'])

const showOnlyMatched = ref(false)

const filtered = computed(() => {
  if (!props.candidates) return []
  if (showOnlyMatched.value) return props.candidates.filter(c => c.result === '符合')
  return props.candidates
})

function getMatchColor(score) {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 70) return 'bg-amber-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="card overflow-hidden">
    <!-- Toolbar -->
    <div class="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-md bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-slate-700">候选人筛选结果</h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="showOnlyMatched = !showOnlyMatched"
          :class="['px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors', showOnlyMatched ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100']"
        >
          {{ showOnlyMatched ? '✓ 仅看符合' : '仅看符合' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-50">
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">候选人</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">简历</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">匹配度</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">结果</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 hidden sm:table-cell">关键优势</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 hidden md:table-cell">时间</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">操作</th>
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
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-2 sm:gap-2.5">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">{{ c.name[0] }}</div>
                <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
              </div>
            </td>
            <td class="px-3 sm:px-5 py-3 text-sm text-slate-500 whitespace-nowrap">{{ c.resume }}</td>
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-12 sm:w-16">
                  <div :class="['h-full rounded-full', getMatchColor(c.match)]" :style="{ width: c.match + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-slate-700">{{ c.match }}%</span>
              </div>
            </td>
            <td class="px-3 sm:px-5 py-3">
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap', c.resultColor]">{{ c.result }}</span>
            </td>
            <td class="px-3 sm:px-5 py-3 text-sm text-slate-500 max-w-[140px] truncate hidden sm:table-cell">{{ c.keyStrength }}</td>
            <td class="px-3 sm:px-5 py-3 text-xs text-slate-400 whitespace-nowrap hidden md:table-cell">{{ c.time }}</td>
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-1.5">
                <button class="px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">详情</button>
                <button
                  @click="emit('toggle-bookmark', c.name)"
                  :class="['w-7 h-7 flex items-center justify-center rounded-lg transition-colors', bookmarked.has(c.name) ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50']"
                  :title="bookmarked.has(c.name) ? '取消收藏' : '收藏'"
                >
                  <svg class="w-4 h-4" :fill="bookmarked.has(c.name) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="px-4 sm:px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-slate-500">
      <span>共 <b class="text-slate-700">{{ filtered.length }}</b> 条记录<span v-if="showOnlyMatched">（仅显示符合岗位的候选人）</span></span>
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
