<script setup>
import { computed } from 'vue'

const props = defineProps({
  candidate: Object,
  hasResult: Boolean,
  bookmarked: Set,
})
const emit = defineEmits(['toggle-bookmark'])

const candidates = computed(() => props.candidate ? [props.candidate] : [])

function getMatchTone(score) {
  if (score >= 80) return 'success'
  if (score >= 65) return 'blue'
  if (score >= 50) return 'warning'
  return 'danger'
}
</script>

<template>
  <section class="card overflow-hidden reveal">
    <div class="table-toolbar">
      <div class="section-title">
        <span class="icon-badge slate">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.4-1.8M17 20H7m10 0v-2c0-.6-.1-1.2-.4-1.8M7 20H2v-2a3 3 0 015.4-1.8M7 20v-2c0-.6.1-1.2.4-1.8m0 0a5 5 0 019.2 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </span>
        <div>
          <h3>候选人分析结果</h3>
          <p>{{ candidates.length ? `${candidates.length} 人已分析` : '等待分析数据' }}</p>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="result-table">
        <thead>
          <tr>
            <th>候选人</th>
            <th>简历</th>
            <th class="w-36">匹配度</th>
            <th>结果</th>
            <th class="hidden sm:table-cell">关键能力</th>
            <th class="hidden md:table-cell">分析时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!hasResult || !candidates.length">
            <td colspan="7" class="empty-row">
              <div class="empty-visual small">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M17 20H7m10 0v-2a5 5 0 00-10 0v2m10 0h5v-2a3 3 0 00-4.5-2.6M7 20H2v-2a3 3 0 014.5-2.6M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p>填写岗位信息与简历后，点击开始分析。</p>
            </td>
          </tr>
          <tr v-for="candidate in candidates" :key="candidate.name">
            <td>
              <div class="candidate-cell">
                <div class="avatar">{{ candidate.name[0] }}</div>
                <div>
                  <p>{{ candidate.name }}</p>
                  <span>单候选人评估</span>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap text-slate-500">{{ candidate.resume }}</td>
            <td>
              <div class="match-cell">
                <div class="meter">
                  <div :class="getMatchTone(candidate.match)" :style="{ width: candidate.match + '%' }"></div>
                </div>
                <strong>{{ candidate.match }}%</strong>
              </div>
            </td>
            <td>
              <span :class="['status-pill', candidate.resultTone]">{{ candidate.result }}</span>
            </td>
            <td class="hidden sm:table-cell max-w-[220px] truncate text-slate-500">{{ candidate.keyStrength }}</td>
            <td class="hidden md:table-cell whitespace-nowrap text-xs text-slate-400">{{ candidate.time }}</td>
            <td>
              <button
                :class="['icon-button', bookmarked.has(candidate.name) && 'bookmarked']"
                :title="bookmarked.has(candidate.name) ? '取消收藏' : '收藏候选人'"
                @click="emit('toggle-bookmark', candidate.name)"
              >
                <svg class="w-4 h-4" :fill="bookmarked.has(candidate.name) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.5 4.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4L7 18.2l.9-5-3.6-3.5 5-.7 2.2-4.5z" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span>共 <b>{{ candidates.length }}</b> 条记录</span>
      <span v-if="hasResult && candidates.length">分析基于当前岗位信息与简历文本</span>
    </div>
  </section>
</template>
