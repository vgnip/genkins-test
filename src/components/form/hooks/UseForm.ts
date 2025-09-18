import type { FormEvents, FormProps, FormSchema, UseFormReturnType } from '../types/Form'
import { nextTick, onUnmounted, ref, unref, watch } from 'vue'

type Props = Partial<FormProps>

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormEvents>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)
  async function getForm() {
    const form = unref(formRef)
    if (!form) {
      throw new Error('表单实例尚未获取，请确保在执行表单操作时已呈现表单!')
    }
    await nextTick()
    return form as FormEvents
  }

  function register(instance: FormEvents) {
    onUnmounted(() => {
      formRef.value = null
      loadedRef.value = null
    })
    if (unref(loadedRef) && instance === unref(formRef)) {
      return
    }

    formRef.value = instance
    loadedRef.value = true

    watch(
      () => props,
      () => {
        props && instance.setProps(props)
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  const methods: Omit<FormEvents, 'getSchemaByField' | 'getProps'> = {
    scrollToField: async (prop) => {
      const form = await getForm()
      form.scrollToField(prop)
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm()
      form.setProps(formProps)
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm()
      form.updateSchema(data)
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm()
      form.resetSchema(data)
    },

    clearValidate: async (props?) => {
      const form = await getForm()
      form.clearValidate(props)
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields()
      })
    },

    removeSchemaByFiled: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByFiled(field)
    },

    getFieldsValue: <T>() => {
      const values = unref(formRef)?.getFieldsValue() as T
      if (values) {
        Object.keys(values).forEach((key) => {
          if (Array.isArray((values as Record<string, any>)[key])) {
            const isObject = typeof ((values as Record<string, any>)[key][0] || '') === 'object'
            if (!isObject) {
              (values as Record<string, any>)[key] = (values as Record<string, any>)[key].join(',')
            }
          }
        })
      }
      return values
    },

    setFieldsValue: async (values: Recordable) => {
      const form = await getForm()
      form.setFieldsValue(values)
    },

    appendSchemaByField: async (schema: FormSchema, prefixField: string | undefined, first: boolean | undefined) => {
      const form = await getForm()
      form.appendSchemaByField(schema, prefixField, first)
    },
    validate: async (callback) => {
      const form = await getForm()
      return form.validate(callback)
    },
    validateField: async (props, callback) => {
      const form = await getForm()
      return form.validateField(props, callback)
    },
  }

  return [register, methods]
}
