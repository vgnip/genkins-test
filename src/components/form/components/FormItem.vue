<script lang="tsx">
import type { PropType } from 'vue'
import type { FormEvents, FormProps, FormSchema } from '../types/Form.ts'
import { getTagLanguage } from '@/utils/languageUtil.ts'
import { codeValidator } from '@/utils/Rules.ts'
import {  ElCol, ElDivider, ElFormItem } from 'element-plus'
import { cloneDeep, upperFirst } from 'lodash-es'
import { computed, defineComponent, unref } from 'vue'
import { componentMap } from '../ComponentMap.ts'
import { createPlaceholderMessage } from '../FormHelper.ts'
import { ComponentType } from '../types/index.ts'
import { getSlot } from '../utils/index.ts'
import { isBoolean, isFunction } from '../utils/is.ts'
import QuestionTooltip from './QuestionTooltip.vue'

export default defineComponent({
  name: 'FormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({}),
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({}),
    },
    allDefaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    setFormModel: {
      type: Function as PropType<(key: string, value: any) => void>,
      default: null,
    },
    formEvents: {
      type: Object as PropType<FormEvents>,
    },
    clearValidate: {
      type: Function,
      default: null,
    },
    formName: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...allDefaultValues,
          ...formModel,
        } as Recordable,
        schema,
      }
    })

    const getComponentsProps = computed(() => {
      const { schema, formModel, formEvents } = props
      let { componentProps = {} } = schema
      if (isFunction(componentProps)) {
        componentProps = componentProps({ schema, formModel, formEvents }) ?? {}
      }
      if (schema.component === 'Divider') {
        componentProps = Object.assign({ type: 'horizontal', orientation: 'left', plain: true }, componentProps)
      }
      return componentProps as Recordable
    })

    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps
      if (globDisabled) {
        return globDisabled
      }
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      const disabled = !!globDisabled || itemDisabled
      return disabled
    })
    function getShow(): { isShow: boolean, isIfShow: boolean } {
      const { show, ifShow } = props.schema

      let isShow = true
      let isIfShow = true

      if (isBoolean(show)) {
        isShow = show
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues)) as boolean
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues)) as boolean
      }
      return { isShow, isIfShow }
    }
    const handleRules = (): any[] => {
      const { rules: defRules = [], component, rulesMessageJoinLabel, label, required, field, commonRules = true } = props.schema
      const { disabled: globDisabled, isView } = props.formProps
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps
      const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel') ? rulesMessageJoinLabel : globalRulesMessageJoinLabel
      const defaultMsg = `${createPlaceholderMessage(component)}${joinLabel ? label : ''}`
      const getRequired = isFunction(required) ? required(unref(getValues)) : required
      // 用于处理禁用字段也需要展示必填校验图标
      if (required && !!itemDisabled) {
        return [{ required, message: defaultMsg, trigger: 'blur' }]
      }
      if (!!globDisabled || !!itemDisabled || isView) {
        props.clearValidate(field)
        return []
      }

      // 针对字段code的通用校验
      if (field === 'code' && commonRules) {
        return [{ required: getRequired, validator: codeValidator(20), trigger: 'blur', ...defRules, emptyMsg: defaultMsg }]
      }
      let rules: any[] = cloneDeep(defRules) as any[]

      if ((!rules || rules.length === 0) && getRequired) {
        rules = [{ required: getRequired, message: defaultMsg, trigger: 'blur' }]
      }
      return rules
    }

    const renderComponent = () => {
      const { renderComponentContent, component, field, changeEvent = 'Update:modelValue', valueField, componentProps } = props.schema
      let isTrim = false
      if (component === 'Input' && componentProps && (componentProps as Recordable).trim) {
        isTrim = true
      }
      const { autoSetPlaceHolder, size, isView } = props.formProps

      if (isView) {
        let content = props.formModel[field]
        if (component === ComponentType.MultilingualInput) {
          content = getTagLanguage(props.formModel[field])
        }
        return <span style="overflow: auto;">{content}</span>
      }

      const propsData: Recordable = {
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
      }
      const eventKey = `on${upperFirst(changeEvent)}`
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          const [e] = args
          if (propsData[eventKey]) {
            propsData[eventKey](...args)
          }
          const target = e || null
          let value
          if (target) {
            value = isTrim ? target.trim() : target
          } else {
            value = e
          }
          props.setFormModel(field, value)
        },
      }
      if (component === ComponentType.MultilingualInput && field === 'name') {
        // code为禁用时不自动生成编码
        const schema = props.formEvents?.getSchemaByField('code')
        let componentProps = schema?.componentProps || {} as any
        if (isFunction(componentProps)) {
          componentProps = componentProps({ schema, formModel: props.formModel, formEvents: props.formEvents }) ?? {}
        }
      }
      const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>

      const isCreatePlaceholder = !!autoSetPlaceHolder
      if (isCreatePlaceholder && component) {
        const label = isFunction(props.schema.label) ? props.schema.label() : props.schema.label
        propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component) + label
      }
      if (!propsData.placeholder) {
        propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component)
      }
      propsData.codeField = field
      propsData.formValues = unref(getValues)

      const bindValue: Recordable = {
        [valueField || 'model-value']: props.formModel[field],
      }

      const compAttr: Recordable = {
        ...propsData,
        ...on,
        ...bindValue,
      }
      if (!renderComponentContent) {
        return <Comp {...compAttr} />
      }
      const compSlot = isFunction(renderComponentContent)
        ? { ...(renderComponentContent(unref(getValues)) ?? {}) }
        : {
            default: () => renderComponentContent,
          }
      return <Comp {...compAttr}>{compSlot}</Comp>
    }

    const renderLabelHelpMessage = () => {
      const { label: itemLabel, helpMessage, subLabel, labelLength } = props.schema
      const { labelSuffix = '' } = props.formProps
      let label = isFunction(itemLabel) ? `${itemLabel()}` : `${itemLabel}`
      if (!helpMessage) {
        label = `${label}${labelSuffix}`
      }
      let showLabel: string = `${label}`
      if (labelLength) {
        showLabel = showLabel.substr(0, labelLength)
      }
      const titleObj = { title: label }
      const renderLabel = subLabel
        ? (
            <span style="word-break: break-word">
              {label}
              {' '}
              <span>{subLabel}</span>
            </span>
          )
        : labelLength
          ? (
              <label style="word-break: break-word" {...titleObj}>{showLabel}</label>
            )
          : (
              <span style="word-break: break-word">{label}</span>
            )
      const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage
      if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
        return renderLabel
      }
      return (
        <span>
          {renderLabel}
          <QuestionTooltip tooltip={getHelpMessage as string | string[]} />
          <span>{labelSuffix}</span>
        </span>
      )
    }

    const renderItem = () => {
      const { itemProps, slot, render, field, suffix, component } = props.schema
      if (component === 'Divider') {
        return (
          <ElCol span={24}>
            <ElDivider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</ElDivider>
          </ElCol>
        )
      } else {
        const getContent = () => {
          return slot ? getSlot(slots, slot, unref(getValues)) : render ? render(unref(getValues)) : renderComponent()
        }

        const showSuffix = !!suffix
        const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix

        return (
          <ElFormItem
            prop={field}
            class={{ 'suffix-item': showSuffix }}
            {...(itemProps as Recordable)}
            v-slots={{
              label: () => renderLabelHelpMessage(),
            }}
            rules={handleRules()}
          >
            <div style="display:flex; width:100%">
              {getContent()}
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </div>
          </ElFormItem>
        )
      }
    }

    return () => {
      const { colProps = {}, itemSlot, renderColContent, component } = props.schema
      if (!componentMap.has(component)) {
        return null
      }

      const { baseColProps = {}, isView } = props.formProps
      const realColProps = { ...baseColProps, ...colProps }
      if (colProps.span) {
        ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(name => delete realColProps[name])
      }
      const { isIfShow, isShow } = getShow()
      const values = unref(getValues)

      const getContent = () => {
        return itemSlot ? getSlot(slots, itemSlot, values) : renderColContent ? renderColContent(values) : renderItem()
      }

      return (
        isIfShow && (
          <ElCol {...realColProps} v-show={isShow} class={{ isView }}>
            {getContent()}
          </ElCol>
        )
      )
    }
  },
})
</script>
