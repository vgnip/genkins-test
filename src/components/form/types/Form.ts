import type { Arrayable } from 'element-plus/es/utils/typescript'
import type { ComputedRef, CSSProperties, VNode } from 'vue'
import type { ColEx, ComponentType } from './index'
import  type {FormItemProp,FormItemRule,FormValidateCallback,FormValidationResult,RowProps} from "element-plus"
export type RegisterFn = (formInstance: FormEvents) => void
export type UseFormReturnType = [RegisterFn, Omit<FormEvents, 'getSchemaByField' | 'getProps'>]
export type ValidateFieldType = (props?: Arrayable<FormItemProp> | undefined, callback?: FormValidateCallback | undefined) => FormValidationResult
export type ValidateType = (callback?: FormValidateCallback) => FormValidationResult
export enum LabelPosition {
  left = 'left',
  right = 'right',
  top = 'top',
}
interface Rules extends FormItemRule {
  errMsg?: string // 空提示语
  emptyMsg?: string // 校验失败提示语
  langthMsg?: string // 长度提示语
}
export interface FormProps {
  modelValue?: Recordable
  labelPosition?: LabelPosition
  // 整个表单的行配置
  rowProps?: RowProps
  // 整个表单中所有项目的宽度
  labelWidth?: number | string
  // 整个表单的label后缀
  labelSuffix?: string
  // 自动根据szchema中的label设置placeholder
  autoSetPlaceHolder?: boolean
  // 表单的内部组件尺寸
  size?: '' | 'large' | 'default' | 'small'
  // row的自定义样式
  baseRowStyle?: CSSProperties
  // col的自定义样式
  baseColProps?: Partial<ColEx>
  // 表单配置规则
  schemas?: FormSchema[]
  // 是否禁用
  disabled?: boolean
  // 检查标签中是否添加了信息
  rulesMessageJoinLabel?: boolean
  // 自定义重置函数
  resetFunc?: () => Promise<void>
  // 是否详情展示
  isView?: boolean
}
export interface FormEvents {
  setFieldsValue: (values: Recordable) => Promise<void>
  resetFields: () => Promise<void>
  getFieldsValue: () => Recordable
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  getProps: ComputedRef<Partial<FormProps>>
  getSchemaByField: (field: string) => Nullable<FormSchema>
  removeSchemaByFiled: (field: string | string[]) => Promise<void>
  appendSchemaByField: (schema: FormSchema, prefixField: string | undefined, first?: boolean | undefined) => Promise<void>
  validateField: ValidateFieldType
  validate: ValidateType
  clearValidate: (props?: Arrayable<FormItemProp> | undefined) => void
  scrollToField: (prop: FormItemProp) => void
}

export interface FormSchema {
  // 表单值
  field: string
  // 表单值变化的监听事件名 默认为change
  changeEvent?: string
  // v-model双向绑定的值的字段，默认为model-value
  valueField?: string
  component: ComponentType
  label: string | (() => string)
  // 组件入参
  componentProps?: ((opt: { schema: FormSchema, formEvents: FormEvents, formModel: Recordable }) => Recordable) | object
  // 栅格配置
  colProps?: any
  // 默认值
  defaultValue?: any
  // 是否校验
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // 校验规则
  rules?: Arrayable<Rules>
  // 是否自动拼接label和校验信息
  rulesMessageJoinLabel?: boolean
  // js控制显隐
  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // css控制显隐
  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)
  // el-form-item的参数
  itemProps?: any
  // 自定义插槽, 插入到el-form-item中
  slot?: string
  // 类似插槽方式,不过是通过函数来实现dom结构,而不是像插槽那样写到template中
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string
  // 也是自定义插槽, 不过需要自己写el-form-item
  itemSlot?: string
  // 同render 和 itemSlot
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string
  // 自定义渲染组件内部的slot
  renderComponentContent?: ((renderCallbackParams: RenderCallbackParams) => any) | VNode | VNode[] | string
  // 标签右侧提示icon
  helpMessage?: string | string[] | ((renderCallbackParams: RenderCallbackParams) => string | string[])
  suffix?: string | number | ((values: RenderCallbackParams) => string | number)
  subLabel?: string
  labelLength?: number
  commonRules?: boolean
}

export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  field: string
}
