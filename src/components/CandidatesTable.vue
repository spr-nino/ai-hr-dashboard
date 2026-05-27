<script setup>
import { computed } from 'vue'

const props = defineProps({
  candidate: Object,
  hasResult: Boolean,
  bookmarked: Set,
})
const emit = defineEmits(['toggle-bookmark'])

const candidates = computed(() => props.candidate ? [props.candidate] : [])

function getMatchColor(score) {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 70) return 'bg-amber-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="card overflow-hidden">
    <!-- Toolbar -->
    <div class="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-100 flex items-center gap-2">
      <div class="w-6 h-6 rounded-md bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center flex-shrink-0">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-slate-700">候选人分析结果</h3>
      <span v-if="candidates.length" class="text-xs text-slate-400 ml-auto">{{ candidates.length }} 人已分析</span>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[600px]">
        <thead>
          <tr class="border-b border-slate-50">
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">候选人</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">简历</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 w-28">匹配度</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">结果</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 hidden sm:table-cell">关键技能</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 hidden md:table-cell">分析时间</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 sm:px-5 py-2.5">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!hasResult || !candidates.length">
            <td colspan="7" class="px-5 py-24 text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-400">填写岗位信息与简历后，点击"开始 AI 分析"</p>
            </td>
          </tr>
          <tr v-for="(c, i) in candidates" :key="i" class="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-2 sm:gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">{{ c.name[0] }}</div>
                <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
              </div>
            </td>
            <td class="px-3 sm:px-5 py-3 text-sm text-slate-500 whitespace-nowrap">{{ c.resume }}</td>
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-14 sm:w-20">
                  <div :class="['h-full rounded-full', getMatchColor(c.match)]" :style="{ width: c.match + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-slate-700">{{ c.match }}%</span>
              </div>
            </td>
            <td class="px-3 sm:px-5 py-3">
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap', c.resultColor]">{{ c.result }}</span>
            </td>
            <td class="px-3 sm:px-5 py-3 text-sm text-slate-500 max-w-[180px] truncate hidden sm:table-cell">{{ c.keyStrength }}</td>
            <td class="px-3 sm:px-5 py-3 text-xs text-slate-400 whitespace-nowrap hidden md:table-cell">{{ c.time }}</td>
            <td class="px-3 sm:px-5 py-3">
              <div class="flex items-center gap-1.5">
                <button
                  @click="emit('toggle-bookmark', c.name)"
                  :class="['px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors', bookmarked.has(c.name) ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100']"
                >
                  {{ bookmarked.has(c.name) ? '已收藏' : '收藏' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span>共 <b class="text-slate-700">{{ candidates.length }}</b> 条记录</span>
      <span v-if="hasResult && candidates.length" class="text-xs text-slate-400">分析基于当前输入的简历与岗位信息</span>
    </div>
  </div>
</template>
