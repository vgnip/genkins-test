<script lang="ts" setup>
import type { FormProps, FormSchema } from '@/components/form/types/Form'
import { useForm } from '@/components/form/hooks/UseForm'
import MyForm from '@/components/form/index.vue'
import { ComponentType } from '@/components/form/types'
import { LabelPosition } from '@/components/form/types/Form'
import { ElDatePicker, ElOption, ElSelect } from 'element-plus'
import { isEmpty } from 'lodash-es'
import { h, reactive, ref } from 'vue'
import TestData from './TestData'
import { useTestFormEvents } from './TestFormEvents'

const currentLanguage = "zh-CN"

const restaurants = ref<any[]>([
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element', link: 'https://github.com/ElemeFE/element' },
  { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
  { value: 'babel', link: 'https://github.com/babel/babel' },
])
function querySearch(queryString: string, cb: any) {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  cb(results)
}
function createFilter(queryString: string) {
  return (restaurant: any) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const newSchemas: FormSchema = {
  field: 'newField',
  changeEvent: 'input',
  component: ComponentType.Input,
  label: '新增出来的表单项',
  defaultValue: '新增出来的表单项',
  colProps: {
    span: 24,
  },
}

const field1NewSchema: FormSchema = {
  field: 'field1',
  component: ComponentType.Input,
  label: '更新字段1的label',
}

const schemas: FormSchema[] = [
  {
    field: 'field1',
    changeEvent: 'input',
    component: ComponentType.Input,
    label: 'field1',
    helpMessage: ['天王盖地虎', '小鸡炖蘑菇'],
    labelLength: 7,
    required: true,
    componentProps: () => {
      return {
        placeholder: '自定义placeholder',
        onChange: (e: any) => {
          console.log(e)
        },
      }
    },
    renderComponentContent: () => {
      return {
        suffix: () => h('span', { style: 'color: red;' }, 'suffix插槽'),
      }
    },
  },
  {
    field: 'field2',
    component: ComponentType.InputNumber,
    label: 'field2',
    required: true,
    rules: [{ trigger: 'blur', validator: TestData.customVaildate }],
    componentProps: {
      style: {
        width: '100%',
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field3',
    changeEvent: 'input',
    component: ComponentType.Input,
    label: 'field3',
    defaultValue: '默认值',
    // colProps: {
    //   span: 8,
    // },
  },
  // el-select组件需要配合el-option使用,但是底层formItem只会渲染一层组件,如果想直接使用el-select组件,有三种方法.1.基于el-select二次封装一次组件.2.使用schema中的render参数,自定义渲染.3.使用slot插槽,在模板中实现.
  {
    field: 'select1',
    component: ComponentType.Select,
    label: 'select1',
    defaultValue: '',
    componentProps: {
      options: TestData.optionsA.value,
      multiLang: true,
    },
    colProps: {
      span: 8,
    },
    // 也可用直接写布尔值,这里的两个区别一个是v-if,一个是v-show
    ifShow: ({ model, field }) => {
      return model[field] !== '1'
    },
    show: ({ model, field }) => {
      return model[field] !== '1'
    },
  },
  {
    field: 'select2',
    component: ComponentType.Select,
    label: 'select2 ',
    defaultValue: '',
    render: ({ model, field }) => {
      return renderElSelect({ model, field })
    },
  },
  {
    field: 'select3',
    component: ComponentType.Select,
    label: 'select3',
    slot: 'selectA',
    colProps: {
      span: 8,
    },
    itemProps: {
      labelWidth: 100,
    },
  },
  {
    field: 'switch1',
    component: ComponentType.Switch,
    label: 'switch1',
    componentProps: ({ formModel, formEvents, schema }) => {
      return {
        onChange: (val: boolean) => {
          formEvents.setFieldsValue({ field1: 'switch1事件触发' })
          console.log('Switch1Change:', val, formModel, formEvents, schema)
        },
      }
    },
  },
  {
    field: 'DatePicker1',
    component: ComponentType.DatePicker,
    label: 'DatePicker1',
    slot: 'DatePickerA',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'DatePicker2',
    component: ComponentType.DatePicker,
    label: 'DatePicker2',
    render: ({ model, field }) => {
      return renderElDatePicker({ model, field })
    },
  },
  {
    field: 'DatePicker3',
    component: ComponentType.DatePicker,
    label: 'DatePicker3',
    componentProps: {
      style: {
        width: '100%',
      },
      type: 'date',
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      onChange: (val: any) => {
        console.log(val)
      },
      onVisibleChange: (val: any) => {
        console.log(val)
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'Cascader1',
    component: ComponentType.Cascader,
    label: 'Cascader1',
    componentProps: {
      style: {
        width: '100%',
      },
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    field: 'Slider1',
    component: ComponentType.Slider,
    label: 'Slider1',
    componentProps: {
      min: 0,
      max: 100,
      range: true,
      marks: {
        20: '20°C',
        60: '60°C',
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'TreeSelect1',
    component: ComponentType.TreeSelect,
    label: 'TreeSelect1',
    componentProps: {
      data: TestData.treeData,
      renderAfterExpand: false,
    },
  },
  {
    field: 'AutoComplete1',
    component: ComponentType.AutoComplete,
    label: 'AutoComplete1',
    componentProps: {
      fetchSuggestions: querySearch,
      clearable: true,
      style: {
        width: '100%',
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'Divider1',
    component: ComponentType.Divider,
    label: '',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'TimePicker1',
    component: ComponentType.TimePicker,
    label: 'TimePicker',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'name',
    component: ComponentType.MultilingualInput,
    label: 'MultilingualInput',
    componentProps: ({ formModel }) => {
      return {
        inputType: 'textarea',
        defaultValue: { ...formModel.name },
        maxlength: 100, // 默认100
        rules: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      }
    },
    rules: [{
      required: true,
      message: '请输入内容',
      trigger: 'blur',
      validator: (_rule: any, model) => {
        return !isEmpty(model[currentLanguage])
      },
    }],
    colProps: {
      span: 8,
    },
  },
  {
    field: 'tip',
    component: ComponentType.Input,
    label: '提示',
    helpMessage: '提示icon',
    colProps: {
      span: 8,
    },
  },
]
function renderElSelect({ model, field }: { model: any, field: any }) {
  const options = TestData.optionsA.value.map((item) => {
    return h(
      ElOption,
      {
        key: item.value,
        label: item.label,
        value: item.value,
        disabled: item.disabled,
      },
      {
        default: () => h('span', null, item.label),
      },
    )
  })
  console.log("option--",options)
  return h(
    ElSelect,
    {
      modelValue: model[field],
      placeholder: 'h函数生成的select',
      onChange: (value: any) => {
        model[field] = value
      },
    },
    {
      default: () => options,
    },
  )
}
function renderElDatePicker({ model, field }: { model: any, field: any }) {
  return h(ElDatePicker, {
    'modelValue': model[field],
    'onUpdate:modelValue': (val) => {
      model[field] = val
    },
    'type': 'date',
    'placeholder': '选择日期',
    'format': 'YYYY-MM-DD',
    'valueFormat': 'YYYY-MM-DD',
    'onChange': (val: any) => {
      console.log(val)
    },
    'onVisibleChange': (val: any) => {
      console.log(val)
    },
  })
}
const formModel = reactive({
  field1: '1',
  name: {
    en: '默认英文',
    cn: '默认中文',
  },
})
const formProps: FormProps = reactive({
  modelValue: formModel,
  labelPosition: LabelPosition.right,
  rowProps: {
    gutter: 10,
    justify: 'start',
    align: 'top',
    tag: 'div',
  },
  labelWidth: 160,
  autoSetPlaceHolder: true,
  // baseRowStyle: {
  //   background: 'red',
  //   padding: '10px',
  // },
  baseColProps: {
    span: 7, // 栅格占据的列数
    offset: 1, // 栅格左侧的间隔格数
    // push: 1, // 栅格向右移动格数
    pull: 1, // 栅格向左移动格数
  },
  disabled: false,
  rulesMessageJoinLabel: true,
  schemas,
  labelSuffix: '：',
})
const [register, method] = useForm(formProps)

const {
  changeLabelPosition,
  disabledForm,
  validate,
  validateField,
  getFieldsValue,
  setFieldsValue,
  appendSchemaByField,
  removeSchemaByFiled,
  updateSchema,
  resetSchema,
} = useTestFormEvents(formProps, method)

function pickerChange(val: any) {
  console.log(val, formModel, 222222)
}
</script>

<template>
  <div class="ls-p-[10px]">
    <div class="ls-pb-[10px]">
      <el-button @click="changeLabelPosition">
        修改表单对齐方式
      </el-button>
      <el-button @click="disabledForm">
        禁用表单
      </el-button>
      <el-button @click="validate">
        校验表单
      </el-button>
      <el-button @click="validateField('field2')">
        校验field2字段,自定义校验
      </el-button>
      <el-button @click="method.clearValidate('field2')">
        移除field2字段
      </el-button>
      <el-button @click="method.resetFields">
        重置表单
      </el-button>
      <el-button @click="getFieldsValue">
        获取表单值
      </el-button>
      <el-button @click="setFieldsValue({ field1: '设置的值' })">
        设置field1表单值
      </el-button>
      <el-button @click="appendSchemaByField(newSchemas, 'field2')">
        新增表单项,在field2字段后
      </el-button>
      <el-button @click="removeSchemaByFiled('field1')">
        删除field1表单项
      </el-button>
      <el-button @click="updateSchema(field1NewSchema)">
        更新表单项
      </el-button>
      <el-button @click="resetSchema(schemas)">
        重置表单项
      </el-button>
      <el-button @click="method.setProps({ isView: true })">
        设置为详情展示
      </el-button>
    </div>
    <MyForm @register="register">
      <template #selectA="{ model, field }">
        <ElSelect v-model="model[field]" collapse-tags multiple placeholder="Select">
          <ElOption v-for="item in TestData.colors" :key="item.value" :label="item.label" :value="item.value">
            <div class="ls-flex ls-items-center">
              <el-tag :color="item.value" style="margin-right: 8px" size="small" class="ls-h-[20px] ls-w-[20px]" />
              <span :style="{ color: item.value }">{{ item.label }}</span>
            </div>
          </ElOption>
          <template #tag>
            <el-tag v-for="color in model[field]" :key="color" :color="color" size="small" class="ls-h-[20px] ls-w-[20px]" />
          </template>
        </ElSelect>
      </template>
      <template #DatePickerA="{ model, field }">
        <ElDatePicker
          v-model="model[field]" type="date" placeholder="slot选择日期" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" style="width: 100%" @change="pickerChange"
        />
      </template>
    </MyForm>
  </div>
</template>
