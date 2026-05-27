<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  title: String, location: String, type: String, skills: Array, description: String,
})
const emit = defineEmits(['update'])

const local = reactive({ title: '', location: '', type: '全职', skills: [], description: '' })
const newSkill = reactive({ val: '' })

watch(() => props.title, v => { local.title = v }, { immediate: true })
watch(() => props.location, v => { local.location = v }, { immediate: true })
watch(() => props.type, v => { local.type = v }, { immediate: true })
watch(() => props.skills, v => { local.skills = [...(v || [])] }, { immediate: true, deep: true })
watch(() => props.description, v => { local.description = v }, { immediate: true })

function emitUpdate() {
  emit('update', { title: local.title, location: local.location, type: local.type, skills: [...local.skills], description: local.description })
}
function addSkill() {
  const s = newSkill.val.trim()
  if (s && !local.skills.includes(s)) { local.skills.push(s); newSkill.val = ''; emitUpdate() }
}
function removeSkill(i) { local.skills.splice(i, 1); emitUpdate() }
</script>

<template>
  <div class="card p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-center gap-2.5 mb-5">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <h2 class="text-base sm:text-lg font-bold text-slate-800">岗位信息</h2>
        <p class="text-xs text-slate-400">填写招聘岗位的详细要求，系统将据此匹配候选人简历</p>
      </div>
    </div>

    <!-- Fields grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Title -->
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">岗位名称 <span class="text-red-400">*</span></label>
        <input
          v-model="local.title"
          @input="emitUpdate()"
          placeholder="例：高级前端工程师、产品经理、服装导购..."
          class="w-full text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-350"
        />
      </div>

      <!-- Location + Type -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">工作地点</label>
          <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <input v-model="local.location" @input="emitUpdate()" placeholder="上海·浦东新区" class="w-full text-sm text-slate-600 bg-transparent outline-none placeholder:text-slate-350" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">工作性质</label>
          <select v-model="local.type" @change="emitUpdate()" class="w-full text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 outline-none cursor-pointer">
            <option value="全职">全职</option>
            <option value="兼职">兼职</option>
            <option value="实习">实习</option>
            <option value="合同">合同</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Skills -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">任职要求 / 技能标签</label>
      <div class="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all min-h-[48px] items-center">
        <span v-for="(s, i) in local.skills" :key="i" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
          {{ s }}
          <button @click="removeSkill(i)" class="text-slate-400 hover:text-red-500 transition-colors leading-none text-sm">&times;</button>
        </span>
        <input
          v-model="newSkill.val"
          @keyup.enter="addSkill"
          placeholder="输入技能后回车添加..."
          class="flex-1 min-w-[140px] text-sm text-slate-600 bg-transparent outline-none placeholder:text-slate-350"
        />
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">岗位职责 <span class="text-red-400">*</span></label>
      <textarea
        v-model="local.description"
        @input="emitUpdate()"
        placeholder="请详细描述岗位职责、工作内容、任职资格等...&#10;&#10;例如：&#10;1. 负责公司核心产品线的规划与迭代&#10;2. 通过数据驱动的方式持续优化产品体验&#10;3. 推动跨部门协作，确保项目按时交付&#10;..."
        rows="8"
        class="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-350 resize-y leading-relaxed"
      ></textarea>
      <p class="text-[11px] text-slate-400 mt-1.5">{{ local.description.length }} 字 — 越详细的岗位描述，匹配结果越精准</p>
    </div>
  </div>
</template>
