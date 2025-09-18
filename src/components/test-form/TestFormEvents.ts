import type { FormEvents, FormProps, FormSchema } from '@/components/form/types/Form'
import { ElMessage } from 'element-plus'

export function useTestFormEvents(formProps: FormProps, formEvents: Omit<FormEvents, 'getSchemaByField' | 'getProps'>) {
  const changeLabelPosition = () => {
    const labelPositions: any = ['left', 'right', 'top']
    const currentIndex = labelPositions.indexOf(formProps.labelPosition)
    const nextIndex = (currentIndex + 1) % labelPositions.length
    formProps.labelPosition = labelPositions[nextIndex]
  }

  const disabledForm = () => {
    formProps.disabled = !formProps.disabled
  }

  const validate = async () => {
    const valid = (valid: any) => {
      console.log(valid)
    }
    const result = await formEvents.validate(valid)
    const msg = result ? '校验成功' : '校验失败'
    ElMessage(msg)
  }

  const validateField = async (field: string) => {
    const valid = (valid: any) => {
      console.log(valid)
    }
    const result = await formEvents.validateField(field, valid)
    const msg = result ? '校验成功' : '校验失败'
    ElMessage(msg)
  }

  const getFieldsValue = () => {
    console.log('表单值========>', formEvents.getFieldsValue())
    ElMessage(JSON.stringify(formEvents.getFieldsValue()))
  }

  const setFieldsValue: (values: Recordable) => void = (values) => {
    formEvents.setFieldsValue(values)
  }

  const resetSchema = (schema: Partial<FormSchema> | Partial<FormSchema>[]) => {
    formEvents.resetSchema(schema)
  }

  const updateSchema = (schema: Partial<FormSchema> | Partial<FormSchema>[]) => {
    formEvents.updateSchema(schema)
  }
  const appendSchemaByField = (schema: FormSchema, prefixField?: string | undefined, first?: boolean | undefined) => {
    formEvents.appendSchemaByField(schema, prefixField, first)
  }

  const removeSchemaByFiled = (field: string | string[]) => {
    formEvents.removeSchemaByFiled(field)
  }

  return {
    changeLabelPosition,
    disabledForm,
    validate,
    validateField,
    getFieldsValue,
    setFieldsValue,
    resetSchema,
    updateSchema,
    appendSchemaByField,
    removeSchemaByFiled,
  }
}
