
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
      // { path: 'forms', component: () => import('pages/ORForm.vue') },
      // { path: 'print', component: () => import('pages/Print.vue') },
      // { path: 'mylist', component: () => import('pages/PatientList.vue') },
      // { path: 'mysavelist', component: () => import('pages/SaveList.vue') },
      // { path: 'usermanagement', component: () => import('pages/UserManage.vue') },
      // { path: 'crsmanagement', component: () => import('pages/Philhealth.vue') },
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
