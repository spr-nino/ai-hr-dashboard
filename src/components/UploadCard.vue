<script setup>
</script>

<template>
  <div class="card p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-[15px] font-semibold text-slate-800">上传简历</h3>
      <span class="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg font-medium">支持批量上传</span>
    </div>

    <!-- Upload area -->
    <div class="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
        <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p class="text-sm text-slate-500 font-medium mb-3">拖拽 PDF / Word 简历到这里</p>
      <button class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
        上传文件
      </button>
    </div>

    <!-- Format badges -->
    <div class="flex gap-2 mt-3">
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">PDF</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">Word</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">DOC</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">DOCX</span>
    </div>
  </div>
</template>
