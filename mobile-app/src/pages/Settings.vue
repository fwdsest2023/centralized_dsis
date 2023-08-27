<template>
  <q-page >
    <q-card flat class="my-card">
      <q-img src="imgs/home_background.jpg" fit="fill">
        <div class="absolute-bottom">
          <div class="text-h6">{{userProfile.fullName}}</div>
          <div class="text-subtitle2">AGENT</div>
        </div>
      </q-img>
    </q-card>
    <settingMenu />
  </q-page>
</template>

<script>
import { Preferences } from '@capacitor/preferences';
import { SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import settingMenu from '../components/AppMenu/Index.vue'


export default {
  name: 'PageIndex',
  data(){
    return {
      userProfile: {},
      tab: 'client'
    }
  },
  components: {
    settingMenu
  },
  computed: {
    getUserProfile: async function(){
      const { value } = await Preferences.get({ key: 'agentToken' });
      let token = value !== null ? value : null;
      this.userProfile = jwt_decode(token);
    }
  },
  created(){
    this.getUserProfile
  }
}
</script>
<style scoped>
.my-card{
  margin-top: -20px;
}
</style>