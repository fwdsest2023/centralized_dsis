<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';
import { Network } from '@capacitor/network';

export default defineComponent({
  name: 'App',
  mounted(){
    Network.addListener('networkStatusChange', status => {
      if(status.connected){
        this.$q.notify({
          color: 'positive',
          message: 'Your are now Online',
          icon: 'rss_feed',
          position: 'top'
        })
      } else {
        this.$q.notify({
          color: 'negative',
          message: 'Your are offline',
          icon: 'wifi_off',
          position: 'top'
        })
      }
    });
  }
})
</script>
