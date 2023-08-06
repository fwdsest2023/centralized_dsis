<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Performed Activity</q-toolbar-title>
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:50vh;max-height: 100vh" class="scroll">
                    <q-list>
                        <q-item v-for="(item, index) in activities" tag="label" :key="index" v-ripple>
                            <q-item-section side top>
                                <q-toggle
                                    :disable="callDone || !callStarted"
                                    @update:model-value="item.action"
                                    v-model="item.active"
                                />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>{{item.title}}</q-item-label>
                                <q-item-label caption>
                                    {{item.caption}}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    
                    <div v-if="clientInfo.booking.length > 0">
                        <q-separator />
                        <q-toolbar>
                            <div class="text-h6">Booking Summary</div>
                            <q-space/>
                            <q-btn flat icon="edit_note" label="Edit" color="blue" @click="openBookingDetails"/>
                        </q-toolbar>
                        <q-list>
                            <q-item v-for="(itm, indx) in clientInfo.booking" :key="indx">

                                <q-item-section>
                                    <q-item-label>{{itm.itemName}}</q-item-label>
                                    <q-item-label caption lines="2">PRICE: {{itm.price}}</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label>QTY: {{itm.qty}}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-card-section>

                <q-separator />
                <q-card-section>
                    <q-input
                        v-model="remarks"
                        outlined
                        type="textarea"
                        placeholder="Remarks"
                        counter
                        limit="500"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-toolbar>
                        <q-btn 
                            v-if="!callStarted && !callDone" 
                            color="green" 
                            icon="call" 
                            label="Start Call" 
                            @click="startCall" 
                        />
                        <q-btn 
                            v-if="callStarted && !callDone"
                            :disable="clientInfo.files.length === 0" 
                            color="red" 
                            icon="call_end" 
                            label="End Call" 
                            @click="endCall"
                        />
                        <q-btn 
                            v-if="callDone"
                            :disable="true" 
                            color="blue" 
                            icon="call_end" 
                            label="Call Ended"
                        />
                        <q-space />
                        <q-btn v-if="!callDone" :disable="!callStarted" color="primary" icon="add_a_photo" label="Photo" @click="openSelfieModal" />
                        <q-btn v-if="callDone" color="green" icon="preview" label="View Photo" @click="openSelfieModal" />
                        <q-space />
                        <q-btn flat label="Close" color="negative" @click="closeModal" />
                    </q-toolbar>
                    
                </q-card-actions>
            </q-card>
        </q-dialog>

        <clientBookingModal
            :modalStatus="openBooking"
            :clientId="clientInfo"
            :resetData="backToNew"
            @updateStatus="closeBooking"
            @orderSubmit="updateData"
        />
        <clientSelfieModal 
            :modalStatus="openSelfie"
            :clientId="clientInfo"
            :resetData="backToNew"
            @updateStatus="closeSelfie"
            @clientSelfie="updateData"
        />
    </div>
</template>

<script>
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation'
import clientBookingModal from './client-booking.vue'
import clientSelfieModal from './client-selfie.vue'
import miscJson from '../../context-data/misc.json'
import moment from 'moment';

export default {
    name: "ClientDetails",
    components:{
        clientBookingModal,
        clientSelfieModal,
    },
    data() {
        return {
            curDate: moment().format('MM-DD-YYYY'),
            openBooking: false,
            openSelfie: false,
            openModal: false,
            callStarted: false,
            callDone: false,
            backToNew: false,
            clientInfo: {
                booking: []
            },
            remarks: "",
            activities: [
                {
                    active: false,
                    title: "Client Visit",
                    caption: "Check and Inspect for the client",
                    action: () => { return false }
                },
                {
                    active: false,
                    title: "Booking",
                    caption: "Proceeds with client order transactions",
                    action: (val) => { return this.openBookingDetails(val) }
                },
                {
                    active: false,
                    title: "Onsite Activity",
                    caption: "Vaccines, Inspections, Etc.",
                    action: () => { return false }
                },
            ]
        }
    },
    props: {
        modalStatus: {
            type: Boolean
        },
        clientData: {
            type: Object
        },
        clientIndex: {
            type: Number
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
        }
    },
    watch:{
        modalStatus: async function(newVal){
            
            this.openModal = newVal
            
        },
        clientData(newVal){
            const vm = this;
            this.clientInfo = this.clientData
            if(this.clientData.activity !== undefined){
                this.clientData.activity.forEach((el, index) => {
                    vm.activities[index].active = el.active
                });
            }
            this.callDone = this.clientData.status !== undefined ?
            true : false;
            this.callStarted = this.clientData.attendance.startCall !== '' ?
            true : false;
        }
    },
    methods: {
        
        // Modal Controls
        async closeModal(){
            const vm = this;
            vm.clientInfo.activity = this.activities;
            const { value } = await Preferences.get({ key: this.curDate });
            let data = value !== null ? JSON.parse(value) : []
            data[this.clientIndex] = vm.clientInfo;

            await Preferences.set({
                key: this.curDate,
                value: JSON.stringify(data)
            }).then(() => {
                
                vm.$emit('updateStatus', false)
            })
        },
        
        closeSelfie(){
            this.openSelfie = false;
        },
        openSelfieModal(){
            this.openSelfie = true;
        },

        openBookingDetails(val){
            const vm = this;
            if(!val){
                this.$q.dialog({
                    title: 'Remove Booking',
                    message: 'If you diselect this option all booking list will be reset. would you like to proceed?',
                    cancel: true,
                    persistent: true,
                    ok:{
                        label: 'Yes'
                    }
                }).onOk(() => {
                    // console.log('>>>> OK')
                    vm.clientInfo.booking = []
                }).onCancel(() => {
                    // console.log('>>>> Cancel')
                    vm.activities[1].active = true
                })
                return false;
            }

            this.openBooking = true;
        },
        async closeBooking(val){
            this.activities[1].active = this.clientInfo.booking.length > 0 ? true : false;
            this.openBooking = false;
        },

        // Data
        async updateData(val){
            const vm = this;
            if(val.type === 'selfie'){
                vm.clientInfo.files = val.value
            } else if(val.type === 'booking'){
                vm.clientInfo.booking = val.value
                this.openBooking = false;
            }
        },

        async startCall(){
            const vm = this;
            const idx = this.clientIndex;

            // validate if there was unended call
            try {
                let timeIn = moment(new Date).format("lll")
                const perm = await Geolocation.checkPermissions()

                if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                    const reqPerm = await Geolocation.requestPermissions();
                    if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                        const coordinates = await Geolocation.getCurrentPosition()
                        vm.clientInfo.attendance.geoLocation.timeIn = coordinates.timestamp;
                        vm.clientInfo.attendance.geoLocation.coorIn = {
                            lat: coordinates.coords.latitude,
                            lng: coordinates.coords.longitude,
                        };
                    } else {
                        return false
                    }
                } else {
                    const coordinates = await Geolocation.getCurrentPosition()
                    vm.clientInfo.attendance.geoLocation.timeIn = coordinates.timestamp;
                    vm.clientInfo.attendance.geoLocation.coorIn = {
                        lat: coordinates.coords.latitude,
                        lng: coordinates.coords.longitude,
                    };
                }


                this.$nextTick(async () => {
                    vm.callStarted = true;
                    vm.clientInfo.attendance.startCall = timeIn;
                    vm.clientInfo.activity = this.activities;

                    const { value } = await Preferences.get({ key: this.curDate });
                    let data = value !== null ? JSON.parse(value) : []
                    data[idx] = vm.clientInfo;

                    await Preferences.set({
                        key: this.curDate,
                        value: JSON.stringify(data)
                    }).then(() => {
                        // this.closeModal();
                    })
                })
            } catch (error) {
                alert(error)
            }
        },
        async endCall(){
            const vm = this;
            const idx = this.clientIndex;

            // validate if there was unended call
            try {
                let timeOut = moment(new Date).format("lll")
                const perm = await Geolocation.checkPermissions()

                if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                    const reqPerm = await Geolocation.requestPermissions();
                    if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                        const coordinates = await Geolocation.getCurrentPosition()
                        vm.clientInfo.attendance.geoLocation.timeOut = coordinates.timestamp;
                        vm.clientInfo.attendance.geoLocation.timeOut = {
                            lat: coordinates.coords.latitude,
                            lng: coordinates.coords.longitude,
                        };
                    } else {
                        return false
                    }
                } else {
                    const coordinates = await Geolocation.getCurrentPosition()
                    vm.clientInfo.attendance.geoLocation.timeOut = coordinates.timestamp;
                    vm.clientInfo.attendance.geoLocation.timeOut = {
                        lat: coordinates.coords.latitude,
                        lng: coordinates.coords.longitude,
                    };
                }


                this.$nextTick(async () => {
                    vm.callStarted = true;
                    vm.clientInfo.attendance.endCall = timeOut;
                    vm.clientInfo.remarks = this.remarks;
                    vm.clientInfo.activity = this.activities;
                    vm.clientInfo.status = "DONE";

                    const { value } = await Preferences.get({ key: this.curDate });
                    let data = value !== null ? JSON.parse(value) : []
                    data[idx] = vm.clientInfo;

                    await Preferences.set({
                        key: this.curDate,
                        value: JSON.stringify(data)
                    }).then(() => {
                        this.closeCall();
                        // this.resetFields();
                    })
                })
            } catch (error) {
                alert(error)
            }

        },
        closeCall(){
            this.$emit('updateStatus', false)
        },
        resetFields(){
            // Reset activities 
            this.activities = this.activities.map((el) => {
                el.active = false
                return el
            })
            this.backToNew = !this.backToNew
            this.remarks = ""
        }
    }
}
</script>