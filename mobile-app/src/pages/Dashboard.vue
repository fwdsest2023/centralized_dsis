<template>
  <q-page >
    <q-card flat class="my-card">
      <q-img src="imgs/home_background.jpg" fit="fill">
        <div class="absolute-bottom">
          <div class="text-h6">{{userProfile.fullName}}</div>
          <div class="text-subtitle2">AGENT</div>
        </div>
      </q-img>

      <q-card-actions>
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-primary full-width"
        >
          <q-tab :ripple="false" name="client" icon="store" label="Clients" />
          <q-tab :ripple="false" name="activities" icon="home_repair_service" label="Activities" />
          <q-tab :ripple="false" name="adminWorks" icon="admin_panel_settings" label="Admin" />
        </q-tabs>
      </q-card-actions>
    </q-card>
    <q-tab-panels
      v-model="tab"
      animated
      vertical
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="client">
        <agentBoard />
      </q-tab-panel>

      <q-tab-panel name="activities">
        <clientActivities />
      </q-tab-panel>

      <q-tab-panel name="adminWorks">
        <adminActivities />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
// import clientWidget from '../components/Dashboard/client-widget.vue'
import agentBoard from '../components/Dashboard/agent-board.vue'
import clientActivities from '../components/Dashboard/Activities/Index.vue'
import adminActivities from '../components/Dashboard/Admin/Index.vue'


export default {
  name: 'PageIndex',
  data(){
    return {
      userProfile: {},
      tab: 'client'
    }
  },
  components: {
    agentBoard,
    clientActivities,
    adminActivities
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