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
            <q-btn
                @click="addClient"
                round 
                color="primary" 
                icon="add_business" 
                size="md"
            />
            
        </q-toolbar>
        <q-list >
            <div v-if="loadClientList.length !== 0">
                <div v-for="(item, index) in filterList" :key="index">
                    <q-item clickable @click="viewClientDetails(item, index)">
                        <q-item-section avatar top>
                            <q-avatar :icon="item.category[0].icon" :color="item.category[0].color" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{item.client.storeName.toUpperCase()}}</q-item-label>
                            <q-item-label caption lines="2">
                                {{`${item.client.address}, ${item.client.addressDetails.barangay.label}, ${item.client.addressDetails.city.label}, ${item.client.addressDetails.province.label}`}}
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-btn
                                flat 
                                round
                                :loading="item.client.loading"
                                color="blue" 
                                icon="edit_note" 
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
        
        
        <!-- <clientBookingModal
            :modalStatus="openBooking"
            :clientId="inProgress"
            @updateStatus="closeBooking"
            @moveStep="nextStep"
            @orderSubmit="updateData"
         />
        <clientRemarksModal 
            :modalStatus="openRemarks"
            :clientId="inProgress"
            :transType="transType"
            @updateStatus="closeRemarks"
            @moveStep="nextStep"
            @addClientRemarks="updateData"
            @backStep="prevStep"
            @closeBack="closeBooking"
         />
        <clientSelfieModal 
            :modalStatus="openSelfie"
            :clientId="inProgress"
            @updateStatus="closeSelfie"
            @addClientVisit="updateData"
            @backStep="prevStep"
            @finishStep="stopCall"
         /> -->
        <clientAddModal
            :modalStatus="openAdd"
            @updateStatus="closeAddClient"
            @addCallClient="pushClientToDate"
         />
        <clientDetails
            :modalStatus="openDetails"
            :clientData="selectedClient"
            :clientIndex="clientIndex"
            @updateStatus="closeClientDetails"
            @addCallClient="pushClientToDate"
         />
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import { Geolocation } from '@capacitor/geolocation'
import clientBookingModal from './client-booking.vue'
import clientRemarksModal from './client-remarks.vue'
import clientSelfieModal from './client-selfie.vue'
import clientAddModal from './client-add.vue'
import clientDetails from './client-details.vue'
import { Preferences } from '@capacitor/preferences';
import miscJson from '../../context-data/misc.json'

export default {
    name: "ClientListWidget",
    props: {
        filteredList: {
            type: Object
        },
        curCallDate: {
            type: String
        }
    },
    data() {
        return {
            curDate: moment().format('MM-DD-YYYY'),
            renderComponent: true,
            loadClientList: [],
            searchClient: '',
            imageSrc: '',
            openBooking: false,
            openRemarks: false,
            openSelfie: false,
            openAdd: false,
            openDetails: false,
            inProgress: null,
            geoLoc: {},

            selectedClient:{},
            clientIndex: 0,
        }
    },
    components:{
        clientBookingModal,
        clientRemarksModal,
        clientSelfieModal,
        clientAddModal,
        clientDetails
    },
    watch:{
        openAdd(){
            this.getClientListPref();
        },
        curCallDate(newVal){
            let formatDate = moment(newVal).format('MM-DD-YYYY')

            if(newVal){
                this.curDate = formatDate
                this.getClientListPref();
            }
        }
    },
    computed: {
        filterList(){
            if(this.loadClientList.length !== 0){
                this.loadClientList.map((item) => {
                    let category = miscJson.category.filter(el => {
                        return el.id === item.client.categoryId
                    })
                    item.category = category
                    return item
                })

                let filterCatId = this.filteredList.category.value;
                let filterBranch = this.filteredList.branch.label;
                return this.loadClientList.filter(search => {
                    let filtered = search.client.storeName.toLowerCase().includes(this.searchClient.toLowerCase()) && 
                    search.client.categoryId === filterCatId && 
                    search.client.addressDetails.province.label === filterBranch;
                    return filtered
                })
            }

            return []
        },
    },
    created(){
        // this.clientList()
        // this.removePref()
        this.getClientListPref()

    },
    methods: {
        viewClientDetails(val, idx){
            this.selectedClient = val
            this.clientIndex = idx

            this.openDetails = true
        },
        cancelTransaction(){
            this.$emit('closeClient');
        },
        async getClientListPref(){
            const { value } = await Preferences.get({ key: this.curDate });
            let data = value !== null ? JSON.parse(value) : []
            this.loadClientList = data.length !== 0 ? data : [];
        },
        async pushClientToDate(val){
            const { value } = await Preferences.get({ key: this.curDate });
            let data = value !== null ? JSON.parse(value) : []
            data.push(val)
            await Preferences.set({
                key: this.curDate,
                value: JSON.stringify(data)
            }).then(() => {
                this.getClientListPref();
            })
        },
        async removePref(){
            await Preferences.remove({ key: 'clientList' });
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
        closeClientDetails(){
            this.openDetails = false
        },
        closeSelfie(){
            this.getClientListPref()
            
            this.$nextTick(() => {
                this.openSelfie = false
            })
            
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
                            // alert(JSON.stringify(vm.loadClientList[index]))
                            if(this.transType === 'Client Visit'){
                                this.openRemarks = true;
                            } else {
                                this.openBooking = true;
                            }
                            
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
                        this.$emit('closeClient');
                    })
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
                if(this.transType === 'Client Visit'){
                    this.openRemarks = false;
                } else {
                    this.openBooking = false;
                }
            })
        },
        updateData(val){
            this.loadClientList = val
        }
    }
}
</script>
