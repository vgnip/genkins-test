import type { RowProps } from 'element-plus'
import type { PropType } from 'vue'
import type { FormSchema } from './types/Form'
import { LabelPosition } from './types/Form'

export const formProps = {
  modelValue: {
    type: Object as PropType<Recordable>,
    default: {},
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  labelPosition: {
    type: String as PropType<LabelPosition>,
    default: LabelPosition.right,
  },
  // 表单配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  // 禁用表单
  disabled: Boolean,
  rowProps: Object as PropType<RowProps>,
  // 自定义重置函数
  resetFunc: Function as PropType<() => Promise<void>>,
  // 是否详情
  isView: {
    type: Boolean,
    default: false,
  },
  labelSuffix: {
    type: String,
    default: '',
  },
}
