<script setup lang="ts">
import "./icons/iconfont.css";
import "./treeNode.scss";
import type {
  TreeItemOptions,
  TreeNodeBaseInfoBO,
  TreePropsBaseBO,
} from "./bo/TreeBO";
import { cloneDeep, isNaN } from "lodash-es";
import { MoreFilled } from "@element-plus/icons-vue";

import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";
import { TREE_DRAG_TYPE, TREE_EVENT_BUS, TreeEventTypes } from "./bo/Event";
import { RequestStatus } from "./bo/TreeBO";
import fileIcon from "./folder.svg";
import NodePage from "./node-page/index.vue";
import {
  handleNodeDataToPage,
  handleNodePageFetchParam,
  handleNodePagePropsData,
} from "./node-page/NodeDataHandle";
import {
  nodeAddChild,
  nodeChange as nodeChangeEvent,
  nodeDrop as nodeDropEvent,
  reBackDragNode as reBackDragNodeEvent,
} from "./NodeEvent";
import treeNodeItem from "./tree-node/index.vue";
import { nodeToOpen, toViewActiveNode } from "./TreeEvent";

defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(defineProps<TreePropsBaseBO>(), {
  treeName: `${new Date().getTime()}`,
  nodeKey: "id",
  nodeLabel: "name",
  showOption: true,
  closePopOnClick: true,
  lazy: false,
  nodePage: false,
  nodePageLocal: true,
  nodePageSize: 50,
  // optionWidth: 144,
  optionIconWidth: 21,
  bagColor: "#f0f7ff",
});
const emit = defineEmits(["scroll"]);
const isDrag = ref(false); // 是否拖拽
const treePop: any = reactive({}); // 更多操作节点开关记录
const dialogShow = ref(false); // 弹窗记录
const dropdownLeft = ref(0); // 操作图标距离左边的距离
const tagList: any = ref([]); // 定位id集 左 -> 右 为  父 -> 子 最后一个为目标节点
const scrollTimer: any = ref(null); // 操作符定位定时器
const expandTimer: any = ref(null); // 定位展开定时器
const treeData: any = ref([]); // 懒加载时数据 //TreeNodeBaseInfoBO
const treeLoadStatus = ref(RequestStatus.FINISH); // 树加载状态
const treeRefreshKey = ref(0); // 树组件刷新key
const dragNode: any = ref(null); // 拖拽节点
const instance: any = getCurrentInstance();
const { proxy } = getCurrentInstance() as any;
/** 树默认绑定属性值 */
const defaultBind = computed(() => {
  return {
    ...handleNodePagePropsData(props),
    data: treeData.value,
    nodeKey: props.nodeKey,
    expandOnClickNode: false,
    load: loadNode,
    lazy: props.lazy,
  };
});

onBeforeMount(() => {
  if (props.showOption) {
    document.addEventListener("click", closePop);
  }
  if (props.eventBus) {
    props.eventBus.on(TREE_EVENT_BUS + props.treeName, treeEventBus);
  }
});

onMounted(() => {
  if (!props.lazy) {
    initTree();
  }
});
onBeforeUnmount(() => {
  closePop();
  if (props.showOption) {
    document.removeEventListener("click", closePop);
  }
  if (props.eventBus) {
    props.eventBus.off(TREE_EVENT_BUS + props.treeName, treeEventBus);
  }
  clearTimeout(scrollTimer);
  clearTimeout(expandTimer);
});
function loadNode(node: any, resolve: any) {
  const isFirstFetch = node?.level === 0;
  if (typeof props.fetch === "function") {
    if (isFirstFetch) {
      treeData.value = [];
      treeLoadStatus.value = RequestStatus.PENDING;
    }
    props
      .fetch(
        props.nodePage
          ? handleNodePageFetchParam(node, props.nodePageSize)
          : node?.data,
        node
      )
      .then((res: any[]) => {
        // 加载成功后需要重新计算操作符位置
        refreshOperationPo();
        setTimeout(() => {
          // 加载定位
          if (
            tagList.value.length &&
            `${node?.data?.[props.nodeKey]}` === `${tagList.value[0]}`
          ) {
            toTagNodeByIdList(tagList.value.slice(1));
          }
        }, 0);
        resolve(
          props.nodePage
            ? handleNodeDataToPage(
                res,
                props.nodePageSize,
                props.props.children || "children",
                props.nodeKey,
                props.nodePageLocal
              )
            : res
        );
        if (isFirstFetch) {
          treeLoadStatus.value = RequestStatus.FINISH;
        }
      })
      .catch(() => {
        node.loaded = false;
        node.loading = false;
        if (isFirstFetch) {
          treeLoadStatus.value = RequestStatus.FAILED;
        }
      });
  }
}

/** 数据加载 --- 全加载 */
function initTree() {
  treeData.value = [];
  if (typeof props.fetch === "function") {
    treeLoadStatus.value = RequestStatus.PENDING;
    const res = props.fetch();
    if (res instanceof Promise) {
      res
        .then((res) => {
          treeLoadStatus.value = RequestStatus.FINISH;
          treeData.value = props.nodePage
            ? handleNodeDataToPage(
                res,
                props.nodePageSize,
                props.props.children || "children",
                props.nodeKey,
                props.nodePageLocal
              )
            : res;
          refreshOperationPo();
        })
        .catch(() => {
          treeLoadStatus.value = RequestStatus.FAILED;
        });
    } else {
      treeLoadStatus.value = RequestStatus.FINISH;
    }
  }
}

/** 获取节点数据绑定信息 */
function getItemBind(node: any, data: TreeNodeBaseInfoBO) {
  return {
    node,
    data,
    showOption: props.showOption,
    dialogShow: dialogShow.value,
    bagColor: props.bagColor,
    dropdownLeft: dropdownLeft.value,
    isDrag: isDrag.value,
    treePop: treePop?.[(data as any)?.[props.nodeKey]],
    options: props.options,
    optionWidth: props.dynamicOptionWidth
      ? props.dynamicOptionWidth(node, data)
      : props.optionWidth,
    optionClass: props.optionClass,
    optionsFilter: props.optionsFilter,
  };
}
/** 打开节点下拉 */
function openPop(node: any) {
  const old = treePop[node?.data?.[props.nodeKey]];
  closePop();
  treePop[node?.data?.[props.nodeKey]] = !old;
}
/** 节点拖拽开始 */
function nodeDragStart(node: any) {
  closePop();
  isDrag.value = true;
  dragNode.value = cloneDeep(node);
}
/** 节点拖拽结束 */
function nodeDragEnd() {
  isDrag.value = false;
}
/** 节点拖拽完成 */
function nodeDrop(draggingNode: any, dropNode: any, dropType: TREE_DRAG_TYPE) {
  if (props.dropEvent && typeof props.dropEvent === "function") {
    props.dropEvent(
      instance.exposed,
      draggingNode,
      dropNode,
      dropType,
      nodeDropEvent
    );
  } else {
    nodeDropEvent(instance.exposed, draggingNode, dropNode, dropType);
  }
  
}
/** 节点打开 */
function nodeExpand() {
  refreshOperationPo();
}
/** 节点关闭 */
function nodeCollapse() {
  refreshOperationPo();
}
/** 节点点击 */
function nodeClick() {
  closePop();
}
/** 节点下拉事件 */
function optionClick(
  item: TreeItemOptions,
  data: TreeNodeBaseInfoBO,
  node: any
) {
  dialogShow.value = !!item.isDialog;
  // 直接以类型抛出
  proxy.$emit(item.type, data, node);
  // 以下事件便于父级组建二次封装
  proxy.$emit("optionClick", item.type, data, node);
  if (props.closePopOnClick) {
    closePop();
  }
}
/** 树监听事件执行 */
function treeEventBus(type: TreeEventTypes, ...data: any) {
  if (Object.values(TreeEventTypes).includes(type)) {
    if (typeof (instance.exposed as any)?.[type] === "function") {
      (instance.exposed as any)?.[type](...data);
    }
  }
}

/** 滚动监听 */
function scrollToLeft(el?: any, time?: number, nth?: number) {
  emit("scroll", el);
  if (!props.showOption) {
    return;
  }
  const compute = () => {
    let e: any = el?.srcElement;
    if (!el || !e) {
      e = proxy.$refs.treeBoxRef;
    }
    if (e) {
      const boxWidth = e.clientWidth;
      const scrollLeft = e.scrollLeft;
      // const scrollWidth = e.offsetWidth - boxWidth;//滚动条宽度
      const resLeft =
        boxWidth +
        scrollLeft -
        Number(isNaN(props.optionIconWidth) ? 21 : props.optionIconWidth);
      // 非滚动定位进行三次定位，避免节点过多导致延迟不够而定位异常
      if (!el && (nth || 0) < 2) {
        scrollToLeft(undefined, undefined, (nth || 0) + 1);
      }
      dropdownLeft.value = resLeft;
    }
  };
  clearTimeout(scrollTimer.value);
  if (el) {
    compute();
  } else {
    scrollTimer.value = setTimeout(compute, time || 300);
  }
}
/** 节点改变 */
function nodeChange(
  type: TREE_DRAG_TYPE,
  data: TreeNodeBaseInfoBO,
  node?: any,
  toActive = false
) {
  nodeChangeEvent(instance.exposed, type, data, node);
  if (toActive) {
    nextTick(() => {
      setCurrentKey(data[props.nodeKey], toActive);
    });
  }
}
/** 更新操作图标位置 */
function refreshOperationPo() {
  scrollToLeft();
}
/** 关闭节点下拉 */
function closePop() {
  Object.keys(treePop).forEach((key) => {
    delete treePop[key];
  });
}
/** 弹窗关闭 */
function closeDialog() {
  dialogShow.value = false;
}
/** 获取树组件 */
function getTree(cb?: (tagTree?: any) => void): any {
  const treeRefs: any = proxy.$refs.treeRefs;
  if (typeof cb === "function") {
    cb(treeRefs);
  }
  return treeRefs;
}
/** 根据id获取 node */
function getNodeById(id: string, cb?: (node?: any) => void) {
  const node = getTree()?.getNode({ [props.nodeKey]: id });
  if (typeof cb === "function") {
    cb(node);
  }
  return node;
}
/** 获取当前选中节点key */
function getCurrentKey(cb?: (key?: string) => void) {
  const key = getTree()?.getCurrentKey();
  if (typeof cb === "function") {
    cb(key);
  }
  return key;
}
/** 设置当前选中节点key 默认会进行定位 */
function setCurrentKey(id: string, toView = true) {
  if (!getTree()) {
    return;
  }
  getTree()?.setCurrentKey(null);
  getTree()?.setCurrentKey(id || null);
  if (toView) {
    navigateCurrentNode();
  }
}
/** 定位到当前选中节点 */
function navigateCurrentNode() {
  toViewActiveNode(instance.exposed);
}
/** 根据id集 进行链路懒加载定位 父 -> 子 最后一个为目标节点 */
function toTagNodeByIdList(ids: string[]) {
  if (Array.isArray(ids) && ids.length) {
    // 判断节点是否存在，存在则直接进行定位
    if (getNodeById(ids[ids.length - 1])) {
      setCurrentKey(ids[ids.length - 1]);
      return;
    }
    nodeToOpen(ids, instance.exposed);
  }
}
/** 重新加载树数据 */
function reloadTreeData() {
  closePop();
  closeDialog();
  tagList.value = [];
  dragNode.value = null;
  if (props.lazy) {
    treeRefreshKey.value++;
  } else {
    initTree();
  }
}
/** 恢复上一次拖拽 */
function reBackDragNode() {
  reBackDragNodeEvent(instance.exposed);
}
/** 添加子节点 */
function append(data: TreeNodeBaseInfoBO, id?: string, toActive = true) {
  if (props.addChild && typeof props.addChild === "function") {
    props.addChild(instance.exposed, data, id, toActive, nodeAddChild);
  } else {
    nodeAddChild(instance.exposed, data, id, toActive);
  }
}
/** 指定节点之前添加 */
function insertBefore(data: TreeNodeBaseInfoBO, id: string, toActive = true) {
  const tagData = getNodeById(id)?.data;
  if (tagData) {
    nodeChange(TREE_DRAG_TYPE.before, data, tagData, toActive);
  }
}
/** 指定节点之后添加 */
function insertAfter(data: TreeNodeBaseInfoBO, id: string, toActive = true) {
  const tagData = getNodeById(id)?.data;
  if (tagData) {
    nodeChange(TREE_DRAG_TYPE.after, data, tagData, toActive);
  }
}
/** 删除节点 */
function remove(id: string) {
  const tagData = getNodeById(id)?.data;
  if (tagData) {
    nodeChange(TREE_DRAG_TYPE.remove, tagData);
  }
}
/** 修改节点 */
function editNode(data: TreeNodeBaseInfoBO) {
  const tagNode = getNodeById(data?.[props.nodeKey]);
  if (tagNode) {
    for (const key in data) {
      tagNode.data[key] = data[key];
    }
  }
}
/** 设置节点选中状态 */
function setChecked(id: string, checked: boolean, checkSub: boolean) {
  const tagNode = getNodeById(id);
  if (tagNode) {
    tagNode.setChecked(id, checked, checkSub);
  }
}
/** 获取元素或者实例 */
function getDom(key: string) {
  return proxy.$refs[key];
}
// 抛出外部可引用属性
defineExpose({
  treeLoadStatus,
  treeRefreshKey,
  dragNode,
  refreshOperationPo,
  closePop,
  closeDialog,
  getTree,
  getNodeById,
  getCurrentKey,
  setCurrentKey,
  navigateCurrentNode,
  toTagNodeByIdList,
  reloadTreeData,
  reBackDragNode,
  append,
  insertBefore,
  insertAfter,
  remove,
  editNode,
  getDom,
  props,
  tagList,
  nodeChange,
  expandTimer,
  initTree,
  setChecked,
});
</script>

<template>
  <div
    ref="treeBoxRef"
    v-loading="treeLoadStatus === RequestStatus.PENDING"
    :class="`designTreeBox ${props.class || ''}`"
    :style="{ ['--tree-node-light-bg']: bagColor }"
    @scroll="(el) => scrollToLeft(el)"
  >
    <el-tree
      v-show="treeLoadStatus === RequestStatus.FINISH"
      ref="treeRefs"
      :key="treeRefreshKey"
      v-bind="{
        ...defaultBind,
        ...$attrs,
        load: defaultBind.load,
        ...(lazy ? { data: treeData } : {}),
      }"
      @node-drag-start="nodeDragStart"
      @node-drag-end="nodeDragEnd"
      @node-drop="nodeDrop"
      @node-click="nodeClick"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
    >
      <template #default="{ node, data }">
        <NodePage
          v-if="data.isNodePageLoadBtnData"
          :data="data"
          :node="node"
          :dropdown-left="dropdownLeft"
          :fetch="props.fetch"
          :insert-before="insertBefore"
          :remove="remove"
          :node-page-local="props.nodePageLocal"
          :node-key="props.nodeKey"
          :node-page-size="props.nodePageSize"
        />
        <tree-node-item
          v-else
          v-bind="{ ...(getItemBind(node, data) as any) }"
          @open-pop="openPop(node)"
          @option-click="optionClick"
        >
          <div
            :ref="`treeNode_${data[props.nodeKey]}`"
            class="nodeTreeWrap nodeContent"
          >
            <!-- 节点显示图标插槽 -->
            <slot name="nodeIcon" :data="data" :node="node">
              <img
                :src="fileIcon"
                alt=""
                style="width: 14px; display: inline-block; margin-right: 4px"
              />
            </slot>
            <!-- 节点显示文字插槽 -->
            <slot name="nodeLabel" :data="data" :node="node">
              <span
                class="nodeName el-tree-node__label"
                :title="data[nodeLabel]"
                >{{ data[nodeLabel] }}</span
              >
            </slot>
          </div>
          <template #option="{ item }">
            <div>
              <!-- 操作下拉项插槽 -->
              <slot name="option" :item="item" :data="data" :node="node">
                {{ item }}
                {{ item.label }}
              </slot>
            </div>
          </template>
          <template #moreIcon>
            <div>
              <!-- 操作符插槽 -->
              <slot name="moreIcon" :data="data" :node="node">
                <el-icon>
                  <MoreFilled />
                </el-icon>
              </slot>
            </div>
          </template>
        </tree-node-item>
      </template>
      <template #empty>
        <div class="tree-load-tip">
          <!-- 空白内容提示插槽 -->
          <slot name="empty-tip"> 无数据 </slot>
        </div>
        <span />
      </template>
    </el-tree>
    <div v-if="treeLoadStatus === RequestStatus.FAILED" class="tree-load-tip">
      <!-- 异常提示插槽 -->
      <slot name="error-tip"> 加载异常 </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index.module.scss";
</style>
