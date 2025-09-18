<script setup lang='ts'>
import { computed } from 'vue'

const props = defineProps<{
  tooltip: string | string[]
}>()
const tipIsArray = computed(() => {
  return Array.isArray(props.tooltip)
})
</script>

<template>
  <el-tooltip placement="top" effect="light">
    <template #content>
      <div class="tooltip-content">
        <div v-if="!tipIsArray">
          {{ tooltip }}
        </div>
        <div v-for="(item, index) in tooltip" v-else :key="index">
          {{ item }}
        </div>
      </div>
    </template>
    <span class="iconfont icon icon-se-icon-circle-question " />
  </el-tooltip>
</template>

<style lang='scss' scoped></style>
