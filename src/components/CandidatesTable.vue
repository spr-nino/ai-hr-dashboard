<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const candidates = [
  { name: '张伟', resume: '张伟-高级前端开发.pdf', match: 92, result: '符合', resultColor: 'bg-emerald-50 text-emerald-600', keyStrength: 'Vue3/TypeScript/组件库搭建', time: '2026-05-27 14:30' },
  { name: '李娜', resume: '李娜-产品经理.docx', match: 88, result: '符合', resultColor: 'bg-emerald-50 text-emerald-600', keyStrength: 'B端SaaS/数据分析/用户增长', time: '2026-05-27 13:15' },
  { name: '王强', resume: '王强-后端开发.pdf', match: 76, result: '待复核', resultColor: 'bg-amber-50 text-amber-600', keyStrength: 'Java/微服务/高并发', time: '2026-05-27 12:40' },
  { name: '赵敏', resume: '赵敏-数据分析师.pdf', match: 64, result: '不符合', resultColor: 'bg-red-50 text-red-600', keyStrength: 'SQL/Python/可视化', time: '2026-05-27 11:20' },
  { name: '陈明', resume: '陈明-全栈开发.docx', match: 95, result: '符合', resultColor: 'bg-emerald-50 text-emerald-600', keyStrength: 'React/Node.js/DevOps', time: '2026-05-27 10:05' },
  { name: '刘婷', resume: '刘婷-前端开发.pdf', match: 82, result: '符合', resultColor: 'bg-emerald-50 text-emerald-600', keyStrength: 'React Native/跨平台/CI/CD', time: '2026-05-27 09:45' },
  { name: '周磊', resume: '周磊-运维工程师.pdf', match: 55, result: '不符合', resultColor: 'bg-red-50 text-red-600', keyStrength: 'Linux/K8s/Docker', time: '2026-05-27 09:10' },
  { name: '吴芳', resume: '吴芳-UI设计师.pdf', match: 70, result: '待复核', resultColor: 'bg-amber-50 text-amber-600', keyStrength: 'Figma/设计系统/用户研究', time: '2026-05-26 17:30' },
]

const filteredCandidates = ref([...candidates])

const getMatchColor = (score) => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 70) return 'bg-amber-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="card overflow-hidden">
    <!-- Toolbar -->
    <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
      <h3 class="text-[15px] font-semibold text-slate-800">候选人筛选结果</h3>
      <div class="flex items-center gap-2.5">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索候选人..."
            class="w-52 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <button class="px-3 py-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          筛选
        </button>
        <button class="px-3 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">候选人</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">简历名称</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">匹配度</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">筛选结果</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">关键优势</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">分析时间</th>
            <th class="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(c, i) in filteredCandidates"
            :key="i"
            class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">
                  {{ c.name[0] }}
                </div>
                <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-sm text-slate-600">{{ c.resume }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-20">
                  <div :class="['h-full rounded-full', getMatchColor(c.match)]" :style="{ width: c.match + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-slate-700">{{ c.match }}%</span>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg', c.resultColor]">{{ c.result }}</span>
            </td>
            <td class="px-5 py-3.5 text-sm text-slate-600">{{ c.keyStrength }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-500">{{ c.time }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-1.5">
                <button class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">查看详情</button>
                <button class="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
      <span class="text-sm text-slate-500">共 <b class="text-slate-700">8</b> 条记录</span>
      <div class="flex items-center gap-1.5">
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white text-sm font-semibold">1</button>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 text-sm transition-colors">2</button>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>
