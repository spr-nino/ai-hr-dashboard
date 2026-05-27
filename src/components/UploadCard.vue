<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  resumeText: String,
  resumeFileName: String,
  demoResume: String,
  isAnalyzing: Boolean,
})

const emit = defineEmits(['update:resume', 'analyze'])

const showTextarea = ref(false)
const hasResume = computed(() => (props.resumeText?.length || 0) > 0)

if (hasResume.value) showTextarea.value = true

function useDemoResume() {
  emit('update:resume', props.demoResume, '示例简历.txt')
  showTextarea.value = true
}

function onTextInput(e) {
  emit('update:resume', e.target.value, 'manual-input.txt')
}
</script>

<template>
  <div class="card p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-[15px] font-semibold text-slate-800">上传简历</h3>
      <span class="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg font-medium">粘贴文本</span>
    </div>

    <!-- Text input / Upload area -->
    <div v-if="showTextarea || hasResume" class="flex-1 flex flex-col">
      <textarea
        :value="resumeText"
        @input="onTextInput"
        placeholder="粘贴候选人简历文本..."
        class="flex-1 min-h-[180px] p-3 text-sm resize-y border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-mono leading-relaxed"
      ></textarea>
      <div v-if="resumeFileName" class="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
        {{ resumeFileName }} · {{ resumeText?.length || 0 }} 字
      </div>
    </div>
    <div v-else class="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group" @click="showTextarea = true">
      <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
        <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p class="text-sm text-slate-500 font-medium mb-1">点击此处粘贴简历文本</p>
      <p class="text-xs text-slate-400">或拖拽 PDF / Word 文件</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 mt-3">
      <button
        v-if="!hasResume"
        @click="useDemoResume"
        class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
      >
        使用示例简历
      </button>
      <button
        @click="$emit('analyze')"
        :disabled="isAnalyzing"
        class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isAnalyzing" class="flex items-center justify-center gap-1.5">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          分析中...
        </span>
        <span v-else class="flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          开始 AI 分析
        </span>
      </button>
    </div>

    <!-- Format badges -->
    <div class="flex gap-2 mt-2.5">
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">PDF</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">Word</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">TXT</span>
      <span class="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">粘贴</span>
    </div>
  </div>
</template>
