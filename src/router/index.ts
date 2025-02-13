import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: '仪表盘',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'websites',
        name: '网站',
        component: () => import('../views/Websites.vue')
      },
      {
        path: 'nginx',
        name: 'Nginx',
        component: () => import('../views/Nginx.vue')
      },
      {
        path: 'apache',
        name: 'Apache',
        component: () => import('../views/Apache.vue')
      },
      {
        path: 'mysql',
        name: 'MySQL',
        component: () => import('../views/MySQL.vue')
      },
      {
        path: 'php',
        name: 'PHP',
        component: () => import('../views/PHP.vue')
      },
      {
        path: 'settings',
        name: '设置',
        component: () => import('../views/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 