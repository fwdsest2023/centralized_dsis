
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'admin', component: () => import('pages/Admin.vue') },
    ]
  },
  {
    path: '/distribution',
    component: () => import('layouts/TabletLayout.vue'),
    children: [
      { path: 'agent', component: () => import('pages/Application/Index.vue') },
      { path: 'admin', component: () => import('pages/Application/Admin.vue') },
    ]
  },
  {
    path: '/distribution',
    component: () => import('layouts/AgentLayout.vue'),
    children: [
      { path: 'dashboard', name: 'distributionDashboard', component: () => import('pages/Application/Dashboard.vue') },
      { path: 'client-list', name: 'distributionClientList', component: () => import('pages/Application/ClientList.vue') },
      { path: 'client-trades', name: 'distributionClientTrades', component: () => import('pages/Application/ClientTrades.vue') },
      { path: 'order-list', name: 'distributionOrderList', component: () => import('pages/Application/OrderList.vue') },
      { path: 'activity-list', name: 'distributionActivityList', component: () => import('pages/Application/ActivityList.vue') },
      { path: 'delivery-list', name: 'distributionDeliveryList', component: () => import('pages/Application/DeliveryList.vue') },
      { path: 'collection-list', name: 'distributionCollectionList', component: () => import('pages/Application/CollectionList.vue') },
    ]
  },

  {
    path: '/agent/',
    component: () => import('layouts/AgentLayout.vue'),
    children: [
      // Sales Management
      { 
        path: 'create-transaction',
        name: 'salesForm',
        component: () => import('pages/Inventory/Sales.vue') 
      },
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'forms', name: 'forms', component: () => import('pages/ORForm.vue') },
      { path: 'print', name: 'print', component: () => import('pages/Print.vue') },
      { path: 'mylist', name: 'mylist', component: () => import('pages/PatientList.vue') },
      { path: 'mysavelist', name: 'mysavelist', component: () => import('pages/SaveList.vue') },
      { path: 'usermanagement', name: 'usermanagement', component: () => import('pages/UserManage.vue') },
      { path: 'crsmanagement', name: 'crsmanagement', component: () => import('pages/Philhealth.vue') },
    ]
  },
  
  
  {
    path: '/clinic-management/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Clinic Management
      { 
        path: 'patient-records',
        name: 'patientRecords',
        component: () => import('pages/Clinic/PatientRecord.vue') 
      },
      { 
        path: 'announcements',
        name: 'announcements',
        component: () => import('pages/Announcement.vue') 
      },
    ]
  },
  {
    path: '/inventory-management/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Inventory Management
      { 
        path: 'stock-list',
        name: 'stockList',
        component: () => import('pages/Inventory/Stock.vue') 
      },
      { 
        path: 'product-list',
        name: 'productList',
        component: () => import('pages/Inventory/Product.vue') 
      },
      { 
        path: 'invoice-list',
        name: 'invoiceList',
        component: () => import('pages/Inventory/Invoice.vue') 
      },
      { 
        path: 'invoice-pending-list',
        name: 'invoicePendingList',
        component: () => import('pages/Inventory/PendingInvoice.vue') 
      },
    ]
  },
  {
    path: '/voucher-management/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Inventory Management
      { 
        path: 'voucher-list',
        name: 'voucherList',
        component: () => import('pages/Vouchers/Index.vue') 
      },
      { 
        path: 'postdated-list',
        name: 'postdatedList',
        component: () => import('pages/Vouchers/Postdated.vue') 
      }
    ]
  },
  {
    path: '/agent-management/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Inventory Management
      { 
        path: 'agent-list',
        name: 'agentList',
        component: () => import('pages/Agents/List.vue') 
      },
      { 
        path: 'delivery-agent-list',
        name: 'deliveryAgentList',
        component: () => import('pages/Agents/Delivery.vue') 
      }
    ]
  },
  {
    path: '/mobile-app-management/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Inventory Management
      { 
        path: 'agent-call-sync',
        name: 'agentCallSync',
        component: () => import('pages/mobile/syncData.vue') 
      },
      { 
        path: 'client-list',
        name: 'clientList',
        component: () => import('pages/mobile/clientList.vue') 
      },
    ]
  },

  {
    path: '/sales/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      // Sales Management
      { 
        path: 'create-transaction',
        name: 'salesForm',
        component: () => import('pages/Inventory/Sales.vue') 
      },
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
