import type { ComputedRef, Ref } from 'vue'
import type { FormSchema } from '../types/Form'
import { unref } from 'vue'
import { isNullOrUnDef } from '../utils/is'

interface UseFormValuesContext {
  defaultValueRef: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
}
export function useFormValues({ defaultValueRef, getSchema, formModel }: UseFormValuesContext) {
  function initDefault() {
    const schemas = unref(getSchema)
    const obj: Recordable = {}
    schemas.forEach((item) => {
      const { defaultValue } = item
      if (!isNullOrUnDef(defaultValue)) {
        obj[item.field] = defaultValue
        formModel[item.field] = defaultValue
      }
    })
    defaultValueRef.value = obj
  }

  return { initDefault }
}
