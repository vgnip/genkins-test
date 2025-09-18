import { cloneDeep } from 'lodash-es'
import { computed, ref, unref } from 'vue'

const colors = [
  {
    value: '#E63415',
    label: 'red',
  },
  {
    value: '#FF6600',
    label: 'orange',
  },
  {
    value: '#FFDE0A',
    label: 'yellow',
  },
  {
    value: '#1EC79D',
    label: 'green',
  },
  {
    value: '#14CCCC',
    label: 'cyan',
  },
  {
    value: '#4167F0',
    label: 'blue',
  },
  {
    value: '#6222C9',
    label: 'purple',
  },
]

const valueSelectA = ref<string[]>([])
const valueSelectB = ref<string[]>([])
const options = ref<Recordable[]>([])
for (let i = 1; i < 10; i++) {
  options.value.push({ label: `选项${i}`, value: `${i}` })
}
const optionsA = computed(() => {
  return cloneDeep(unref(options)).map((op) => {
    op.disabled = unref(valueSelectB).includes(op.value)
    return op
  })
})
const optionsB = computed(() => {
  return cloneDeep(unref(options)).map((op) => {
    op.disabled = unref(valueSelectA).includes(op.value)
    return op
  })
})
const treeData = [
  {
    value: '1',
    label: '一级 1',
    children: [
      {
        value: '1-1',
        label: '二级 1-1',
        children: [
          {
            value: '1-1-1',
            label: '三级 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '一级 2',
    children: [
      {
        value: '2-1',
        label: '二级 2-1',
        children: [
          {
            value: '2-1-1',
            label: '三级 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: '二级 2-2',
        children: [
          {
            value: '2-2-1',
            label: '三级 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: '一级 3',
    children: [
      {
        value: '3-1',
        label: '二级 3-1',
        children: [
          {
            value: '3-1-1',
            label: '三级 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: '二级 3-2',
        children: [
          {
            value: '3-2-1',
            label: '三级 3-2-1',
          },
        ],
      },
    ],
  },
]

function customVaildate(_: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  if (!Number.isInteger(value)) {
    callback(new Error('Please input digits'))
  } else {
    if (value < 18) {
      callback(new Error('Age must be greater than 18'))
    } else {
      callback()
    }
  }
}

export default {
  colors,
  optionsA,
  optionsB,
  customVaildate,
  treeData,
}
