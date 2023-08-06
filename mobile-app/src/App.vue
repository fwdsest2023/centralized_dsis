<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';
import { Network } from '@capacitor/network';
import prodJson from './context-data/products.json'
import {api} from './boot/axios'

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
  },
  created(){
    this.migrateProducts()
  },
  methods:{
    async migrateProducts(){
        // Collection of data
        // Loading part
        // this.clearFinishData()
        // return

        // Call Sync API
        api.get('mobile/fetch/product/list')
        .then(async (response) => {
            if(response.status <= 200){
                // this.$q.dialog({
                //     title: response.data.title,
                //     message: response.data.message,
                //     position: 'top'
                // })


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
