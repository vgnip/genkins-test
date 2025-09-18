type ColSpanType = number | string

export interface ColEx {
  style?: any
  /**
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType

  /**
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType

  /**
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType

  /**
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType

  /**
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType

  /**
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType

  /**
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType, offset?: ColSpanType } | ColSpanType
}

export enum ComponentType {
  Input = 'Input',
  InputNumber = 'InputNumber',
  Select = 'Select',
  SearchSelect = 'SearchSelect',
  TreeSelect = 'TreeSelect',
  RadioGroup = 'RadioGroup',
  Checkbox = 'Checkbox',
  CheckboxGroup = 'CheckboxGroup',
  AutoComplete = 'AutoComplete',
  Cascader = 'Cascader',
  DatePicker = 'DatePicker',
  TimePicker = 'TimePicker',
  Switch = 'Switch',
  Slider = 'Slider',
  Divider = 'Divider',
  MultilingualInput = 'MultilingualInput',
  NumberRange = 'NumberRange',
  DateRange = 'DateRange',
  OptionsTable = 'OptionsTable',
  NumberRule = 'NumberRule',
  ModelSelect = 'ModelSelect',
  ReferenceDataSelect = 'ReferenceDataSelect',
  RefDefValueSelect = 'RefDefValueSelect',
  AIInput = 'AIInput',
  TipDatePicker = 'TipDatePicker',
  CustomNumberInput = 'CustomNumberInput',
}

export interface Options {
  size?: 'default' | 'small' | 'large'
  delay?: number
  timeout?: number
  loading?: boolean
  retry?: boolean
}
