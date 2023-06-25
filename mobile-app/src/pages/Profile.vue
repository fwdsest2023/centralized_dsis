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
    <profileMenu />
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import profileMenu from '../components/AppMenu/profile.vue'


export default {
  name: 'ProfileIndex',
  data(){
    return {
      userProfile: {},
      tab: 'client'
    }
  },
  components: {
    profileMenu
  },
  computed: {
    getUserProfile: function(){
      let profile = SessionStorage.getItem('userDataLogin');
      this.userProfile = jwt_decode(profile);
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