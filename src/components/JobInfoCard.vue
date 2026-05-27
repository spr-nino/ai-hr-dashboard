<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  title: String, location: String, type: String, skills: Array, description: String,
})
const emit = defineEmits(['update'])

const local = reactive({ title: '', location: '', type: '全职', skills: [], description: '' })
const showSkillInput = reactive({ val: '' })

watch(() => props.title, v => { local.title = v }, { immediate: true })
watch(() => props.location, v => { local.location = v }, { immediate: true })
watch(() => props.type, v => { local.type = v }, { immediate: true })
watch(() => props.skills, v => { local.skills = [...(v || [])] }, { immediate: true, deep: true })
watch(() => props.description, v => { local.description = v }, { immediate: true })

function emitUpdate() {
  emit('update', { title: local.title, location: local.location, type: local.type, skills: [...local.skills], description: local.description })
}
function addSkill() {
  const s = showSkillInput.val.trim()
  if (s && !local.skills.includes(s)) { local.skills.push(s); showSkillInput.val = ''; emitUpdate() }
}
function removeSkill(i) { local.skills.splice(i, 1); emitUpdate() }
</script>

<template>
  <div class="card p-4">
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Label -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span class="text-sm font-bold text-slate-700 whitespace-nowrap">岗位信息</span>
      </div>

      <div class="w-px h-7 bg-slate-200 flex-shrink-0 hidden sm:block"></div>

      <!-- Title -->
      <input
        v-model="local.title"
        @input="emitUpdate()"
        placeholder="岗位名称，如：高级前端工程师"
        class="flex-1 min-w-[180px] text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-350"
      />

      <!-- Location -->
      <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
        <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        </svg>
        <input v-model="local.location" @input="emitUpdate()" placeholder="地点" class="w-24 text-xs text-slate-600 bg-transparent outline-none placeholder:text-slate-350" />
      </div>

      <!-- Type -->
      <select v-model="local.type" @change="emitUpdate()" class="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 outline-none cursor-pointer">
        <option value="全职">全职</option>
        <option value="兼职">兼职</option>
        <option value="实习">实习</option>
        <option value="合同">合同</option>
      </select>

      <!-- Description -->
      <input
        v-model="local.description"
        @input="emitUpdate()"
        placeholder="岗位职责简述..."
        class="flex-[2] min-w-[200px] text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-350"
      />

      <!-- Skills -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span v-for="(s, i) in local.skills" :key="i" class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
          {{ s }}
          <button @click="removeSkill(i)" class="text-slate-400 hover:text-red-500 transition-colors leading-none">&times;</button>
        </span>
        <input
          v-model="showSkillInput.val"
          @keyup.enter="addSkill"
          placeholder="+ 技能"
          class="w-16 text-[11px] text-slate-400 bg-transparent outline-none placeholder:text-slate-300"
        />
      </div>
    </div>
  </div>
</template>
