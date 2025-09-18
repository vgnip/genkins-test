<script lang="ts" setup>
import type { Ref } from 'vue'
import type { FormEvents, FormProps, FormSchema } from './types/Form.ts'
import { computed, onMounted, reactive, ref, unref, useAttrs, watch } from 'vue'
import FormItem from './components/FormItem.vue'
import { formProps } from './FormProps.ts'
import { useFormEvents } from './hooks/UseFormEvents.ts'
import { useFormValues } from './hooks/UseFormValues.ts'
import { deepMerge } from './utils/index.ts'

const props = defineProps(formProps)
const emit = defineEmits(['register', 'update:modelValue'])
const attrs = useAttrs()
const propsRef = ref<Partial<FormProps>>({})
const getProps = computed((): FormProps => {
  const mergeProps = { ...props, ...unref(propsRef) } as FormProps
  return mergeProps
})
async function setProps(formProps: Partial<FormProps>): Promise<void> {
  propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
}
const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) }) as Recordable)

const formModel = reactive<Recordable>({})
const formElRef = ref<Nullable<FormEvents>>(null)
const schemaRef = ref<Nullable<FormSchema[]>>(null)

const getSchema = computed((): FormSchema[] => {
  const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any)
  return schemas as FormSchema[]
})

const getRow = computed((): Recordable => {
  const { baseRowStyle = {}, rowProps } = unref(getProps)
  return {
    style: baseRowStyle,
    ...rowProps,
  }
})
const defaultValueRef = ref<Recordable>({})
const isInitedDefaultRef = ref(false)
const { initDefault } = useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
})

const {
  setFieldsValue,
  clearValidate,
  validate,
  validateField,
  getFieldsValue,
  updateSchema,
  resetSchema,
  getSchemaByField,
  appendSchemaByField,
  removeSchemaByFiled,
  resetFields,
  scrollToField,
} = useFormEvents({
  emit: emit as EmitType,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef: formElRef as Ref<FormEvents>,
  schemaRef: schemaRef as Ref<FormSchema[]>,
})
function setFormModel(key: string, value: any) {
  formModel[key] = value
  validateField([key])
  emit('update:modelValue', formModel)
}

const formEvents: FormEvents = {
  getFieldsValue,
  setFieldsValue,
  resetFields,
  updateSchema,
  resetSchema,
  setProps,
  getProps,
  getSchemaByField,
  removeSchemaByFiled,
  appendSchemaByField,
  clearValidate,
  validateField,
  validate,
  scrollToField,
}

watch(
  () => getSchema.value,
  (schema) => {
    if (unref(isInitedDefaultRef)) {
      return
    }
    if (schema?.length) {
      initDefault()
      isInitedDefaultRef.value = true
    }
  },
)
watch(
  () => unref(getProps).modelValue,
  () => {
    const { modelValue } = unref(getProps)
    if (!modelValue) {
      return
    }
    Object.assign(formModel, unref(modelValue))
  },
  { immediate: true, deep: true },
)
onMounted(() => {
  initDefault()
  emit('register', formEvents)
})

defineExpose({
  setFieldsValue,
  clearValidate,
  validate,
  validateField,
  getFieldsValue,
  updateSchema,
  resetSchema,
  getSchemaByField,
  appendSchemaByField,
  removeSchemaByFiled,
  resetFields,
  scrollToField,
})
</script>

<template>
  <el-form v-bind="getBindValue" ref="formElRef" class="common-form" :model="formModel">
    <el-row v-bind="getRow">
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :form-events="formEvents" :set-form-model="setFormModel" :schema="schema" :form-props="getProps"
          :all-default-values="defaultValueRef" :form-model="formModel" :form-name="getBindValue.name"
          :clear-validate="clearValidate"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}" />
          </template>
        </FormItem>
      </template>
      <slot name="formFooter" />
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
@use './index.module.scss';
</style>
