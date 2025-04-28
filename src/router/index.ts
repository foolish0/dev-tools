import { createRouter, createWebHistory } from 'vue-router'
import JsonFormatter from '../views/formatter/JsonFormatter.vue'
import Base64 from '../views/encoder/Base64.vue'
import UuidGenerator from '../views/generator/UuidGenerator.vue'
import TimeConverter from '../views/converter/TimeConverter.vue'

const routes = [
  {
    path: '/',
    redirect: '/formatter/json'
  },
  {
    path: '/formatter/json',
    name: 'JsonFormatter',
    component: JsonFormatter,
    meta: {
      title: 'JSON格式化'
    }
  },
  {
    path: '/encoder/base64',
    name: 'Base64',
    component: Base64,
    meta: {
      title: 'Base64编解码'
    }
  },
  {
    path: '/generator/uuid',
    name: 'UuidGenerator',
    component: UuidGenerator,
    meta: {
      title: 'UUID生成器'
    }
  },
  {
    path: '/converter/time',
    name: 'TimeConverter',
    component: TimeConverter,
    meta: {
      title: '时间格式转换'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router