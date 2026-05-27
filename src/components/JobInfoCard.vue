<script setup>
import { reactive, watch, ref } from 'vue'

const props = defineProps({
  title: String,
  location: String,
  type: String,
  skills: Array,
  description: String,
})

const emit = defineEmits(['update'])

const editing = reactive({ title: false, location: false, description: false, newSkill: '' })

const local = reactive({
  title: '',
  location: '',
  type: '',
  skills: [],
  description: '',
})

watch(() => props.title, (v) => { local.title = v }, { immediate: true })
watch(() => props.location, (v) => { local.location = v }, { immediate: true })
watch(() => props.type, (v) => { local.type = v }, { immediate: true })
watch(() => props.skills, (v) => { local.skills = [...(v || [])] }, { immediate: true, deep: true })
watch(() => props.description, (v) => { local.description = v }, { immediate: true })

function emitUpdate() {
  emit('update', {
    title: local.title,
    location: local.location,
    type: local.type,
    skills: [...local.skills],
    description: local.description,
  })
}

function addSkill() {
  const s = editing.newSkill.trim()
  if (s && !local.skills.includes(s)) {
    local.skills.push(s)
    editing.newSkill = ''
    emitUpdate()
  }
}

function removeSkill(index) {
  local.skills.splice(index, 1)
  emitUpdate()
}

const jobTypes = ['全职', '兼职', '实习', '合同']
</script>

<template>
  <div class="card overflow-hidden">
    <div class="h-28 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=200&fit=crop&crop=center"
        class="w-full h-full object-cover"
        alt="office"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
      <div class="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] text-slate-500 font-medium">
        点击字段可编辑
      </div>
    </div>

    <div class="p-5">
      <!-- Job Title -->
      <div v-if="editing.title" class="mb-2">
        <input
          v-model="local.title"
          @blur="editing.title = false; emitUpdate()"
          @keyup.enter="editing.title = false; emitUpdate()"
          class="w-full text-lg font-bold text-slate-800 border-b-2 border-blue-400 bg-transparent outline-none"
          autofocus
        />
      </div>
      <h3 v-else @click="editing.title = true" class="text-lg font-bold text-slate-800 mb-2 cursor-pointer hover:text-blue-500 transition-colors">
        {{ local.title }}
      </h3>

      <!-- Location + Type -->
      <div class="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span v-if="editing.location" class="flex items-center gap-1">
          <input
            v-model="local.location"
            @blur="editing.location = false; emitUpdate()"
            @keyup.enter="editing.location = false; emitUpdate()"
            class="w-40 text-xs border-b border-blue-400 bg-transparent outline-none"
            autofocus
          />
        </span>
        <span v-else @click="editing.location = true" class="flex items-center gap-1 cursor-pointer hover:text-blue-500">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {{ local.location }}
        </span>
        <select
          v-model="local.type"
          @change="emitUpdate()"
          class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-medium text-xs border-0 outline-none cursor-pointer"
        >
          <option v-for="t in jobTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- Skills -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="(skill, i) in local.skills"
          :key="i"
          class="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg font-medium border border-slate-100 flex items-center gap-1"
        >
          {{ skill }}
          <button @click="removeSkill(i)" class="text-slate-300 hover:text-red-400 ml-0.5">&times;</button>
        </span>
        <input
          v-model="editing.newSkill"
          @keyup.enter="addSkill"
          placeholder="+ 添加技能"
          class="w-24 text-[11px] text-slate-400 bg-transparent border-0 outline-none placeholder-slate-300"
        />
      </div>

      <!-- Description -->
      <div v-if="editing.description">
        <textarea
          v-model="local.description"
          @blur="editing.description = false; emitUpdate()"
          class="w-full text-xs text-slate-500 leading-relaxed border border-slate-200 rounded-lg p-2 resize-y outline-none focus:border-blue-400"
          rows="2"
          autofocus
        ></textarea>
      </div>
      <p v-else @click="editing.description = true" class="text-xs text-slate-400 leading-relaxed cursor-pointer hover:text-blue-500 transition-colors">
        {{ local.description }}
      </p>
    </div>
  </div>
</template>
