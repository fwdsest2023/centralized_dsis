<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-deep-purple-12" elevated>
      <q-toolbar>
        <q-toolbar-title>
          Centralized Distribution & Inventory
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal class="bg-grey-5 text-weight-thin text-blue-white-9 text-center q-pt-lg q-pb-lg">
      <div>{{ `Centralize Distribution and Sales Inventory System ©2023 Created by FWDS` }}</div>
    </q-footer>
  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  created(){
    let profile = SessionStorage.getItem('userDataLogin');
    
    if(profile || profile !== null){
      this.$router.push('/dashboard')
    } else {
      this.$router.push('/')
    }
  }
})
</script>
