<script setup lang="ts">
import { computed } from 'vue'
// 定义Props类型
interface Props {
  modelValue: string | number | Array<string | number> | null
  options?: Array<{ label: string, value: string | number, disabled?: boolean }>
  multiLang?: boolean
}
// 获取Props
const props = defineProps<Props>()

// 获取Emits
const emit = defineEmits<Emits>()

// 定义Emits类型
interface Emits {
  (e: 'update:modelValue', value: string | number | Array<string | number> | null): void
  (e: 'visibleChange', value: boolean): void
  (e: 'change', value: string | number | Array<string | number> | null): void
}

// 计算属性，用于v-model绑定
const selectedValue = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

// 处理值更新的函数
function handleValueUpdate(val: string | number | Array<string | number> | null) {
  emit('update:modelValue', val)
}
function visibleChange(val: boolean) {
  emit('visibleChange', val)
}
function change(val: string | number | Array<string | number> | null) {
  emit('change', val)
}
</script>

<template>
  <el-select v-model="selectedValue" v-bind="$attrs" @update:model-value="handleValueUpdate" @visible-change="visibleChange" @change="change">
    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" :disabled="item.disabled">
      <slot name="option" :item="item">
        {{ item.label }}
      </slot>
    </el-option>
  </el-select>
</template>
