<template>
    <div>
        <q-toolbar>
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
            
            <q-space />
           <!-- <q-btn
                @click="addClient"
                round 
                color="primary" 
                icon="add_business" 
                size="md"
            /> -->
        </q-toolbar>
        <q-list >
            <div v-if="loadClientList.length !== 0">
                <div v-for="(item, index) in filterList" :key="index">
                    <q-item>
                        <q-item-section avatar top>
                            <q-avatar :icon="item.category[0].icon" :color="item.category[0].color" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{item.client.storeName.toUpperCase()}}</q-item-label>
                            <q-item-label caption lines="2">{{`${item.client.address} - ${item.client.branch}`}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-btn
                                v-if="item.client.status !== 'finish'"
                                @click="item.client.status === 'in-progress' ? stopCall(index) : playCall(index)"
                                flat 
                                round
                                disabled
                                :loading="item.client.loading"
                                :color="item.client.color" 
                                :icon="item.client.icon" 
                                size="md" 
                            />
                            <q-btn
                                v-if="item.client.status === 'finish'"
                                flat 
                                round
                                :loading="item.client.loading"
                                :color="item.client.color" 
                                :icon="item.client.icon" 
                                size="md" 
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
        
        <clientBookingModal
            :modalStatus="openBooking"
            :clientId="inProgress"
            @updateStatus="closeBooking"
            @moveStep="nextStep"
            @orderSubmit="updateData"
         />
        <clientRemarksModal 
            :modalStatus="openRemarks"
            :clientId="inProgress"
            @updateStatus="closeRemarks"
            @moveStep="nextStep"
            @addClientRemarks="updateData"
            @backStep="prevStep"
         />
        <clientSelfieModal 
            :modalStatus="openSelfie"
            :clientId="inProgress"
            @updateStatus="closeSelfie"
            @addClientVisit="updateData"
            @backStep="prevStep"
         />
        <clientAddModal
            :modalStatus="openAdd"
            @updateStatus="closeAddClient"
         />
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import { Geolocation } from '@capacitor/geolocation'
import clientBookingModal from '../client-booking.vue'
import clientRemarksModal from '../client-remarks.vue'
import clientSelfieModal from '../client-selfie.vue'
import clientAddModal from '../client-add.vue'
import { Preferences } from '@capacitor/preferences';
import miscJson from '../../../context-data/misc.json'

export default {
    name: "ClientWidget",
    data() {
        return {
            renderComponent: true,
            loadClientList: [],
            searchClient: '',
            imageSrc: '',
            openBooking: false,
            openRemarks: false,
            openSelfie: false,
            openAdd: false,
            inProgress: null,
            geoLoc: {},
            attendance: {
                startCall: "",
                endCall: "",
                geoLocation: {
                    timeIn: "",
                    timeOut: "",
                    coorIn: {},
                    coorOut: {}
                }
            }
        }
    },
    components:{
        clientBookingModal,
        clientRemarksModal,
        clientSelfieModal,
        clientAddModal
    },
    watch:{
        loadClientList(newVal){
            // LocalStorage.set("clientList", newVal)
        },
        openAdd(){
            this.getClientListPref();
        }
    },
    computed: {
        filterList(){
            if(this.loadClientList.length !== 0){
                let classification = [1,3]
                this.loadClientList.map((item) => {
                    let category = miscJson.category.filter(el => {
                        return el.id === item.client.categoryId
                    })
                    item.category = category
                    return item
                })

                return this.loadClientList.filter(search => {
                    return search.client.storeName.toLowerCase().includes(this.searchClient.toLowerCase()) && classification.includes(search.client.categoryId)
                })
            }

            return []
        },
    },
    created(){
        this.getClientListPref()
    },
    methods: {
        async getClientListPref(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : []
            this.loadClientList = data.length !== 0 ? data : [];
        },
        async removePref(){
            await Preferences.remove({ key: 'clientList' });
        },
        clientList(){
            let list = LocalStorage.getItem('clientList');
            this.loadClientList = list.length !== 0 ? list : [];
        },
        addClient(){
            this.openAdd = true
        },
        closeRemarks(){
            this.openRemarks = false
        },
        closeAddClient(){
            this.openAdd = false
        },
        closeSelfie(){
            this.openSelfie = false
        },
        nextStep(val){
            if(val.nextTo === 'remarks') {
                this.openBooking = false
                this.openSelfie = false
                this.openRemarks = true
            } else if(val.nextTo === 'selfie') {
                this.openBooking = false
                this.openSelfie = true
                this.openRemarks = false
            } else {
                this.openBooking = false
                this.openSelfie = false
                this.openRemarks = false
            }
            
        },
        prevStep(val){
            if(val.nextTo === 'booking') {
                this.openBooking = true
                this.openSelfie = false
                this.openRemarks = false
            } else if(val.nextTo === 'remarks') {
                this.openBooking = false
                this.openSelfie = false
                this.openRemarks = true
            } else {
                this.openBooking = false
                this.openSelfie = false
                this.openRemarks = false
            }
            
        },
        async playCall(index){
            const vm = this;
            
            // check if there is still playing
            let filterCall = this.loadClientList.filter(el => el.client.status === "in-progress")

            if(filterCall.length === 0){
                try {
                    let timeIn = moment(new Date).format("lll")
                    vm.loadClientList[index].client.loading = true;
                    
                    // Check if the Location is granted
                    const perm = await Geolocation.checkPermissions()
                    
                    if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                        const reqPerm = await Geolocation.requestPermissions();
                        if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                            const coordinates = await Geolocation.getCurrentPosition()
                            vm.loadClientList[index].attendance.geoLocation.timeIn = coordinates.timestamp;
                            vm.loadClientList[index].attendance.geoLocation.coorIn = {
                                lat: coordinates.coords.latitude,
                                lng: coordinates.coords.longitude,
                            };
                        } else {
                            return false
                        }
                    } else {
                        const coordinates = await Geolocation.getCurrentPosition()
                        vm.loadClientList[index].attendance.geoLocation.timeIn = coordinates.timestamp;
                        vm.loadClientList[index].attendance.geoLocation.coorIn = {
                            lat: coordinates.coords.latitude,
                            lng: coordinates.coords.longitude,
                        };
                    }

                    this.$nextTick(async () => {
                        vm.loadClientList[index].client.status = "in-progress";
                        vm.inProgress = index
                        vm.loadClientList[index].client.icon = 'fiber_manual_record';
                        vm.loadClientList[index].client.color = 'red';
                        vm.loadClientList[index].client.loading = false;
                        vm.loadClientList[index].attendance.startCall = timeIn;
                        
                        await Preferences.set({
                            key: 'clientList',
                            value: JSON.stringify(vm.loadClientList)
                        }).then(() => {
                            this.openBooking = true;
                        })
                    })
                } catch (error) {
                  alert(JSON.stringify(error))
                }
                
            } else {
                this.$q.dialog({
                    title: 'Error Playing Call',
                    message: 'There is still in-progress call please complete it first before starting new call.',
                    position: 'bottom',
                    color: 'red'
                })

                return false
            }
            
        },
        async stopCall(index){
            try {
                const vm = this;
                let timeOut = moment(new Date).format("lll")

                vm.loadClientList[index].client.loading = true;
                

                // Check if the Location is granted
                const perm = await Geolocation.checkPermissions()
                
                if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                    const reqPerm = await Geolocation.requestPermissions();
                    if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                        const coordinates = await Geolocation.getCurrentPosition()
                        vm.loadClientList[index].attendance.endCall = timeOut;
                        vm.loadClientList[index].attendance.geoLocation.timeOut = coordinates.timestamp;
                        vm.loadClientList[index].attendance.geoLocation.coorOut = {
                            lat: coordinates.coords.latitude,
                            lng: coordinates.coords.longitude,
                        };
                    } else {
                        return false
                    }
                } else {
                    const coordinates = await Geolocation.getCurrentPosition()
                    vm.loadClientList[index].attendance.endCall = timeOut;
                    vm.loadClientList[index].attendance.geoLocation.timeOut = coordinates.timestamp;
                    vm.loadClientList[index].attendance.geoLocation.coorOut = {
                        lat: coordinates.coords.latitude,
                        lng: coordinates.coords.longitude,
                    };
                }


                this.$nextTick(async () => {
                    vm.loadClientList[index].client.status = "finish";
                    vm.loadClientList[index].client.loading = false;
                    vm.loadClientList[index].client.icon = 'check_circle';
                    vm.loadClientList[index].client.color = 'blue';
                    
                    await Preferences.set({
                        key: 'clientList',
                        value: JSON.stringify(vm.loadClientList)
                    }).then(() => {
                        this.getClientListPref()
                    })
                    // LocalStorage.set('clientList', vm.loadClientList)
                    // this.clientList()
                })
            } catch (error) {
                alert(JSON.stringify(error))
            }
            
        },
        async closeBooking(val){
            this.loadClientList[this.inProgress].client.icon = 'play_circle';
            this.loadClientList[this.inProgress].client.color = 'green';
            // Clear the Time IN and OUT
            this.loadClientList[this.inProgress].client.status = "pending";
            this.loadClientList[this.inProgress].attendance.startCall = '';
            this.loadClientList[this.inProgress].attendance.geoLocation.timeIn = '';
            this.loadClientList[this.inProgress].attendance.geoLocation.coorIn = {};
            this.loadClientList[this.inProgress].remarks = [];
            this.loadClientList[this.inProgress].booking = [];
            this.loadClientList[this.inProgress].files = '';

            await Preferences.set({
                key: 'clientList',
                value: JSON.stringify(this.loadClientList)
            }).then(() => {
                this.openBooking = false;
            })

            // LocalStorage.set("clientList", this.loadClientList)
            // this.openBooking = false
        },
        updateData(val){
            this.loadClientList = val
        }
    }
}
</script>
