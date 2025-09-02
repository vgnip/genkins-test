<script setup lang="ts">
import type { TreeItemOptions, TreeNodeBaseInfoBO } from "../bo/TreeBO";
import { getCurrentInstance, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    options?: TreeItemOptions; // 下拉项集
    optionWidth?: number; // 下拉浮框宽度
    optionClass?: string; // 下拉框样式类
    bagColor?: string; // 下拉框样式类
    optionsFilter?: (
      data: TreeNodeBaseInfoBO,
      node: any,
      options?: TreeItemOptions[]
    ) => TreeItemOptions[]; // 下拉项过滤
    showOption?: boolean; // 是否为预览
    isDrag?: boolean; // 是否拖拽
    data?: TreeNodeBaseInfoBO; // 节点数据
    node?: any; // 节点
    treePop?: boolean; // 操作节点控制
    dialogShow?: boolean; // 弹窗记录
    dropdownLeft?: number; // 弹窗记录
  }>(),
  {
    // optionWidth: 144
  }
);
const emit = defineEmits(["openPop", "optionClick"]);
const { proxy } = getCurrentInstance() as any;

const popover = ref(false); // 下拉显隐
let selectNode: any = null;
const oldDo = ref(false); // 记录上一次局部弹窗打开
const activeType = ref("");
const resOptions = ref<TreeItemOptions[]>([]);

/** 找到 el-tree-node__content 所在元素进行背景色修改 */
watch(
  () => props.treePop,
  () => {
    console.log("~~~~~~~~~~~~~")
    activeType.value = "";
    popover.value = props.treePop || false;
    if (!selectNode) {
      selectNode = proxy.$refs.nodeContentRef.parentElement as HTMLEmbedElement;
    }
    oldDo.value = popover.value ? true : props.dialogShow;
    if (selectNode) {
      (selectNode as HTMLElement).style.background =
        (popover.value ? props.bagColor : oldDo.value ? props.bagColor : "") ||
        "";
    }
  }
);
/** 清除高亮背景色 */
watch(
  () => props.dialogShow,
  (val: boolean) => {
    if (!val && oldDo.value && !popover.value) {
      (selectNode as HTMLElement).style.background = "";
      oldDo.value = false;
    }
  }
);
/** 下拉操作 */
function moreDo() {
  let list = (props.options || []) as any[];
  if (typeof props.optionsFilter === "function") {
    list =
      props.optionsFilter(
        props.data as any,
        props.node,
        props.options as any
      ) || [];
  }
  resOptions.value = list;
}
/** 事件 */
function nodeItemEvent(name: string, ...data: any) {
  if (name === "optionClick") {
    activeType.value = data[0].type;
  }
  if (name === "openPop") {
    moreDo();
    popover.value = !popover.value;
  }
  // const emit = defineEmits([name]);
  (emit as any)(name, ...data);
}
onMounted(() => {
  moreDo();
});
</script>

<template>
  <div ref="nodeContentRef" class="nodeItems">
    <slot />
    <el-popover
      v-if="resOptions.length"
      :visible="popover"
      :popper-class="`treeMoreBox ${optionClass || ''}`"
      placement="bottom-end"
      :width="optionWidth"
    >
      <div
        class="treeMoreContent"
        :style="{ ['--tree-node-light-bg']: bagColor }"
      >
        <div
          v-for="(item, index) in resOptions"
          :key="index"
          :class="`${activeType === item.type ? 'is-active' : ''} ${
            item.class || ''
          }`"
          @click="nodeItemEvent('optionClick', item, data, node)"
        >
          <slot name="option" :item="item" />
        </div>
      </div>
      <template #reference>
        <span
          v-show="!isDrag && showOption"
          :class="`treeDrown  ${popover ? 'isOpen' : ''}`"
          :style="
            dropdownLeft ? { left: `${dropdownLeft}px`, right: 'unset' } : ''
          "
          @click.stop="nodeItemEvent('openPop', data, node)"
        >
          <slot name="moreIcon" />
        </span>
      </template>
    </el-popover>
  </div>
</template>
