<script setup>
import { ref } from 'vue'

const activeMenu = ref('dashboard')

const menuItems = [
  { key: 'dashboard', label: '仪表盘', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'jobs', label: '岗位管理', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'resume', label: '简历分析', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'candidates', label: '候选人', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'reports', label: '报表', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { key: 'settings', label: '设置', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]
</script>

<template>
  <aside class="w-[240px] h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0 fixed left-0 top-0 z-40">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 class="text-[15px] font-bold text-slate-800 leading-tight">AI 简历初筛</h1>
          <p class="text-[11px] text-slate-400">智能体</p>
        </div>
      </div>
    </div>

    <!-- Nav Menu -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <div v-for="item in menuItems" :key="item.key">
        <button
          @click="activeMenu = item.key"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            activeMenu === item.key
              ? 'bg-blue-50 text-blue-600 shadow-sm'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0" :class="activeMenu === item.key ? 'text-blue-600' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="item.icon" />
          </svg>
          {{ item.label }}
        </button>
      </div>
    </nav>

    <!-- Bottom AI Card -->
    <div class="px-3 pb-4">
      <div class="relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 overflow-hidden">
        <!-- Decorative glow -->
        <div class="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
        <div class="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-cyan-300/20 blur-lg"></div>
        <!-- Robot icon -->
        <div class="relative mb-2">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p class="text-xs text-white/90 leading-relaxed mb-3">智能解读简历，<br/>助力高效招聘</p>
        <button class="px-4 py-1.5 text-xs font-semibold text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur">
          去使用
        </button>
      </div>
    </div>
  </aside>
</template>
