
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { name: 'Home', path: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { name: 'HomeSettings', path: 'settings', component: () => import('pages/Settings.vue') },
      { name: 'Profile', path: 'profile', component: () => import('pages/Profile.vue') },
      { name: 'Call History', path: 'callHistory', component: () => import('pages/History.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
