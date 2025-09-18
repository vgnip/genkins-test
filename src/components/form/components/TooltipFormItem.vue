<script setup lang="ts">
import QuestionTooltip from "./QuestionTooltip.vue";

defineProps<{
  label: string;
  tooltip: string;
}>();
</script>

<template>
  <el-form-item>
    <template #label>
      <div>
        <span>{{ label }}</span>
        <QuestionTooltip :tooltip="tooltip" />
        <span class="char">：</span>
      </div>
    </template>
    <slot />
  </el-form-item>
</template>
