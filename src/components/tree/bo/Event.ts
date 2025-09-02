export const TREE_EVENT_BUS = 'TREE_EVENT_BUS_' // 树监听事件
/** 数据事件类型 */
export enum TreeEventTypes {
  refreshOperationPo = 'refreshOperationPo', // 更新右侧操作图标的定位 （会进行3次300mm延迟的定位，可频繁重复调用）
  closePop = 'closePop', // 关闭节点下拉
  closeDialog = 'closeDialog', // 弹窗关闭
  getTree = 'getTree', // 获取树组件
  getNodeById = 'getNodeById', // 根据id获取 node
  getCurrentKey = 'getCurrentKey', // 获取当前选中节点key
  setCurrentKey = 'setCurrentKey', // 设置当前选中节点key 默认会进行定位
  navigateCurrentNode = 'navigateCurrentNode', // 定位到当前选中节点
  toTagNodeByIdList = 'toTagNodeByIdList', // 根据id集 进行链路懒加载定位 根据id集 进行链路懒加载定位 父 -> 子 最后一个为目标节点
  reloadTreeData = 'reloadTreeData', // 重新加载树数据
  reBackDragNode = 'reBackDragNode', // 恢复上一次拖拽
  append = 'append', // 添加子节点
  insertBefore = 'insertBefore', // 指定节点之前插入
  insertAfter = 'insertAfter', // 指定节点之后插入
  remove = 'remove', // 删除节点
  editNode = 'editNode', // 修改节点
  setChecked = 'setChecked', // 设置节点选中状态
}
/** 拖拽节点位置类型 */
export enum TREE_DRAG_TYPE {
  before = 'before',
  inner = 'inner',
  after = 'after',
  remove = 'remove',
}
