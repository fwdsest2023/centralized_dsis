<template>
  <q-layout view="lHh Lpr lFf" style="background-color: #e7dfc9;">
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal class="bg-grey-5 text-weight-thin text-blue-white-9 text-center q-pt-lg q-pb-lg">
      <div>{{ `CDSIS App version ${$t('system_version')} ©2023 Created by FWDS` }}</div>
    </q-footer>
  </q-layout>
</template>

<script>
import { SessionStorage } from 'quasar'
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
