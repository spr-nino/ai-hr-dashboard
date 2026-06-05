<script setup>
defineEmits(['copy-report', 'reset-all'])
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/60 bg-white/78 backdrop-blur-2xl">
    <div class="max-w-[1500px] mx-auto h-16 px-3 sm:px-5 lg:px-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="brand-mark">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l7.5 4.3v8.4L12 20 4.5 15.7V7.3L12 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-3.5-6L12 12l3.5-2" />
          </svg>
        </div>
        <div>
          <p class="text-sm sm:text-base font-black tracking-tight text-slate-950">AI 简历初筛</p>
          <p class="hidden sm:block text-[11px] text-slate-500">智能招聘管理系统</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <button class="icon-button hidden sm:inline-flex" title="复制分析报告" @click="$emit('copy-report')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8M8 11h8M8 15h5M6 3h9l3 3v15H6V3z" />
          </svg>
        </button>
        <button class="icon-button hidden sm:inline-flex" title="重置工作台" @click="$emit('reset-all')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0012 3M19 9A7 7 0 007 6" />
          </svg>
        </button>
        <div class="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div class="relative">
            <img
              src="https://api.dicebear.com/9.x/initials/svg?seed=HR&backgroundColor=0f172a&textColor=ffffff&fontFamily=Inter&fontWeight=700"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-sm"
              alt="avatar"
            />
            <span class="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white"></span>
          </div>
          <div class="hidden sm:block leading-tight">
            <p class="text-sm font-bold text-slate-800">HR 李然</p>
            <p class="text-[11px] text-slate-500">人才招聘部</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
