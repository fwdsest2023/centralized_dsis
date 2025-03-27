
<template>
    <q-layout view="lHh LpR lFf">
  
      <q-header reveal bordered class="bg-green-6 ">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <q-space />
          <q-btn class="q-mr-sm" round dense flat icon="notifications">
              <q-badge floating color="red" rounded transparent>
                  3
              </q-badge>
          </q-btn>
        </q-toolbar>
        <!-- <q-bar dense>
          <Crumbs :contentLink.sync="menuCrumbs" />
        </q-bar> -->
      </q-header>
      
  
      <q-drawer 
        show-if-above 
        v-model="leftDrawerOpen" 
        side="left" 
        bordered
      >
        <!-- drawer content -->
        <Profile v-bind="userProfile" />
        <q-separator dark />
        <SideNav 
          v-for="link in filteredMenus"
          :key="link.title"
          v-bind="link"
          @linkCrumbs="setCrumbsItem"
        />
      </q-drawer>
  
      <q-page-container>
        <q-page class="q-pa-sm">
          <div style="height: 88vh;">
            <router-view />
          </div>
        </q-page>
      </q-page-container>
  
      <!-- <q-footer reveal class="bg-grey-5 text-weight-thin text-blue-white-9 text-center q-pt-lg q-pb-lg">
        <div>{{ `Centralize Distribution and Sales Inventory System ©2023 Created by FWDS` }}</div>
      </q-footer> -->
  
    </q-layout>
  </template>
  
  <script>
  import { LocalStorage, SessionStorage } from 'quasar'
  import jwt_decode from 'jwt-decode'
  import SideNav from '../components/Templates/Sidenav.vue';
  import Profile from '../components/Templates/Profile.vue';
  
  const linksList = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: 'distributionDashboard',
      code: 101,
    },
  ];
  
  export default {
    data(){
      return {
        linksList,
        userProfile: null,
        menuCrumbs: [
          {label: '', icon: 'home', link: '/'},
          {label: 'Dashboard', icon: 'dashboard', link: 'distributionDashboard'}
        ],
        leftDrawerOpen: true,
        miniState: false
      }
    },
    mounted(){},
    components:{
      SideNav,
      Profile,
    },
    computed: {
      filteredMenus: function(){
        return this.linksList;
      }
    },
    created(){
      let profile = SessionStorage.getItem('userDataLogin');
      
      if(profile || profile !== null){
        this.$router.push('/distribution/dashboard')
      } else {
        this.$router.push('/distribution/agent')
      }
    },
    methods: {
      toggleLeftDrawer () {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      setCrumbsItem(val){
        this.menuCrumbs = val;
      },
      logout(){
        localStorage.removeItem('userData');
        SessionStorage.remove('userDataLogin');
        this.$router.push('/')
      }
    }
  }
  </script>