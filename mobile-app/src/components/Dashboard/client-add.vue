<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Clients</q-toolbar-title>
                        <q-space />
                        <q-input
                            class="q-mt-sm"
                            bottom-slots 
                            v-model="searchClient" 
                            label="Search Client" 
                            dense
                        >
                            <template v-slot:append>
                                <q-icon v-if="searchClient !== ''" name="close" @click="searchClient = ''" class="cursor-pointer" />
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:60vh;max-height: 100vh" class="scroll">
                    <q-list >
                        <div v-if="loadClientList.length !== 0">
                            <div v-for="(item, index) in filterList" :key="index">
                                <q-item>
                                    <q-item-section avatar top>
                                        <q-avatar
                                            @click="checkUpdateLocation(item.client.geoLocation) ? updateLocation(item, index) : ''"
                                            :icon="checkUpdateLocation(item.client.geoLocation) ? 'fmd_bad' : item.category[0].icon" 
                                            :color="checkUpdateLocation(item.client.geoLocation) ? 'red' : item.category[0].color" 
                                            text-color="white" 
                                        />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{item.client.storeName.toUpperCase()}}</q-item-label>
                                        <q-item-label caption lines="2">
                                            {{`${item.client.address}, ${item.client.addressDetails.barangay.label}, ${item.client.addressDetails.city.label}, ${item.client.addressDetails.province.label}`}}
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section side top>
                                        <q-btn
                                            :disable="checkUpdateLocation(item.client.geoLocation)"
                                            @click="addClientToCall(item)"
                                            flat 
                                            round
                                            color="blue" 
                                            icon="post_add" 
                                            size="lg" 
                                        />
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                        <div v-if="loadClientList.length === 0">
                            <q-item>
                                <q-item-section class="text-center">
                                    <q-item-label>
                                        <q-icon name="report" color="grey-3" size="7rem" /><br>
                                        <strong>No Store Found!</strong>
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                    </q-list>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="negative" @click="closeModal" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation'
import miscJson from '../../context-data/misc.json'
import moment from 'moment';

export default {
    name: "ClientAdd",
    data() {
        return {
            curDate: moment().format('MM-DD-YYYY'),
            openModal: false,
            loadClientList: [],
            searchClient: ""
        }
    },
    props: {
        modalStatus: {
            type: Boolean
        }
    },
    computed:{
        filterList(){
            if(this.loadClientList.length !== 0){
                this.loadClientList.map((item) => {
                    let category = miscJson.category.filter(el => {
                        return el.id === item.client.categoryId
                    })
                    item.category = category
                    return item
                })


                return this.loadClientList.filter(search => {
                    return search.client.storeName.toLowerCase().includes(this.searchClient.toLowerCase())
                })
            }

            return []
        },
    },
    watch:{
        modalStatus: async function(newVal){
            this.openModal = newVal
            if(newVal){
                this.$nextTick(() => {
                    this.getClientListPref()
                })
            }
        }
    },
    methods: {
        checkUpdateLocation(item){
            if(item.lat === 0 || item.lng === 0){
                return true
            }

            return false
        },
        async updateLocation(item, idx){
            let coordinates = {};
            const perm = await Geolocation.checkPermissions()
            if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                const reqPerm = await Geolocation.requestPermissions();
                if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                    coordinates = await Geolocation.getCurrentPosition();
                } else {
                    return false
                }
            } else {
                coordinates = await Geolocation.getCurrentPosition();
            }

            item.client.geoLocation.lat = coordinates.coords.latitude
            item.client.geoLocation.lng = coordinates.coords.longitude

            // Update the value
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null && value.length !== 0 ? JSON.parse(value) : []
            data[idx] = item

            let storeUpdate = data

            await Preferences.set({
                key: 'clientList',
                value: JSON.stringify(storeUpdate)
            }).then(() => {
                this.clearForm();
                this.$emit('updateStatus', false);
            })
        },
        async addClientToCall(val){
            const { value } = await Preferences.get({ key: this.curDate });
            let data = value !== null ? JSON.parse(value) : []
            
            // check if val is already on the list on this date today
            let filterData = data.filter((el) => {
                return el.client.storeName === val.client.storeName
            })
            
            if(filterData.length >= 1){
                this.$q.dialog({
                    title: 'Error Adding Client To Call',
                    message: 'This store is already',
                    position: 'top',
                    color: 'red'
                })
                return false;
            } else {
                this.$emit('addCallClient', val);
                this.$emit('updateStatus', false);
            }
            
        },
        async getClientListPref(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : []
            this.loadClientList = data.length !== 0 ? data : [];
        },
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        
    }
}
</script>