<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-30 shadow-sm">
    <!-- Left: title -->
    <div class="flex items-center gap-4">
      <h2 class="text-lg font-bold text-slate-800">仪表盘</h2>
    </div>

    <!-- Center: search -->
    <div class="flex-1 max-w-lg mx-8">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索候选人、职位、文件等"
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-3 focus:ring-blue-50 transition-all"
        />
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-3">
      <!-- Notification -->
      <button class="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>

      <!-- Help -->
      <button class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <!-- User -->
      <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200">
        <img
          src="https://api.dicebear.com/9.x/initials/svg?seed=HR&backgroundColor=2563FF&textColor=ffffff&fontFamily=Inter&fontWeight=600"
          class="w-8 h-8 rounded-xl bg-blue-100"
          alt="avatar"
        />
        <div class="hidden sm:block text-left">
          <p class="text-sm font-semibold text-slate-700">HR 李然</p>
          <p class="text-[11px] text-slate-400">人力资源部</p>
        </div>
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </header>
</template>
