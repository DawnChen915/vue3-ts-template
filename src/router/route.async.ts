// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: {},
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      icon: '',
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/markdown',
    name: 'markdown',
    meta: {
      title: 'markdown示例',
      icon: '',
    },
    component: () => import('@/views/markdown/index.vue'),
  },
  {
    path: '/icon',
    name: 'icon',
    meta: {
      title: 'icon示例',
      icon: '',
    },
    component: () => import('@/views/iconcom/index.vue'),
  },
  {
    path: '/windi',
    name: 'windi',
    meta: {
      title: 'Windi CSS示例',
      icon: '',
    },
    component: () => import('@/views/windi/index.vue'),
  },
  {
    path: '/svg',
    name: 'svg',
    meta: {
      title: 'svg示例',
      icon: '',
    },
    component: () => import('@/views/svgcom/index.vue'),
  },
  {
    path: '/pinia',
    name: 'pinia',
    meta: {
      title: 'pinia示例',
      icon: '',
    },
    component: () => import('@/views/pinia/index.vue'),
  },
  {
    path: '/auto-animate',
    name: 'auto-animate',
    meta: {
      title: 'auto-animate示例',
      icon: '',
    },
    component: () => import('@/views/autoAnimate/index.vue'),
  },
  {
    path: '/use',
    name: 'use',
    meta: {
      title: 'use示例',
      icon: '',
    },
    component: () => import('@/views/use/index.vue'),
  },
  {
    path: '/tableHeader',
    name: 'tableHeader',
    meta: {
      title: 'use示例',
      icon: '',
    },
    component: () => import('@/views/tableHeader/index.vue'),
  },
  {
    path: '/vue2Page',
    name: 'vue2Page',
    meta: {
      title: 'vue2Page生成',
      icon: '',
    },
    component: () => import('@/views/vue2Page/index.vue'),
  },
  {
    path: '/displayGrid',
    name: 'displayGrid',
    meta: {
      title: 'displayGrid',
      icon: '',
    },
    component: () => import('@/views/display/grid.vue'),
  },
];

export default asyncRoutes;
