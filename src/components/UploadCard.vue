<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  resumeText: String,
  resumeFileName: String,
  demoResume: String,
  isAnalyzing: Boolean,
})
const emit = defineEmits(['update:resume', 'analyze', 'clear'])

const hasResume = computed(() => (props.resumeText?.trim().length || 0) > 0)
const showTextarea = ref(false)
const quality = computed(() => {
  const len = props.resumeText?.length || 0
  if (len > 450) return { label: '信息充足', tone: 'success', width: 100 }
  if (len > 180) return { label: '可分析', tone: 'warning', width: 68 }
  return { label: '信息偏少', tone: 'danger', width: Math.max(18, Math.round(len / 180 * 50)) }
})

function useDemoResume() {
  emit('update:resume', props.demoResume, '示例简历.txt')
  showTextarea.value = true
}

function onTextInput(event) {
  emit('update:resume', event.target.value, 'manual-input.txt')
}
</script>

<template>
  <section class="card p-4 sm:p-6 flex flex-col min-h-[520px] reveal">
    <div class="section-title mb-5">
      <span class="icon-badge green">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M7 3h6l4 4v14H7V3z" />
        </svg>
      </span>
      <div>
        <h2>简历输入</h2>
        <p>粘贴候选人简历文本进行即时评估。</p>
      </div>
    </div>

    <button
      v-if="!hasResume && !showTextarea"
      class="upload-zone group"
      type="button"
      @click="showTextarea = true"
    >
      <span class="upload-icon">
        <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M7 16a4 4 0 01-.9-7.9A5 5 0 0115.9 6H16a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3" />
        </svg>
      </span>
      <span class="text-base font-bold text-slate-800">点击粘贴简历</span>
      <span class="text-sm text-slate-500">支持 PDF / Word 转文字后粘贴，也支持直接输入</span>
    </button>

    <div v-else class="flex-1 flex flex-col min-h-0">
      <textarea
        :value="resumeText"
        @input="onTextInput"
        placeholder="在此粘贴候选人简历文本。建议包含个人信息、教育背景、工作经历、项目成果、技能清单和证书奖项。"
        class="resume-textarea"
      ></textarea>
      <div class="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-semibold text-slate-700">{{ resumeFileName || 'manual-input.txt' }}</span>
          <span :class="['quality', quality.tone]">{{ quality.label }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500" :style="{ width: quality.width + '%' }"></div>
        </div>
        <div class="mt-2 flex justify-between text-[11px] text-slate-500">
          <span>{{ resumeText?.length || 0 }} 字</span>
          <button class="hover:text-red-500 transition-colors" type="button" @click="$emit('clear')">清空</button>
        </div>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button class="btn-secondary" type="button" @click="useDemoResume">示例简历</button>
      <button class="btn-primary" type="button" :disabled="isAnalyzing" @click="$emit('analyze')">
        <svg v-if="!isAnalyzing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
        {{ isAnalyzing ? '分析中' : '开始分析' }}
      </button>
    </div>
  </section>
</template>
