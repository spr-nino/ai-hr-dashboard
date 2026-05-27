<script setup>
</script>

<template>
  <header class="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-5 sticky top-0 z-30 shadow-sm">
    <!-- Left: logo + title -->
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div>
        <h1 class="text-sm sm:text-base font-bold text-slate-800 leading-tight">AI 简历初筛</h1>
        <p class="text-[10px] sm:text-[11px] text-slate-400 leading-tight hidden sm:block">智能招聘管理系统</p>
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-1.5 sm:gap-3">
      <button class="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <img src="https://api.dicebear.com/9.x/initials/svg?seed=HR&backgroundColor=2563FF&textColor=ffffff&fontFamily=Inter&fontWeight=600"
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100" alt="avatar" />
        <div class="hidden sm:block text-left leading-tight">
          <p class="text-xs sm:text-sm font-semibold text-slate-700">HR 李然</p>
          <p class="text-[10px] sm:text-[11px] text-slate-400">人力资源部</p>
        </div>
      </div>
    </div>
  </header>
</template>
