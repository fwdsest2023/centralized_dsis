<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';
import { SessionStorage } from 'quasar'
import { Preferences } from '@capacitor/preferences';
import jwt_decode from 'jwt-decode'
import { Network } from '@capacitor/network';
import prodJson from './context-data/products.json'
import {api} from './boot/axios'

export default defineComponent({
  name: 'App',
  data(){
    return {
      userProfile: ''
    }
  },
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
  },
  computed:{
    getUserProfile: async function(){
      const { value } = await Preferences.get({ key: 'agentToken' });
      let token = value !== null ? value : null;
      if(token !== null){
        this.userProfile = jwt_decode(token);
      }
    },
  },
  created(){
    this.getUserProfile
    this.migrateProducts()
    this.checkAppVersion();
  },
  methods:{
    async checkAppVersion(){
      let payload = {
        appVersion: this.$t('app_version')
      }

      api.post('auth/getVersion', payload)
      .then(async (response) => {
          if(response.status <= 200){
            let data = response.data;
            if(data.hasOwnProperty('error')){
              this.$q.dialog({
                title: 'App Version Mismatched',
                message: `Your app version is not updated, please contact your admin for the latest version ${data.currVersion}.`,
                persistent: true
              }).onOk(async () => {
                await Preferences.set({
                  key: 'appVersion',
                  value: data.currVersion
                })
                await Preferences.remove({ key: 'agentToken' });
                this.$router.push('/')
              })
              
            }
          } else {
            this.$q.dialog({
              title: 'Validation Failed',
              message: 'Something went wrong. Please contact your administrator',
              position: 'top'
            }).onOk(async () => {
              await Preferences.remove({ key: 'agentToken' });
              this.$router.push('/')
            })
          }
          
      }).catch((err) => {
          alert(JSON.stringify(err))
      })
    },
    async migrateProducts(){
        // Call Sync API
        api.get('mobile/fetch/product/list')
        .then(async (response) => {
            if(response.status <= 200){
                let pList = response.data.list
                let mappedList = pList.map((el, index) => {
                    let unit = JSON.parse(el.category)
                    let cat = JSON.parse(el.unit)
                    let obj = {
                        id: el.id,
                        productName: el.productName,
                        unit: unit.label,
                        prodForm: "",
                        description: el.description,
                        category: cat.label,
                        sku: el.sku,
                        barcodeType: "C128",
                        stock: el.stock,
                        productCost: el.productCost,
                        productSRP: el.productSRP,
                        hasPriceGroup: el.hasPriceGroup,
                        costGroup: el.hasPriceGroup ? JSON.parse(el.costGroup) : []
                    }

                    return obj
                })
                
                prodJson.products = mappedList
                
            } else {
                this.$q.dialog({
                    title: 'Migration Failed',
                    message: 'Something went wrong. Please contact your administrator',
                    position: 'top'
                })
            }
            
        }).catch((err) => {
            alert(JSON.stringify(err))
        })
    },
  }
})
</script>
