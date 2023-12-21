<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white">
      <q-toolbar class="text-black q-pa-md">
        <!-- Logo -->
        <img src="/imgs/logo1.png" style="width: 10%;">
        <!-- <span class="text-h5 text-bold q-ml-md"> Wesleyan University-Philippines  </span> -->
        <q-space />
        <!-- contact sections -->

        <q-list
          v-for="(item, index) in contacts"
          :key="index"
        >
          <q-item>
            <q-item-section top avatar>
              <q-icon :name="item.icon" :color="item.iconColor" size="md" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{item.title}}</q-item-label>
              <q-item-label caption lines="2">{{item.value}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-toolbar>
      <q-toolbar class="bg-red" inset>
        <q-tabs v-model="menuSelected">
          <q-tab name="home" label="Home" />
          <q-tab name="about" label="About" />
          <q-tab name="contact" label="Contact Us" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer reveal class="bg-grey-5 text-weight-thin text-blue-white-9 text-center q-pt-lg q-pb-lg">
      <div>{{ `VCMS ©2023 Created by FWDS` }}</div>
    </q-footer> -->
  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data(){
    return {
      menuSelected: 'home',
      contacts: [
        {
          icon: 'contact_phone',
          iconColor: 'orange',
          title: 'Call',
          value: '(0987) 654 3214',
        },
        {
          icon: 'schedule',
          iconColor: 'blue',
          title: 'Working Time',
          value: 'Mon - Fri 7:00 AM - 6:00 PM',
        },
        {
          icon: 'location_on',
          iconColor: 'red',
          title: 'Address',
          value: 'Lorem Ipsum Address Sample Test',
        },
      ]
    }
  },
  created(){
    let profile = SessionStorage.getItem('userDataLogin');
    
    if(profile || profile !== null){
      this.$router.push('/admin/dashboard')
    } else {
      this.$router.push('/')
    }
  }
})
</script>
