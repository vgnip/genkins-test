import type { TreeNodeBaseInfoBO } from './bo/TreeBO'
import { TREE_DRAG_TYPE } from './bo/Event'
import { handleDropInnerNodeDataByNodePage, handleNodeInnerAdd } from './node-page/NodeDataHandle'

/** 节点移动失败后还原 */
export function reBackDragNode(that: any) {
  const node = that.dragNode.value
  if (!node) {
    return
  }
  const curKey = that.getCurrentKey()
  that.nodeChange(TREE_DRAG_TYPE.remove, node.data)
  if (node.previousSibling) {
    that.nodeChange(TREE_DRAG_TYPE.after, node.data, node.previousSibling.data)
  } else if (node.nextSibling) {
    that.nodeChange(TREE_DRAG_TYPE.before, node.data, node.nextSibling.data)
  } else {
    that.nodeChange(TREE_DRAG_TYPE.inner, node.data, node.parent.data)
  }
  that.getTree()?.setCurrentKey(curKey)
}
/** 树节点添加、删除 */
export function nodeChange(that: any, type: string, data: any, node?: any) {
  if (!data) {
    return
  }
  const refTree: any = that.getTree()
  if (type === TREE_DRAG_TYPE.inner) {
    if (that.props.nodePage) {
      handleNodeInnerAdd(refTree, data, node)
    } else {
      refTree.append(data, node)
    }
  } else if (type === TREE_DRAG_TYPE.before) {
    refTree.insertBefore(data, node)
  } else if (type === TREE_DRAG_TYPE.after) {
    refTree.insertAfter(data, node)
  } else if (type === TREE_DRAG_TYPE.remove) {
    refTree.remove(data)
  }
  that.refreshOperationPo()
}
/** 拖拽完成处理 */
export function nodeDrop(that: any, drag: any, drop: any, type: string) {
  const curKey = that.getCurrentKey()
  if (type === TREE_DRAG_TYPE.inner) {
    // 节点分页时，拖入需要特殊处理
    if (that.props.nodePage) {
      handleDropInnerNodeDataByNodePage(drop, (...val: any) => (nodeChange as any)(that, ...val))
    }
    // 懒加载叶子节点需要以下处理才能显示展开符号
    if (that.props.lazy && drop.isLeaf) {
      drop.loaded = true
      drop.isLeaf = false
    }
    // 切换key的选中便于非懒加载中节点展开符号的显示 (不会触发发 nodeClick的选中事件)
    if (!that.props.lazy) {
      that.getTree()?.setCurrentKey(drop.data[that.props.nodeKey])
      that.getTree()?.setCurrentKey(null)
      that.getTree()?.setCurrentKey(curKey)
    }
  }
  that.getTree()?.setCurrentKey(curKey)
}

/** 新增子集节点 */
export function nodeAddChild(
  that: any,
  data: TreeNodeBaseInfoBO,
  tagId?: string,
  toActive = false,
) {
  if (!tagId) {
    topLevelAdd(that, data, toActive)
    return
  }
  const node: any = that.getNodeById(tagId)
  if (node) {
    if (!node?.loaded && that.props.lazy) {
      node.expand()
      if (toActive) {
        that.tagList.value = [tagId, data[that.props.nodeKey]]
      }
      return
    }
    that.nodeChange(TREE_DRAG_TYPE.inner, data, node, toActive)
  }
}
/** 顶层节点添加数据 */
function topLevelAdd(that: any, data: any, toActive = false) {
  const node: any = that.getTree()?.root
  if (node) {
    that.nodeChange(TREE_DRAG_TYPE.inner, data, node, toActive)
  }
}
