<template>
  <q-page >
    <q-card flat class="my-card">
      <q-img src="imgs/home_background.jpg" fit="fill">
        <div class="absolute-bottom">
          <div class="text-h6">{{userProfile.fullName}}</div>
        </div>
      </q-img>

      <q-card-actions>
        <q-btn 
          flat 
          round 
          color="primary" 
          icon="arrow_back_ios"
          @click="backToYesterday"
        />

        <q-space />
        <div class="text-center text-bold">
          {{dayToday}} <br>
          {{dateToday}}
        </div>
        <q-space />

        <q-btn 
          flat 
          round 
          color="primary" 
          icon="arrow_forward_ios"
          @click="goToTommorrow"
        />
        <!-- <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-primary full-width"
        >
          <q-tab :ripple="false" name="client" icon="store" label="Clients" />
          <q-tab :ripple="false" name="activities" icon="home_repair_service" label="Activities" />
          <q-tab :ripple="false" name="adminWorks" icon="admin_panel_settings" label="Admin" />
        </q-tabs> -->
      </q-card-actions>
      <q-card-actions>
        <q-select 
          class="col col-xs-6 col-md-6 q-pa-sm"
          outlined 
          v-model="category" 
          :options="categoryList" 
          label="Category" 
          dense 
        />
        <q-space />
        <q-select 
          class="col col-xs-6 col-md-6 q-pa-sm" 
          outlined 
          v-model="branch" 
          :options="branchList" 
          label="Area" 
          dense 
        />
      </q-card-actions>
    </q-card>
    <q-separator />
    <client-list 
      :filteredList="filterListArea"
      :curCallDate="dateToday"
    />
    <!-- <q-tab-panels
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
    </q-tab-panels> -->
  </q-page>
</template>

<script>
import jsonMisc from '../context-data/misc.json'
import jsonBranch from '../context-data/branches.json'
import { SessionStorage } from 'quasar'
import { Preferences } from '@capacitor/preferences';
import jwt_decode from 'jwt-decode'
import clientList from '../components/Dashboard/client-list.vue'
import moment from 'moment';


export default {
  name: 'PageIndex',
  data(){
    return {
      userProfile: {},
      tab: 'client',
      category: {
        value: 0,
        label: "All",
        desc: "All"
      },
      branch: {
        value: 0,
        label: "All",
        code: "All"
      },
      branchList: [],
      dateSum: 1,
      dateToday: moment().format('MMMM D YYYY'),
      dayToday: moment().format('dddd'),

      loadClientList: []
    }
  },
  components: {
    clientList
  },
  computed: {
    getUserProfile: async function(){
      const { value } = await Preferences.get({ key: 'agentToken' });
      let token = value !== null ? value : null;
      if(token !== null){
        this.userProfile = jwt_decode(token);
      } else {
        let profile = SessionStorage.getItem('userDataLogin');
        this.userProfile = jwt_decode(profile);
      }

      return this.userProfile
    },
    filterListArea: function(){
      let res = {
        branch: {...this.branch}, 
        category: {...this.category}
      }
      return res
    },
    currDate(){
      return moment().format('MMMM D YYYY');
    },
    categoryList: function(){
      let res = [];
      let list = jsonMisc.category;
      res = list.map((el) => {
          let opt = {
              value: el.id,
              label: el.catName,
              desc: el.catDesc
          }

          return opt
      });

      res.push({
        value: 0,
        label: "All",
        desc: "All"
      })

      return res
    },
  },
  created(){
    this.getUserProfile.then((res) => {
      this.getBranchList().then(() => {
        // this.getCurrentArea();
      });
    })
  },
  methods:{
    async getBranchList(){
      const { value } = await Preferences.get({ key: 'clientList' });
      let clientlist = value !== null ? JSON.parse(value) : []
      clientlist = clientlist.map((el, _indx) => {
        return el.client.addressDetails.province
      })
      let res = [];
      res = clientlist.map((el) => {
        let opt = {
          value: el.label,
          label: el.label,
          code: el.value
        }

        return opt
      });

      res.push({
        value: 0,
        label: "All",
        code: "All"
      })

      const arrayUniqueByKey = [...new Map(res.map(item =>
      [item['code'], item])).values()];

      this.branchList = arrayUniqueByKey
    },
    async getClientListPref(){
      const { value } = await Preferences.get({ key: 'clientList' });
      let data = value !== null ? JSON.parse(value) : []
      this.loadClientList = data.length !== 0 ? data : [];
    },
    async getCurrentArea(){
      let list = jsonBranch.regions
      let userAreaBranch = list.filter((el) => { return el.id === Number(this.userProfile.branchId)})
      let currArea = this.branchList.filter((el) => { return el.value === userAreaBranch[0].branchName})
      this.branch = currArea[0];
    },
    async goToTommorrow(){
      let tom = moment(this.dateToday).add(1, 'days').startOf('day').format('MMMM D YYYY').toString();
      this.dateToday = tom
      this.dayToday = moment(tom).format('dddd')
    },
    async backToYesterday(){
      let yesterday = moment(this.dateToday).subtract(1, 'days').startOf('day').format('MMMM D YYYY').toString();
      this.dateToday = yesterday
      this.dayToday = moment(yesterday).format('dddd')
    },
  }
}
</script>
<style scoped>
.my-card{
  margin-top: -20px;
}
</style>