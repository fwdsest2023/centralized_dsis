
<template>
  <q-layout view="lHh LpR lFf" style="background-color: white;">

    <q-header reveal bordered class="bg-primary text-white header-custom-style">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-space />
        <q-chip color="primary" text-color="white" :label="getCurrentRouteName" />
        <q-space />
        
        <q-btn dense flat icon="power_settings_new" @click="logout" />
      </q-toolbar>
      <!-- <q-bar dense>
        <Crumbs :contentLink.sync="menuCrumbs" />
      </q-bar> -->
    </q-header>
    

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered >
      <!-- drawer content -->
      <Profile v-bind="userProfile" />
      <q-separator dark />
      <!-- <SideNav 
        v-for="link in filteredMenus"
        :key="link.title"
        v-bind="link"
        @linkCrumbs="setCrumbsItem"
      /> -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="text-weight-thin text-blue-white-9 footer-custom-style text-center q-pt-xs q-pb-xs">
      <q-btn-group flat dense spread>
        <q-btn flat rounded icon="dashboard" @click="goToMenuPages('/dashboard')"/>
        <q-btn flat rounded icon="account_circle" @click="goToMenuPages('/profile')" />
        <q-btn flat rounded icon="tune" @click="goToMenuPages('/settings')" />
      </q-btn-group>
    </q-footer>
  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import SideNav from '../components/Templates/Sidenav.vue';
import Profile from '../components/Templates/Profile.vue';
import Crumbs from '../components/Templates/Breadcrumbs.vue';

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: 'dashboard',
    code: 101,
    crumbs: [
      {label: '', icon: 'home', link: '/'},
      {label: 'Dashboard', icon: 'dashboard', link: 'dashboard'}
    ]
  },

  // {
  //   title: 'OR Forms',
  //   icon: 'history_edu',
  //   link: 'forms',
  //   code: 102,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'OR Forms', icon: 'history_edu', link: 'forms'}
  //   ]
  // },
  // {
  //   title: 'Print OR',
  //   icon: 'print',
  //   link: 'print',
  //   code: 103,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'Print Form', icon: 'print', link: 'print'}
  //   ]
  // },
  // {
  //   title: 'Patient List',
  //   icon: 'view_list',
  //   link: 'mylist',
  //   code: 104,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'Patient List', icon: 'view_list', link: 'mylist'}
  //   ]
  // },
  // {
  //   title: 'Save List',
  //   icon: 'save',
  //   link: 'mysavelist',
  //   code: 105,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'Saved Data List', icon: 'save', link: 'mysavelist'}
  //   ]
  // },
  // {
  //   title: 'Manage Users',
  //   icon: 'manage_accounts',
  //   link: 'usermanagement',
  //   code: 106,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'Manage Users', icon: 'manage_accounts', link: 'usermanagement'}
  //   ]
  // },
  // {
  //   title: 'Manage CRS',
  //   icon: 'dynamic_form',
  //   link: 'crsmanagement',
  //   code: 107,
  //   crumbs: [
  //     {label: '', icon: 'home', link: '/'},
  //     {label: 'Manage CRS', icon: 'dynamic_form', link: 'crsmanagement'}
  //   ]
  // },
];

export default {
  data(){
    return {
      linksList,
      userProfile: null,
      menuCrumbs: [
        {label: '', icon: 'home', link: '/'},
        {label: 'Dashboard', icon: 'dashboard', link: 'dashboard'}
      ],
      leftDrawerOpen: false,
    }
  },
  components:{
    SideNav,
    Profile,
    Crumbs
  },
  computed: {
    filteredMenus: function(){
      return this.linksList;
    },
    getCurrentRouteName:function(){
      return this.$router.currentRoute._value.name
    }
  },
  created(){
    // SessionStorage.set('userDataLogin', data.jwt);
    let profile = SessionStorage.getItem('userDataLogin');
    if(profile){
      this.userProfile = jwt_decode(profile);
    } else {
      this.$router.push('/')
    }
    
  },
  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    setCrumbsItem(val){
      this.menuCrumbs = val;
    },
    goToMenuPages(page){
      this.$router.push(page)
    },
    logout(){
      localStorage.removeItem('userData');
      SessionStorage.remove('userDataLogin');
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.header-custom-style{
  border-radius: 0px 0px 20px 20px !important;
}
</style>