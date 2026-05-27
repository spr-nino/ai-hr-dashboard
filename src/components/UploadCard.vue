<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  resumeText: String, resumeFileName: String, demoResume: String, isAnalyzing: Boolean,
})
const emit = defineEmits(['update:resume', 'analyze'])

const hasResume = computed(() => (props.resumeText?.length || 0) > 0)
const showTextarea = ref(false)

function useDemoResume() {
  emit('update:resume', props.demoResume, '示例简历.txt')
  showTextarea.value = true
}
function onTextInput(e) {
  emit('update:resume', e.target.value, 'manual-input.txt')
}
</script>

<template>
  <div class="card p-5 flex flex-col h-full">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-slate-700">简历上传</h3>
    </div>

    <!-- Upload zone -->
    <div
      v-if="!hasResume && !showTextarea"
      class="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white hover:border-blue-300 hover:from-blue-50/50 hover:to-white transition-all cursor-pointer group min-h-[200px]"
      @click="showTextarea = true"
    >
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-600 mb-1">点击上传或粘贴简历</p>
      <p class="text-xs text-slate-400">支持 PDF / Word / TXT / 直接粘贴</p>
    </div>

    <!-- Textarea -->
    <div v-else class="flex-1 flex flex-col">
      <textarea
        :value="resumeText"
        @input="onTextInput"
        placeholder="在此粘贴候选人简历文本..."
        class="flex-1 min-h-[200px] p-4 text-sm resize-y border-2 border-dashed border-blue-200 rounded-2xl bg-gradient-to-b from-blue-50/30 to-white focus:outline-none focus:border-blue-400 transition-all font-mono leading-relaxed text-slate-700 placeholder:text-slate-350"
      ></textarea>
      <div v-if="resumeFileName" class="flex items-center gap-2 mt-2 text-xs text-slate-500">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        {{ resumeFileName }} &middot; {{ resumeText?.length || 0 }} 字
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 mt-3">
      <button v-if="!hasResume" @click="useDemoResume" class="px-4 py-2.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex-1">
        使用示例简历
      </button>
      <button @click="$emit('analyze')" :disabled="isAnalyzing" class="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <svg v-if="!isAnalyzing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        {{ isAnalyzing ? '分析中...' : '开始 AI 分析' }}
      </button>
    </div>
  </div>
</template>
