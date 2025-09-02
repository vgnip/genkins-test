import { describe, expect, it } from 'vitest'
import { TREE_DRAG_TYPE } from '../../bo/event'
import { getNodeDropParams } from '../events'

describe('getNodeDropParams', () => {
  // Mock节点
  const createMockNode = (key: string, previousSibling?: any, nextSibling?: any) => ({
    key,
    previousSibling,
    nextSibling,
  })

  it('拖拽到目标节点内', () => {
    const draggingNode = createMockNode('draggingKey')
    const dropNode = createMockNode('dropKey')
    const dropType = TREE_DRAG_TYPE.inner

    const result = getNodeDropParams(draggingNode, dropNode, dropType)

    expect(result).toEqual({
      sourceId: 'draggingKey',
      targetParentId: 'dropKey',
    })
  })

  it('拖到到目标节点之前，目标节点有前置节点', () => {
    const draggingNode = createMockNode('draggingKey')
    const previousSibling = createMockNode('previousKey')
    const previousSibling2 = createMockNode('previousKey2', previousSibling)
    const dropNode = createMockNode('dropKey', previousSibling2)

    const result = getNodeDropParams(draggingNode, dropNode, TREE_DRAG_TYPE.before)

    expect(result).toEqual({
      sourceId: 'draggingKey',
      referencePreId: 'previousKey',
      referenceNextId: '',
    })
  })

  it('拖拽到目标节点之后', () => {
    const draggingNode = createMockNode('draggingKey')
    const nextSibling = createMockNode('nextKey')
    const nextSibling2 = createMockNode('nextKey2', nextSibling)
    const dropNode = createMockNode('dropKey', undefined, nextSibling2)

    const result = getNodeDropParams(draggingNode, dropNode, TREE_DRAG_TYPE.after)

    expect(result).toEqual({
      sourceId: 'draggingKey',
      referencePreId: 'nextKey',
      referenceNextId: '',
    })
  })

  it('拖拽到目标节点之前，目标节点无前置节点', () => {
    const draggingNode = createMockNode('draggingKey')
    const previousSibling = createMockNode('previousKey', undefined, createMockNode('previousPreviousKey'))
    const nextSibling = createMockNode('nextKey', createMockNode('nextNextKey'))
    const dropNode = createMockNode('dropKey', previousSibling, nextSibling)

    const result = getNodeDropParams(draggingNode, dropNode, TREE_DRAG_TYPE.before)

    expect(result).toEqual({
      sourceId: 'draggingKey',
      referencePreId: '',
      referenceNextId: 'previousPreviousKey',
    })
  })
})
