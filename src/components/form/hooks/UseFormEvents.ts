import type { FormItemProp } from 'element-plus'
import type { Arrayable } from 'element-plus/es/utils/typescript'
import type { ComputedRef, Ref } from 'vue'
import type { FormEvents, FormProps, FormSchema, ValidateFieldType, ValidateType } from '../types/Form'
import { cloneDeep, uniqBy } from 'lodash-es'
import { toRaw, unref } from 'vue'
import { deepMerge } from '../utils/index'
import { isArray, isFunction, isObject, isString } from '../utils/is'

interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<FormEvents>
  schemaRef: Ref<FormSchema[]>
}
export function useFormEvents({ emit, getProps, formModel, getSchema, defaultValueRef, formElRef, schemaRef }: UseFormActionContext) {
  const clearValidate: (props?: Arrayable<FormItemProp> | undefined) => void = async (props?) => {
    unref(formElRef)?.clearValidate(props)
  }

  const validateField: ValidateFieldType = async (props, callback) => {
    return unref(formElRef)?.validateField(props, callback)
  }
  const resetFields = async (): Promise<void> => {
    const { resetFunc } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)
    if (!formEl) {
      return
    }

    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultValueRef.value[key]
    })
    const fields = unref(getSchema)
      .map(item => item.field)
      .filter(Boolean)
    setTimeout(() => {
      clearValidate(fields)
    })
    emit('reset', toRaw(formModel))
  }
  const setFieldsValue = async (values: Recordable): Promise<void> => {
    const fields = unref(getSchema)
      .map(item => item.field)
      .filter(Boolean)
    const validKeys: string[] = []
    Object.keys(values).forEach((key) => {
      const value = values[key]
      if (!(values instanceof Object)) {
        return
      }
      const hasKey = Reflect.has(values, key)
      if (hasKey && fields.includes(key)) {
        formModel[key] = value
        validKeys.push(key)
      }
    })
  }

  const getSchemaByField = (field: string): Nullable<FormSchema> => {
    if (!isString(field)) {
      return null
    }
    const schemaList: FormSchema[] = unref(getSchema)
    const index = schemaList.findIndex(schema => schema.field === field)
    if (index !== -1) {
      return cloneDeep(schemaList[index])
    }
    return null
  }

  const _removeSchemaByFiled = (field: string, schemaList: FormSchema[]): void => {
    if (isString(field)) {
      const index = schemaList.findIndex(schema => schema.field === field)
      if (index !== -1) {
        delete formModel[field]
        schemaList.splice(index, 1)
      }
    }
  }
  const removeSchemaByFiled = async (fields: string | string[]): Promise<void> => {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    if (!fields) {
      return
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields
    if (isString(fields)) {
      fieldList = [fields]
    }
    for (const field of fieldList) {
      _removeSchemaByFiled(field, schemaList)
    }
    schemaRef.value = schemaList
  }

  const appendSchemaByField = async (schema: FormSchema, prefixField?: string, first = false): Promise<void> => {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))

    const index = schemaList.findIndex(schema => schema.field === prefixField)
    const hasInList = schemaList.some(item => item.field === prefixField || schema.field)

    if (!hasInList) {
      return
    }

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema)
      schemaRef.value = schemaList
      return
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema)
    }
    schemaRef.value = schemaList
  }

  const resetSchema = async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
    let updateData: Partial<FormSchema>[] = []
    if (isObject(data)) {
      updateData.push(data as FormSchema)
    }
    if (isArray(data)) {
      updateData = [...data]
    }

    const hasField = updateData.every(item => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field))

    if (!hasField) {
      throw new Error('需要更新的Schema数组表单的所有子项都必须包含“field”字段')
    }
    schemaRef.value = updateData as FormSchema[]
  }

  const updateSchema = async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
    let updateData: Partial<FormSchema>[] = []
    if (isObject(data)) {
      updateData.push(data as FormSchema)
    }
    if (isArray(data)) {
      updateData = [...data]
    }

    const hasField = updateData.every(item => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field))

    if (!hasField) {
      throw new Error('需要更新的Schema数组表单的所有子项都必须包含“field”字段')
    }
    const schema: FormSchema[] = []
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item)
          schema.push(newSchema as FormSchema)
        } else {
          schema.push(val)
        }
      })
    })
    schemaRef.value = uniqBy(schema, 'field')
  }

  const getFieldsValue = (): Recordable => {
    const formEl = unref(formElRef)
    if (!formEl) {
      return {}
    }
    return toRaw(unref(formModel))
  }
  const validate: ValidateType = async (callback) => {
    return await unref(formElRef)?.validate(callback)
  }

  const scrollToField: (prop: FormItemProp) => void = (prop) => {
    unref(formElRef)?.scrollToField(prop)
  }

  return {
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
    setFieldsValue,
    scrollToField,
  }
}
