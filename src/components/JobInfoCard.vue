<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  title: String,
  location: String,
  type: String,
  skills: Array,
  description: String,
})
const emit = defineEmits(['update', 'load-sample'])

const local = reactive({ title: '', location: '', type: '全职', skills: [], description: '' })
const newSkill = reactive({ val: '' })
const completion = computed(() => {
  const fields = [
    Boolean(local.title?.trim()),
    Boolean(local.location?.trim()),
    Boolean(local.type),
    local.skills.length > 0,
    local.description?.trim()?.length > 20,
  ]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
})

watch(() => props.title, value => { local.title = value || '' }, { immediate: true })
watch(() => props.location, value => { local.location = value || '' }, { immediate: true })
watch(() => props.type, value => { local.type = value || '全职' }, { immediate: true })
watch(() => props.skills, value => { local.skills = [...(value || [])] }, { immediate: true, deep: true })
watch(() => props.description, value => { local.description = value || '' }, { immediate: true })

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
  const skill = newSkill.val.trim()
  if (skill && !local.skills.includes(skill)) {
    local.skills.push(skill)
    newSkill.val = ''
    emitUpdate()
  }
}

function removeSkill(index) {
  local.skills.splice(index, 1)
  emitUpdate()
}
</script>

<template>
  <section class="card p-4 sm:p-6 reveal">
    <div class="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
      <div class="lg:w-72 shrink-0">
        <div class="section-title">
          <span class="icon-badge blue">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4v13h16V7zM8 7h8" />
            </svg>
          </span>
          <div>
            <h2>岗位画像</h2>
            <p>完善信息后，匹配结果会更可靠。</p>
          </div>
        </div>
        <div class="mt-5 rounded-2xl bg-slate-950 p-4 text-white overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-xs text-slate-300 mb-2">岗位完整度</p>
            <div class="flex items-end gap-1 mb-3">
              <span class="text-4xl font-black tracking-tight">{{ completion }}</span>
              <span class="text-sm text-slate-300 pb-1">%</span>
            </div>
            <div class="h-2 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500" :style="{ width: completion + '%' }"></div>
            </div>
          </div>
        </div>
        <button class="btn-secondary w-full mt-3" @click="$emit('load-sample')">填入示例岗位</button>
      </div>

      <div class="flex-1 min-w-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label class="field">
            <span>岗位名称 <b>*</b></span>
            <input v-model="local.title" @input="emitUpdate" placeholder="例如：高级前端工程师、产品经理、服装导购" />
          </label>

          <div class="grid grid-cols-2 gap-3">
            <label class="field">
              <span>工作地点</span>
              <input v-model="local.location" @input="emitUpdate" placeholder="上海 · 浦东新区" />
            </label>
            <label class="field">
              <span>工作性质</span>
              <select v-model="local.type" @change="emitUpdate">
                <option value="全职">全职</option>
                <option value="兼职">兼职</option>
                <option value="实习">实习</option>
                <option value="合同">合同</option>
              </select>
            </label>
          </div>
        </div>

        <label class="field mb-4">
          <span>任职要求 / 技能标签</span>
          <div class="tag-input">
            <button v-for="(skill, index) in local.skills" :key="skill" class="skill-chip" @click="removeSkill(index)" type="button">
              {{ skill }}
              <span>×</span>
            </button>
            <input
              v-model="newSkill.val"
              @keyup.enter="addSkill"
              @blur="addSkill"
              placeholder="输入技能后回车添加"
            />
          </div>
        </label>

        <label class="field">
          <span>岗位职责 <b>*</b></span>
          <textarea
            v-model="local.description"
            @input="emitUpdate"
            placeholder="请描述岗位职责、工作内容、任职资格和加分项。建议包含经验年限、核心技能、业务场景和协作要求。"
            rows="7"
          ></textarea>
        </label>
        <div class="flex items-center justify-between mt-2 text-[11px] text-slate-500">
          <span>{{ local.description.length }} 字 · 建议 80 字以上</span>
          <span>{{ local.skills.length }} 个技能标签</span>
        </div>
      </div>
    </div>
  </section>
</template>
