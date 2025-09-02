import type { TREE_DRAG_TYPE } from './Event'

/** 下拉项 */
export interface TreeItemOptions {
  label: string // 显示名
  type: string // 事件类型
  class?: string // 样式
  isDialog?: boolean // 是否为弹窗事件 用于操作节点背景高亮
}
/** 节点基本信息 */
export interface TreeNodeBaseInfoBO {
  label: string // 节点名称
  id: string // 节点id
  isNodePageLoadBtnData?: boolean // 是否为加载按钮
  nodePageTagId?: string // 分页加载按钮id
  localNodeOtherListData?: TreeNodeBaseInfoBO[] // 本地分页加载节点数据
  [key: string]: any
}
export enum RequestStatus {
  PENDING = 1,
  FINISH = 2,
  FAILED = 3,
}
// 树节点分页请求数据
export interface TreeFetchBaseData {
  [key: string]: any
  page?: number
  size?: number
  parentNodeId?: string
  preNodeId?: string
}
// 树组件配置
export interface TreePropsBaseBO {
  treeName?: string // 组件引用名称 用于事件区分
  nodeKey?: string // 唯一索引
  nodeLabel?: string // 显示字段
  showOption?: boolean // 展示操作
  closePopOnClick?: boolean // 点击下拉项时关闭pop
  class?: string // 树组件样式
  eventBus?: any // 事件监听
  fetch?: (data?: TreeFetchBaseData | any, node?: any) => Promise<any[]> // 数据加载 异步请求
  lazy?: boolean // 是否懒加载
  nodePage?: boolean // 是否分页加载 默认true
  nodePageLocal?: boolean // 是否本地分页加载（所在层级是否本地） 默认true
  nodePageSize?: number // 分页大小 默认50
  options?: TreeItemOptions[] // 下拉项集
  optionWidth?: number // 下拉浮框宽度
  dynamicOptionWidth?: (node: any, data: TreeNodeBaseInfoBO) => number // 动态下拉框宽度
  optionIconWidth?: number // 下拉悬浮图标宽度
  optionClass?: string // 下拉框浮框样式类
  bagColor?: string // 高亮背景颜色
  dropEvent?: any // 拖拽自定义事件
  addChild?: any // 新增子点自定义
  props?: any // 树组件props
  allowDrop?: (draggingNode: any, dropNode: any, type: TREE_DRAG_TYPE) => boolean // 允许放置
  allowDrag?: (node: any) => boolean // 允许拖拽
  optionsFilter?: (
    data: TreeNodeBaseInfoBO,
    node: any,
    options?: TreeItemOptions[]
  ) => TreeItemOptions[] // 下拉项过滤
}
