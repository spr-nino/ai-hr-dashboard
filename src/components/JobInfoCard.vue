<script setup>
</script>

<template>
  <div class="card overflow-hidden">
    <!-- Cover image -->
    <div class="h-28 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=200&fit=crop&crop=center"
        class="w-full h-full object-cover"
        alt="office"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="text-lg font-bold text-slate-800 mb-2">高级产品经理（社招）</h3>

      <div class="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          上海 · 浦东新区
        </span>
        <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-medium">全职</span>
      </div>

      <!-- Skill tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100">5年以上经验</span>
        <span class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100">产品规划</span>
        <span class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100">用户研究</span>
        <span class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100">数据分析</span>
        <span class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100">跨团队协作</span>
      </div>

      <p class="text-xs text-slate-400 leading-relaxed">
        负责公司核心产品线的规划与迭代，通过数据驱动的方式持续优化产品体验，推动业务增长。
      </p>
    </div>
  </div>
</template>

