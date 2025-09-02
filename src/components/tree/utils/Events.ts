import type { Ref } from 'vue'
import { unref } from 'vue'
import { TREE_DRAG_TYPE, TREE_EVENT_BUS, TreeEventTypes } from '../bo/Event'

export function useTreeEvents(treeName: Ref | string, eventBus: any): { [key in TreeEventTypes]: (...data: any) => any } {
  return Object.values(TreeEventTypes).reduce((obj: { [key in TreeEventTypes]: any }, key) => {
    obj[key] = (...data: any) => {
      eventBus.emit(TREE_EVENT_BUS + unref(treeName), key, ...data)
    }
    return obj
  }, {} as any)
}

// 获取拖拽结束后的参数配置
export function getNodeDropParams(draggingNode: any, dropNode: any, dropType: any) {
  if (dropType === TREE_DRAG_TYPE.inner) {
    return {
      sourceId: draggingNode.key,
      targetParentId: dropNode?.key,
    }
  }
  const curNode: any
    = dropType === TREE_DRAG_TYPE.before
      ? dropNode.previousSibling
      : dropNode.nextSibling
  const referencePreId = curNode?.previousSibling?.key || ''
  const referenceNextId = curNode?.nextSibling?.key || ''
  // 前后节点只传一个 优先前节点
  return {
    sourceId: draggingNode.key,
    referencePreId,
    referenceNextId: referencePreId ? '' : referenceNextId,
  }
}
