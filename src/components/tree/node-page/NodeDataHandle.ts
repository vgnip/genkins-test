import type { TreeFetchBaseData, TreeNodeBaseInfoBO, TreePropsBaseBO } from '../bo/TreeBO'
import { isFunction } from 'lodash-es'
import { TREE_DRAG_TYPE } from '../bo/Event'

let nodeLocalBtn = 0
// 是否为更多操作节点
export function isMoreBtnNode(node: any) {
  return node?.data?.isNodePageLoadBtnData
}
// 节点inner新增处理
export function handleNodeInnerAdd(refTree: any, data: any, node: any) {
  const moreBtnNode = getMoreBtnNode(node, 1)
  if (moreBtnNode) {
    refTree.insertBefore(data, moreBtnNode)
  } else {
    refTree.append(data, node)
  }
}
// 拖拽完成处理（拖拽入）
export function handleDropInnerNodeDataByNodePage(dropNode: any, nodeChange: any) {
  // 拖入存在更多按钮节点时，需要将更多节点置后
  const childNodes = dropNode.childNodes
  const moreBtnData = getMoreBtnNode(dropNode)?.data
  if (moreBtnData) {
    const lastData = childNodes[childNodes.length - 1]?.data
    nodeChange(TREE_DRAG_TYPE.remove, moreBtnData)
    nodeChange(TREE_DRAG_TYPE.after, moreBtnData, lastData, false)
  }
}
// 获取节点下更多按钮节点信息(node,节点，nth:加载节点在倒数第几个)
function getMoreBtnNode(node: any, nth = 2) {
  const childNodes = node.childNodes
  const tagNode = childNodes?.[(childNodes?.length || 0) - nth]
  if (tagNode?.data?.isNodePageLoadBtnData) {
    return tagNode
  }
  return null
}
// 节点分页数据处理
export function handleNodeDataToPage(data: TreeNodeBaseInfoBO[], nodePageSize: number, childrenKey: string, nodeKey: string, nodePageLocal: boolean) {
  (data || []).forEach((item) => {
    item[childrenKey] = handleNodeDataToPage(item[childrenKey], nodePageSize, childrenKey, nodeKey, nodePageLocal)
  })
  const list: TreeNodeBaseInfoBO[] = nodePageLocal ? (data || []).slice(0, nodePageSize) : data || []
  const otherList = nodePageLocal ? (data || []).slice(nodePageSize) : []
  // 本地分页（存在缓存数据则添加更多操作），非本地分页（返回数据大于等size则添加更多操作）
  if (nodePageLocal ? otherList.length > 0 : list.length >= nodePageSize) {
    nodeLocalBtn++
    if (nodeLocalBtn > 999999) {
      nodeLocalBtn = 0
    }
    const baseId = (new Date().getTime() + nodeLocalBtn).toString(36)
    list.push({
      label: '',
      id: '',
      [nodeKey]: baseId,
      isNodePageLoadBtnData: true,
      localNodeOtherListData: otherList,
      nodePageTagId: list[list.length - 1][nodeKey],
    })
  }
  return list
}
// 节点分页参数处理
export function handleNodePageFetchParam(node: any, pageSize = 50, page = 1, preNodeId?: string) {
  const { data } = node
  if (data) {
    const nodeData: TreeFetchBaseData = { ...(data || {}), page, pageSize, preNodeId, parentNodeId: node.parentKey }
    return nodeData
  }
  return data
}
// 树节点props处理
export function handleNodePagePropsData(props: TreePropsBaseBO) {
  const treeProps = props.props || {}
  if (props.nodePage) {
    return {
      props: {
        ...treeProps,
        disabled: treePropsDisabledFun(treeProps.disabled),
        isLeaf: treePropsLeafFun(treeProps.isLeaf),
        class: treePropsClassFun(treeProps.class),
      },
      allowDrop: treeAllowDropFun(props.allowDrop),
      allowDrag: treeAllowDragFun(props.allowDrag),
    }
  } else {
    return {
      props: treeProps,
      allowDrop: props.allowDrop,
      allowDrag: props.allowDrag,
    }
  }
}
// 叶子节点
function treePropsLeafFun(isLeaf: any) {
  const fun = (data: TreeNodeBaseInfoBO, node: any) => {
    if (data.isNodePageLoadBtnData) {
      return true
    }
    if (isFunction(isLeaf)) {
      return isLeaf(data, node)
    }
    return data?.[isLeaf]
  }
  return fun
}
// class添加
function treePropsClassFun(tagClass: any) {
  const fun = (data: TreeNodeBaseInfoBO, node: any) => {
    if (data.isNodePageLoadBtnData) {
      return 'node_page_load_more_btn'
    }
    if (isFunction(tagClass)) {
      return tagClass(data, node)
    }
    return tagClass
  }
  return fun
}
// disabled添加
function treePropsDisabledFun(disabled: any) {
  const fun = (data: TreeNodeBaseInfoBO, node: any) => {
    if (data.isNodePageLoadBtnData) {
      return true
    }
    if (isFunction(disabled)) {
      return disabled(data, node)
    }
    return data?.[disabled]
  }
  return fun
}
// 允许放置
function treeAllowDropFun(allowDrop: any) {
  const fun = (draggingNode: any, dropNode: any, type: any) => {
    if (dropNode.data.isNodePageLoadBtnData) {
      return false
    }
    if (isFunction(allowDrop)) {
      return allowDrop(draggingNode, dropNode, type)
    }
    return true
  }
  return fun
}
// 允许拖拽
function treeAllowDragFun(allowDrag: any) {
  const fun = (node: any) => {
    if (node.data.isNodePageLoadBtnData) {
      return false
    }
    if (isFunction(allowDrag)) {
      return allowDrag(node)
    }
    return true
  }
  return fun
}
