import { nextTick } from 'vue'

/** 目标节点滚动到可视 */
export function toViewActiveNode(that: any) {
  const targetNode: any = that.getNodeById(that.getCurrentKey())
  const idPathList = getIdPathByNode(targetNode, that.props.nodeKey)
  if (idPathList.length) {
    nodeToOpen(idPathList, that)
  }
}
/** 根据节点获取节点路径 */
function getIdPathByNode(node: any, key: string): string[] {
  if (node && node.level >= 1) {
    return [...getIdPathByNode(node?.parent, key), node.data[key]]
  }
  return []
}
/** 展开节点 : 节点集合 父 -> 子， 最后一个为目标点 */
export function nodeToOpen(idPathList: string[], that: any) {
  if (idPathList.length > 1) {
    const curNode = that.getNodeById(idPathList[0])
    if (!curNode) {
      // 未找到节点
      that.tagList.value = []
      return
    }
    // 非懒加载树 和 已加载节点进入展开节点操作
    if (curNode.loaded || !that.props.lazy) {
      let laterTime = 0
      if (!!curNode.expanded === false) {
        curNode.expanded = true
        laterTime = 210
        toTagKeyNode(idPathList[0], that)
      }
      clearTimeout(that.expandTimer.value)
      that.expandTimer.value = setTimeout(() => {
        nodeToOpen(idPathList.slice(1), that)
      }, laterTime)
    } else {
      that.tagList.value = idPathList
      toTagKeyNode(idPathList[0], that)
      curNode.expand()
    }
  } else {
    if (!that.getCurrentKey()) {
      that.setCurrentKey(idPathList[0], false)
    }
    that.tagList.value = []
    clearTimeout(that.expandTimer.value)
    // 需延迟进行定位
    that.expandTimer.value = setTimeout(() => {
      toTagKeyNode(idPathList[0], that)
    }, 350)
  }
}
/** 定位到指定node */
function toTagKeyNode(id: string, that: any) {
  nextTick(() => {
    const dom: any = that.getDom(`treeNode_${id}`)
    if (dom) {
      const treeBoxRef: any = that.getDom(`treeBoxRef`)
      const box: any = (treeBoxRef as HTMLElement)?.getBoundingClientRect()
      const target: any = dom?.getBoundingClientRect()
      if (
        box?.top > target?.top
        || box?.bottom < target?.bottom
        || box?.left + box?.width < target?.left
      ) {
        dom.scrollIntoView({ behavior: 'smooth' })
      }
      // 定位后，操作节点进行重新定位
      that.refreshOperationPo()
    }
  })
}
