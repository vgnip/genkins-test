<script setup lang="ts">
import tree from "@/components/tree/index.vue";
import eventBus from "@/components/test-tree/EventBus";

console.log("eventBus", eventBus);
import { computed, reactive, ref } from "vue";
import { ConfigData as treeData } from "./Config";
import { useMethods } from "./Event";
import nodeImg from "./test.svg";
import { Tools } from "@element-plus/icons-vue";
const ConfigData = reactive(treeData);
const treeName = "treeName";
const tagId = ref("");
const treeKey = ref(0);
const treeId = ref(-1);
const nodeNum = ref("5");
const nodeLevel = ref("5");
const nodeId = ref("");
const nodeData: any = ref({});
const lazy = ref(false);
const isError = ref(false);
const isEmpty = ref(false);
const isNodePage = ref(false);
const isLocalPage = ref(true);
const nodePageSize = ref(2);
const showCheckBox = ref(false);
const newNodeStr = ref(``); //
const currentNodeData = ref<any>(null);

const nodeTagNum = computed(() => {
  return Number(nodeNum.value || 3);
});
const nodeTagLevel = computed(() => {
  return Number(nodeLevel.value || 3);
});
const {
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
} = useMethods(
  eventBus,
  treeName,
  tagId,
  treeId,
  nodeId,
  nodeData,
  treeKey,
  isError,
  isEmpty,
  newNodeStr,
  nodeNum,
  nodeLevel,
  lazy,
  nodeTagNum,
  nodeTagLevel
);
function currentChange(data: any) {
  currentNodeData.value = data;
}
</script>

<template>
  <div class="tree-test-page">
    <div class="tree-container">
      <tree
        :key="treeKey"
        :event-bus="eventBus"
        :tree-name="treeName"
        :fetch="treeLoad"
        :options="ConfigData.options"
        :options-filter="optionsFilter"
        :close-pop-on-click="true"
        :lazy="lazy"
        :props="{ isLeaf: 'isLeaf' }"
        draggable
        :node-page="isNodePage"
        :node-page-size="nodePageSize"
        :node-page-local="isLocalPage"
        :show-checkbox="showCheckBox"
        @node-expand="nodeExpand"
        @add="add"
        @node-click="nodeCLick"
        @option-click="optionClick"
        @current-change="currentChange"
      >
        <!-- 节点图标插入 -->
        <template #nodeIcon="{ data }">
          <el-icon v-if="data.id % 2 === 0">
            <Tools />
          </el-icon>
          <img v-else style="width: 14px" :src="nodeImg" alt="" />
        </template>

        <!-- 节点label 插入 -->
        <template #nodeLabel="{ data }">
          <span class="nodeName">{{ data.label }}+2</span>
        </template>

        <!-- 操作下拉项插入 -->
        <template #option="{ item }">
          {{ item.label }}
        </template>

        <!-- 异常插入 -->
        <!-- <template #error-tip>
          <div @click="refreshTree()">异常了 ～～～</div>
        </template> -->

        <!-- 空提示插入 -->
        <!-- <template #empty-tip>
          <div>没数据哈哈哈 ～～～</div>
        </template> -->
      </tree>
    </div>
    <div class="test-option-container">
      <div>
        <el-form label-position="right">
          <el-form-item label="懒加载：">
            <el-switch v-model="lazy" @change="lazyChange" /><br />
          </el-form-item>
          <el-form-item label="显示空：">
            <el-switch v-model="isEmpty" @change="refreshTree" /><br />
          </el-form-item>
          <el-form-item label="显示异常：">
            <el-switch v-model="isError" @change="refreshTree" />
          </el-form-item>
          <el-form-item label="节点分页：">
            <el-switch v-model="isNodePage" @change="refreshTree" />
          </el-form-item>
          <el-form-item label="节点分页size：" v-if="isNodePage">
            <el-input-number
              v-model="nodePageSize"
              class="ls-w-180px"
              clearable
              placeholder="节点分页size"
              @change="refreshTree"
            />
          </el-form-item>

          <el-form-item label="是否本地分页：" v-if="isNodePage">
            <el-switch v-model="isLocalPage" @change="refreshTree" />
          </el-form-item>
          <el-form-item label="显示checkbox：">
            <el-switch v-model="showCheckBox" @change="refreshTree" />
          </el-form-item>
          <el-form-item label="定层级位：">
            <el-input
              v-model="nodeLevel"
              class="is-short"
              clearable
              placeholder="请输入定位层级"
            />
            <el-button @click="setRandomArray"> 随机定位数据 </el-button>
          </el-form-item>
          <el-form-item label="定位id：">
            <el-input
              v-model="tagId"
              placeholder="请输入id: 例：1 或 1,2,3"
              clearable
            />
            <el-button @click="toTagNode"> 定位 </el-button>
          </el-form-item>

          <el-form-item label="刷新树：">
            <el-input
              v-model="nodeNum"
              class="is-short"
              clearable
              placeholder="请输入初始化外层节点数量"
            />
            <el-button @click="refreshTree"> 刷新树 </el-button>
          </el-form-item>

          <el-form-item label="获取节点：">
            <el-input
              v-model="nodeId"
              class="is-short"
              clearable
              placeholder="请输入id"
            />
            <el-button @click="getNode()"> 获取node </el-button>
            <div>
              {{ nodeData }}
            </div>
          </el-form-item>

          <el-form-item label="拖拽恢复：">
            <el-button @click="reBackDragNode()"> 拖拽恢复 </el-button>
          </el-form-item>
          <el-form-item label="节点操作：">
            <el-input
              v-model="newNodeStr"
              placeholder="请输入:(tagId,label,id)=***"
              clearable
            />
            <el-button @click="addChild()"> 新增 </el-button>

            <el-button @click="addChild(false, undefined, true)">
              之前新增
            </el-button>
            <el-button @click="addChild(false, undefined, false)">
              之后新增
            </el-button>
            <el-button @click="delNode()"> 删除 </el-button>
          </el-form-item>

          <el-form-item label="当前选中节点信息：">
            {{ currentNodeData?.label }}____{{ currentNodeData?.id }}
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index.module.scss";
</style>
