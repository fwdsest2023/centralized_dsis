<template>
    <div class="q-pa-sm">
        <q-list  padding class="rounded-borders">
            <q-item v-for="(item, index) in filteredSettings" :key="index">
                <q-item-section avatar top>
                    <q-avatar v-bind="item.avatar" />
                </q-item-section>

                <q-item-section>
                <q-item-label lines="1">
                    {{ item.label }} 
                    <q-badge v-if="index === 0" rounded size :color="item.notSync ? 'red' : 'green' " />
                </q-item-label>
                <q-item-label caption>{{item.caption}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn 
                        flat 
                        round
                        :loading="item.loading"
                        @click="item.action"
                        :disabled="index===0 && !item.notSync"
                        :color="item.sides.color" 
                        :icon="item.sides.icon"
                    />
                    <!-- <q-icon :name="item.sides.icon" :color="item.sides.color" /> -->
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import { Preferences } from '@capacitor/preferences';
import prodJson from '../../context-data/products.json'

export default {
    name: "SettingPAge",
    data() {
        return {
            curDate: moment().format('MM-DD-YYYY'),
            tab: 'mails',
            splitterModel: 25,
            expanded: false,
            settingSearch: '',
            settingList: [
                {
                    avatar: {
                        icon: 'sync',
                        color: 'primary',
                        textColor: 'white'
                    },
                    label: 'Sync Data',
                    caption: 'Sync your data to create your record for today.',
                    sides:{
                        icon: 'cloud_sync',
                        color: 'grey'
                    },
                    notSync: true,
                    loading: false,
                    action: () => {return this.syndDataToDev()}
                },
                {
                    avatar: {
                        icon: 'inventory',
                        color: 'orange',
                        textColor: 'white'
                    },
                    label: 'Update Products',
                    caption: 'This will update you product list for booking purpose',
                    sides:{
                        icon: 'download_for_offline',
                        color: 'green'
                    },
                    notSync: false,
                    loading: false,
                    action: () => {return this.migrateProducts()}
                },
                {
                    avatar: {
                        icon: 'storefront',
                        color: 'deep-purple',
                        textColor: 'white'
                    },
                    label: 'Update Client Data',
                    caption: 'Migrate and update the client data from the server ',
                    sides:{
                        icon: 'backup',
                        color: 'blue'
                    },
                    notSync: false,
                    loading: false,
                    action: () => {return this.uploadFetchClients()}
                },
                {
                    avatar: {
                        icon: 'store_mall_directory',
                        color: 'primary',
                        textColor: 'white'
                    },
                    label: 'Download Client',
                    caption: 'Fetch the latest update of your client',
                    sides:{
                        icon: 'cloud_download',
                        color: 'green'
                    },
                    notSync: false,
                    loading: false,
                    action: () => {return this.getAgentClients()}
                },
            ]
        }
    },
    computed:{
        filteredSettings: function(){
            return this.settingList.filter(search => {
                return search.label.toLowerCase().includes(this.settingSearch.toLowerCase())
            })
        },
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        clData: async function(){
            const { value } = await Preferences.get({ key: this.curDate });
            let data = value !== null ? JSON.parse(value) : []
            let list = data.length !== 0 ? data : [];
            return list.length !== 0 ? list : [];
        }
    },
    
    created(){
        this.checkUnsyncData()
        // this.clearFinishData()
    },
    methods: {
        moment,
        async checkUnsyncData(){
            let filtered = await this.clData
            let check = filtered.length === 0;
            this.settingList[0].notSync = !check
            this.settingList[0].sides = !check ? {
                icon: 'cloud_sync',
                color: 'blue'
            } : {
                icon: 'cloud_sync',
                color: 'grey'
            }
        },
        async syndDataToDev(){
            const listData = await this.clData

            if(listData.length === 0){
                alert('There is no data to sync')
                return false
            }
            // Collection of data
            let payload = {
                agentId: Number(this.user.userId),
                category: "CLIENT",
                listData: JSON.stringify(listData)
            }
            // alert(JSON.stringify(payload))
            // return

            // Loading part
            this.settingList[0].loading = true
            // this.clearFinishData()
            // return

            // Call Sync API
            api.post('mobile/sync/data', payload)
            .then((response) => {
                if(response.status <= 200){
                    this.$q.dialog({
                        title: response.data.title,
                        message: response.data.message,
                        position: 'top'
                    })

                    this.$nextTick(()=>{
                        this.clearFinishData()
                        this.checkUnsyncData()
                        this.settingList[0].loading = false
                    })
                    
                } else {
                    this.$q.dialog({
                        title: 'Sync Failed',
                        message: 'Something went wrong. Please contact your administrator',
                        position: 'top'
                    })
                }
                
            }).catch((err) => {
                alert(JSON.stringify(err))
                this.settingList[0].loading = false
            })
        },
        async migrateProductAdminUse(){
            // Collection of data
            let payload = {
                products: prodJson.products
            }
            // alert(JSON.stringify(payload))
            // return

            // Loading part
            this.settingList[1].loading = true
            // this.clearFinishData()
            // return

            // Call Sync API
            api.post('mobile/product/migrate', payload)
            .then((response) => {
                if(response.status <= 200){
                    this.$q.dialog({
                        title: response.data.title,
                        message: response.data.message,
                        position: 'top'
                    })

                    this.$nextTick(()=>{
                        this.settingList[1].loading = false
                    })
                    
                } else {
                    this.$q.dialog({
                        title: 'Migration Failed',
                        message: 'Something went wrong. Please contact your administrator',
                        position: 'top'
                    })
                }
                
            }).catch((err) => {
                alert(JSON.stringify(err))
                this.settingList[1].loading = false
            })
        },
        async migrateProducts(){
            // Collection of data
            // Loading part
            this.settingList[1].loading = true
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
                    this.$nextTick(()=>{
                        this.settingList[1].loading = false
                    })
                    
                } else {
                    this.$q.dialog({
                        title: 'Migration Failed',
                        message: 'Something went wrong. Please contact your administrator',
                        position: 'top'
                    })
                }
                
            }).catch((err) => {
                alert(JSON.stringify(err))
                this.settingList[1].loading = false
            })
        },
        async uploadFetchClients(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : []

            if(data.length === 0){
                this.$q.dialog({
                    title: 'Upload Failed',
                    message: 'There is no data to be uploaded. Please add a client to sync to the server',
                    position: 'top'
                })
                return false;
            }
            // Collection of data
            // Loading part
            this.settingList[2].loading = true
            let payload = {
                aid: Number(this.user.userId),
                clients: data,
            }

            // Call Sync API
            api.post('mobile/client/migrate', payload)
            .then(async (response) => {
                if(response.status <= 200){
                    
                    this.$nextTick(()=>{
                        this.settingList[2].loading = false
                    })
                    
                } else {
                    this.$q.dialog({
                        title: 'Migration Failed',
                        message: 'Something went wrong. Please contact your administrator',
                        position: 'top'
                    })
                }
                
            }).catch((err) => {
                alert(JSON.stringify(err))
                this.settingList[1].loading = false
            })
        },
        async clearFinishData(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : []
            const list = data.length !== 0 ? data : [];
            let vm = this
            list.map((el) => {
                el.client.status = 'pending'
                el.client.icon = 'play_circle'
                el.client.color = 'green'
                el.client.loading = false
                el.files = ''
                el.booking = []
                el.remarks = []
                el.attendance = {
                    startCall: "",
                    endCall: "",
                    geoLocation: {
                        timeIn:"",
                        timeOut:"",
                        coorIn: {},
                        coorOut: {}
                    }
                }
                return el
            });

            await Preferences.set({
                key: 'clientList',
                value: JSON.stringify(list)
            }).then(() => {
                vm.checkUnsyncData()
            })
            
        },
        async getAgentClients(){
            let apiURL = Number(this.user.userType) === 1 ?
            "mobile/fetch/client/admin" : 
            "mobile/fetch/client/agent";

            if(Number(this.user.userType) === 1){
                this.fetchAdmin(apiURL)
            } else {
                this.fetchAgent(apiURL)
            }
        },
        async fetchAdmin(url){
            api.get(url)
            .then(async (response) => {
                if(response.status <= 200){
                    let clientData = response.data.list;

                    await Preferences.set({
                        key: 'clientList',
                        value: JSON.stringify(clientData)
                    }).then(() => {
                        alert("Your Client list is updated")
                    })
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
        async fetchAgent(url){
            let payload = {
                aid: Number(this.user.userId)
            }
            api.post(url, payload)
            .then(async (response) => {
                if(response.status <= 200){
                    let clientData = response.data.list;

                    await Preferences.set({
                        key: 'clientList',
                        value: JSON.stringify(clientData)
                    }).then(() => {
                        alert("Your Client list is updated")
                    })
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
}
</script>
