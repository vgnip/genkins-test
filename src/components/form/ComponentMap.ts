import type { Component } from 'vue'
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
} from 'element-plus'
import ElSelect from './components/setting/ElSelect.vue'
import { ComponentType } from './types/index'

const componentMap = new Map<ComponentType, Component>()

componentMap.set(ComponentType.Input, ElInput)
componentMap.set(ComponentType.InputNumber, ElInputNumber)
componentMap.set(ComponentType.AutoComplete, ElAutocomplete)

componentMap.set(ComponentType.Select, ElSelect)

componentMap.set(ComponentType.TreeSelect, ElTreeSelect)
componentMap.set(ComponentType.Switch, ElSwitch)
componentMap.set(ComponentType.RadioGroup, ElRadio.Group) // 需要包装,或者slot写法
componentMap.set(ComponentType.Checkbox, ElCheckbox)
componentMap.set(ComponentType.CheckboxGroup, ElCheckbox.Group) // 需要包装,或者slot写法
componentMap.set(ComponentType.Cascader, ElCascader)
componentMap.set(ComponentType.Slider, ElSlider)

componentMap.set(ComponentType.DatePicker, ElDatePicker)
componentMap.set(ComponentType.TimePicker, ElTimePicker)
componentMap.set(ComponentType.Divider, ElDivider)

// 注册自定义组件
export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
