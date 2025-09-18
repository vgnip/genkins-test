import { ComponentType } from './types/index'
/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes(ComponentType.Input) || component.includes(ComponentType.AutoComplete)) {
    return "请输入"
  }
  if (component.includes('Picker')) {
    return "请选择"
  }
  if (
    component.includes(ComponentType.Select)
    || component.includes(ComponentType.Cascader)
    || component.includes(ComponentType.Checkbox)
    || component.includes(ComponentType.Switch)
  ) {
    return "请选择"
  }
  return ''
}

export function setComponentRuleType(rule: any, component: ComponentType, valueFormat: string) {
  if (Reflect.has(rule, 'type')) {
    return
  }
  if ([ComponentType.DatePicker, ComponentType.TimePicker].includes(component)) {
    rule.type = valueFormat ? 'string' : 'object'
  } else if ([ComponentType.CheckboxGroup].includes(component)) {
    rule.type = 'array'
  } else if ([ComponentType.InputNumber].includes(component)) {
    rule.type = 'number'
  }
}
