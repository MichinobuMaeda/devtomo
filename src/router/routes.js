
const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'top',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/password',
        name: 'password',
        component: () => import('pages/Password.vue')
      },
      {
        path: '/base',
        name: 'base',
        component: () => import('pages/BaseConverter.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
