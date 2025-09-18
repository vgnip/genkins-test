import { createWebHistory, createRouter } from 'vue-router'

import TestTree from '../components/test-tree/index.vue'
import TestForm from '../components/test-form/index.vue'

const routes = [
  { path: '/test-tree', component: TestTree },
  { path: '/test-form', component: TestForm },
]

const router = createRouter({
  history: createWebHistory("/admin"),
  routes,

})

export default router