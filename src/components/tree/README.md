- 该树为公用组件不含业务逻辑，只负责公用部分的展示渲染等交互
  支持以下参数( 具体用法参考demo 路由：/compDemo)
  treeName?: string // 组件引用名称 用于事件区分
  nodeKey?: string // 唯一索引
  nodeLabel?: string // 显示字段
  showOption?: boolean // 展示操作
  closePopOnClick?: boolean // 点击下拉项时关闭pop
  class?: string // 树组件样式
  eventBus?: any // 事件监听
  fetch?: (data?: TreeFetchBaseData, node?: any) => Promise<any[]> // 数据加载 异步请求
  lazy?: boolean // 是否懒加载
  nodePage?: boolean // 是否分页加载 默认false
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

- 注意事项

  1. 节点分页加载按钮占用node节点
  2. 未展示出来的节点不可以定位
  3. 未展示出来的节点无法通过id进行获取
  4. 本地分页时加载按钮会存储本地未展示的list数据
  5. 非本地分页时当加载的节点数据>=nodePageSize时加载按钮会展示出来
  6. 新增节点默认排在最后的不建议开启分页功能（节点默认追加在更多操作节点前，需要自行处理其余情况）

- 更多详细的用法见 src/components/tree/bo 下的 event和treeBO 文件
