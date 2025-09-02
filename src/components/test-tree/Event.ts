import type { TreeItemOptions, TreeNodeBaseInfoBO } from '@/components/tree/bo/TreeBO';
import { onBeforeMount, type ComputedRef, type Ref } from 'vue';
import { TREE_EVENT_BUS, TreeEventTypes } from '@/components/tree/bo/Event';
import { cloneDeep } from 'lodash-es';
import { initTreeData, randomArr } from './Config';

export function useMethods(eventBus: any, treeName: string, tagId: Ref<string, string>, treeId: Ref<number, number>, nodeId: Ref<string, string>, nodeData: { value: { children: any } }, treeKey: Ref<number, number>, isError: Ref<boolean, boolean>, isEmpty: Ref<boolean, boolean>, newNodeStr: Ref<string, string>, nodeNum: Ref<string, string>, nodeLevel: Ref<string, string>, lazy: Ref<boolean, boolean>, nodeTagNum: ComputedRef<number>, nodeTagLevel: ComputedRef<number>) {
  function newNodeObj(): any {
    const newId = `${new Date().getTime()}`;
    return {
      data: { id: newId, label: `new_${newId}` },
      tagId: '',
      // toActive: true,
    };
  }
  function treeLoad(data: any, node: any): Promise<any> {
    if (node?.level === 0) {
      treeId.value = -1;
    }
    return new Promise((resolve, inject) => {
      setTimeout(() => {
        if (isError.value) {
          // eslint-disable-next-line prefer-promise-reject-errors
          inject();
          return;
        }
        let list = [];
        if (lazy.value) {
          list = isEmpty.value
            ? []
            : Array.from({ length: nodeTagNum.value }).fill(1).map(() => {
              treeId.value++;
              return {
                label: `节点点_${treeId.value}`,
                id: `${treeId.value}`,
                isLeaf: node?.level >= nodeTagLevel.value - 1,
              };
            });
        } else {
          list = isEmpty.value ? [] : initTreeData(nodeNum.value, nodeLevel.value);
        }
        console.log("tree-list", list)
        resolve(list);
      }, 300);
    });
  }
  /** 添加 */
  function add(data: any, node: any) {
    console.log('add---', data, ' ____ ', node);
    addChild(false, data);
  }
  /** 下拉操作所有点击 */
  function optionClick(type: any, data: any) {
    console.log('-----type:,', type);
    console.log('-----data:,', data);
    if (type === 'del') {
      delNode(data);
    } else if (type === 'add') {
      //
    }
  }
  /** 节点展开 */
  function nodeExpand(...data: any) {
    console.log('nodeExpand:---', data);
  }
  /** 节点点击 */
  function nodeCLick(...data: any) {
    console.log('nodeCLick:---', data);
    // copyTextToClipBoard(getIdPathByNode(data[1], 'id').join(','));
    newNodeStr.value = `tagId=${data[0].id}`;
  }
  /** node 定位 */
  function toTagNode() {
    if (tagId.value) {
      const ids = tagId.value.split(',');
      const tagName
        = ids.length > 1 ? TreeEventTypes.toTagNodeByIdList : TreeEventTypes.setCurrentKey;
      const data = ids.length > 1 ? ids : ids[0];
      eventBus.emit(TREE_EVENT_BUS + treeName, tagName, data);
    }
  }
  /** 刷新树 */
  function refreshTree(val?: any) {
    if (!val) {
      eventBus.emit(TREE_EVENT_BUS + treeName, TreeEventTypes.reloadTreeData);
      return;
    }
    treeId.value = -1;
    treeKey.value++;
  }
  /** 生成随机数组 */
  function setRandomArray() {
    const list = randomArr(lazy.value, nodeNum.value, nodeLevel.value);
    tagId.value = list.join(',');
  }
  /** 清除高亮背景 */
  function clearHighlightBg() {
    eventBus.emit(TREE_EVENT_BUS + treeName, TreeEventTypes.closeDialog);
  }
  /** 拖拽恢复 */
  function reBackDragNode() {
    eventBus.emit(TREE_EVENT_BUS + treeName, TreeEventTypes.reBackDragNode);
  }
  /** 获取node */
  function getNode() {
    eventBus.emit(
      TREE_EVENT_BUS + treeName,
      TreeEventTypes.getNodeById,
      nodeId.value,
      (node: any) => {
        console.log('获取结果:', node?.data);
        nodeData.value = cloneDeep(node?.data);
        delete nodeData.value?.children;
      },
    );
  }
  /** 树切换 */
  function lazyChange(val: boolean | string | number) {
    if (!val) {
      tagId.value = '';
      nodeNum.value = '5';
      nodeLevel.value = '5';
    } else {
      tagId.value = '';
      nodeNum.value = '';
      nodeLevel.value = '';
    }
    refreshTree(true);
  }
  /** 添加子节点/编辑节点 */
  function addChild(isEdit = false, data?: any, isBefore?: boolean) {
    const obj = newNodeObj();
    const list = newNodeStr.value.split(',');

    try {
      const strObj: any = {};
      list.forEach((el) => {
        const item = el.split('=');
        strObj[item[0]] = item[1];
      });
      if ('id' in strObj) {
        obj.data.id = strObj.id;
        obj.data.label = `new_${strObj.id}`;
      }
      if ('label' in strObj) {
        obj.data.label = strObj.label;
      }
      if ('toActive' in strObj) {
        obj.toActive = strObj.toActive === 'true';
      }
      if ('tagId' in strObj) {
        obj.tagId = strObj.tagId;
        if (isEdit) {
          obj.data.id = strObj.tagId;
        }
      }
      if (data) {
        obj.tagId = data.id;
      }
    } catch {
      console.error('JSON数据格式错误');
    }
    let eventType = isEdit ? TreeEventTypes.editNode : TreeEventTypes.append;
    if (isBefore === true || isBefore === false) {
      eventType = isBefore ? TreeEventTypes.insertBefore : TreeEventTypes.insertAfter;
    }
    console.log('TREE_EVENT_BUS + treeName--', eventType, obj.data, obj.tagId, obj.toActive)
    eventBus.emit(TREE_EVENT_BUS + treeName, eventType, obj.data, obj.tagId, obj.toActive);
  }
  /** 删除节点 */
  function delNode(data?: any) {
    const tagNodeId = data
      ? data.id
      : newNodeStr.value.split(',').filter(el => el.includes('tagId'))[0];
    if (tagNodeId) {
      eventBus.emit(
        TREE_EVENT_BUS + treeName,
        TreeEventTypes.remove,
        data ? tagNodeId : tagNodeId.split('=')[1],
      );
    }
  }
  /** 节点操作过滤 */
  const optionsFilter: any = (data: TreeNodeBaseInfoBO, node: any, options: TreeItemOptions[]) => {
    return options.filter((el) => {
      return Number(data.id) % 2 === 0
        ? !['toTop', 'toBot', 'dialog', 'add'].includes(el.type)
        : true;
    });
  };


  return {
    treeLoad,
    add,
    optionClick,
    nodeExpand,
    nodeCLick,
    toTagNode,
    setRandomArray,
    clearHighlightBg,
    reBackDragNode,
    refreshTree,
    getNode,
    lazyChange,
    addChild,
    delNode,
    optionsFilter,
  };
}
