<script setup>
import { ref, onMounted } from 'vue'

const progress = ref(0)
const currentStep = ref(0)

const steps = ['文件解析', '信息抽取', '技能匹配', '综合评估', '结果生成']

onMounted(() => {
  const timer = setInterval(() => {
    if (progress.value < 72) {
      progress.value += 1
    }
    if (progress.value >= 20 && currentStep.value === 0) currentStep.value = 1
    if (progress.value >= 40 && currentStep.value === 1) currentStep.value = 2
    if (progress.value >= 60 && currentStep.value === 2) currentStep.value = 3
    if (progress.value >= 70 && currentStep.value === 3) currentStep.value = 4
  }, 60)
  return () => clearInterval(timer)
})
</script>

<template>
  <div class="card p-5 relative overflow-hidden">
    <!-- Top: progress number + status -->
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-4">
        <span class="text-5xl font-extrabold text-slate-900 tracking-tight">{{ progress }}%</span>
        <div>
          <p class="text-sm font-semibold text-slate-700">正在智能分析中...</p>
          <p class="text-xs text-slate-400 mt-0.5">AI 正在解析简历内容、识别关键信息与岗位匹配度</p>
        </div>
      </div>
      <!-- AI Ring -->
      <div class="relative w-14 h-14 flex-shrink-0">
        <div class="absolute inset-0 rounded-full border-2 border-blue-100 animate-rotate-glow"></div>
        <div class="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-400/30">
          <span class="text-[11px] font-extrabold text-white">AI</span>
        </div>
        <div class="absolute -inset-1 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-300 animate-rotate-glow" style="animation-duration:1.5s"></div>
      </div>
    </div>

    <!-- Progress bar with glow -->
    <div class="relative h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(37,99,255,0.4)]"
        :style="{ width: progress + '%' }"
      >
        <!-- Flow light effect -->
        <div class="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg]" style="animation: flow-light 2s ease-in-out infinite"></div>
      </div>
      <!-- Particles -->
      <div class="absolute top-1/2 -translate-y-1/2" :style="{ left: progress + '%' }">
        <span class="absolute w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
        <span class="absolute w-1.5 h-1.5 rounded-full bg-blue-500"></span>
      </div>
    </div>

    <!-- Step progress -->
    <div class="flex items-center justify-between">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="flex items-center gap-2"
      >
        <div :class="[
          'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300',
          i <= currentStep
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
            : 'bg-slate-100 text-slate-400'
        ]">
          <svg v-if="i < currentStep" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span :class="[
          'text-xs font-medium transition-colors',
          i <= currentStep ? 'text-slate-700' : 'text-slate-400'
        ]">{{ step }}</span>
        <div v-if="i < steps.length - 1" :class="[
          'w-6 lg:w-10 h-0.5 rounded transition-colors',
          i < currentStep ? 'bg-blue-400' : 'bg-slate-200'
        ]"></div>
      </div>
    </div>
  </div>
</template>
