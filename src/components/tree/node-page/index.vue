<script setup lang="ts">
import type { TreeFetchBaseData, TreeNodeBaseInfoBO } from "../bo/TreeBO";
import { onMounted, ref } from "vue";

const {
  data,
  node,
  nodeKey,
  nodePageLocal,
  nodePageSize = 50,
  fetch,
  insertBefore,
  remove,
  dropdownLeft,
} = defineProps<{
  data: TreeNodeBaseInfoBO; // 节点数据
  node: any; // 节点
  nodeKey: string; // 节点key
  nodePageLocal?: boolean; // 是否本地分页加载（所在层级是否本地） 默认false
  nodePageSize?: number; // 分页大小 默认50
  fetch?: any;
  insertBefore: (
    data: TreeNodeBaseInfoBO,
    id: string,
    toActive: boolean
  ) => void; // 前放置节点
  remove: (id: string) => void; // 删除节点
  dropdownLeft: number; // 左边距
}>();

const page = ref(1);
const loading = ref(false);
const localListData = ref<TreeNodeBaseInfoBO[]>([]);
const preNodeId = ref("");

onMounted(() => {
  localListData.value = data.localNodeOtherListData || [];
  preNodeId.value = data.nodePageTagId || "";
});

async function loadMore() {
  loading.value = true;
  page.value++;
  if (nodePageLocal) {
    const list = localListData.value.slice(0, nodePageSize);
    localListData.value = localListData.value.slice(nodePageSize);
    listToInsert(list, localListData.value.length === 0);
  } else {
    // data.nodePageTagId 节点在操作页面下可能已经删除
    const nodeData: TreeFetchBaseData = {
      page: page.value,
      size: nodePageSize,
      preNodeId: preNodeId.value,
      parentNodeId: node.parentKey,
    };
    try {
      const res: any[] = await fetch(nodeData, node);
      listToInsert(res, (res || []).length < nodePageSize);
    } catch (e) {
      console.error("层级分页加载异常：", e);
    }
  }
  loading.value = false;
}
// 数据插入
function listToInsert(list: any[], loaMore: boolean) {
  list.forEach((el) => {
    insertBefore(el, node.key, false);
  });
  if (loaMore) {
    remove(node.key);
  } else {
    preNodeId.value = list[list.length - 1]?.[nodeKey];
  }
}
</script>

<template>
  <div class="nodeItems node-more-btn-container" @click.stop>
    <el-button
      text
      class="table-text-btn ls-z-1 ls-font-size-3"
      :disabled="loading"
      @click="loadMore"
    >
      {{ loading ? "加载中..." : "加载更多" }}
    </el-button>
    <el-button
      v-if="loading"
      text
      :loading="true"
      class="table-text-btn ls-right-0 ls-absolute!"
      :style="dropdownLeft ? { left: `${dropdownLeft}px`, right: 'unset' } : ''"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "./index.module.scss";
</style>
