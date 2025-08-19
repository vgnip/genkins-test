<script setup lang="ts">
import { onMounted } from "vue";
import { autoRefresh } from "./utils/auto-update";

// import * as pdfLib from "pdf-dist";



// console.log("pdfLib", pdfLib);
onMounted(() => {
  if (import.meta.env.MODE == "development") {
    autoRefresh();
  }
});
</script>

<template></template>
