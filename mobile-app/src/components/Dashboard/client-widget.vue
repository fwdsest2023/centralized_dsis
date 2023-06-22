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
                    <q-item>
                    <q-item-section>
                        <q-item-label>{{item.client.storeName}}</q-item-label>
                        <q-item-label caption lines="2">{{item.client.address}}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        <q-item-label caption>{{item.client.branch}}</q-item-label>
                        <q-btn
                            v-if="item.client.status !== 'finish'"
                            @click="item.client.status === 'in-progress' ? stopCall(index) : playCall(index)"
                            flat 
                            round
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
            @addClientRemarks="updateData"
         />
        <clientAddModal
            :modalStatus="openAdd"
            @updateStatus="closeAddClient"
            @addClientData="addData"
         />
    </div>
</template>
<script>
import moment from 'moment'
import json from '../../context-data/clients.json'
import {LocalStorage} from 'quasar'
import { Geolocation } from '@capacitor/geolocation'
import { Camera, CameraResultType } from '@capacitor/camera'
import clientBookingModal from './client-booking.vue'
import clientRemarksModal from './client-remarks.vue'
import clientAddModal from './client-add.vue'

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
            openAdd: false,
            inProgress: null
        }
    },
    components:{
        clientBookingModal,
        clientRemarksModal,
        clientAddModal
    },
    computed: {
        clientList(){
            let list = LocalStorage.getItem('clientList');
            this.loadClientList = list.length !== 0 ? list : [];
        },
        filterList(){
            if(this.loadClientList.length !== 0){
                return this.loadClientList.filter(search => {
                    return search.client.storeName.toLowerCase().includes(this.searchClient.toLowerCase())
                })
            }

            return []
        },
    },
    created(){
        this.clientList
    },
    methods: {
        forceRerender() {
            // Removing my-component from the DOM
            this.renderComponent = false;

            this.$nextTick(() => {
            // Adding the component back in
                this.renderComponent = true;
            });
        },
        addClient(){
            this.openAdd = true
        },
        addData(data){
            this.$nextTick(() => {
                // Adding the component back in
                this.loadClientList.push(data)
                LocalStorage.set("clientList", this.loadClientList)
            });
            
        },
        closeRemarks(){
            this.openRemarks = false
        },
        closeAddClient(){
            this.openAdd = false
        },
        nextStep(val){
            this.openBooking = false
            this.openRemarks = true
        },
        playCall(index){
            let timeIn = moment(new Date).format("lll")
            // check if there is still playing
            let filterCall = this.loadClientList.filter(el => el.client.status === "in-progress")

            if(filterCall.length === 0){
                // Executes the play call
                this.loadClientList[index].client.loading = true;
                this.loadClientList[index].client.status = "in-progress";
                this.inProgress = index

                setTimeout(() => {
                    this.loadClientList[index].client.loading = false;
                    this.loadClientList[index].client.icon = 'fiber_manual_record';
                    this.loadClientList[index].client.color = 'red';
                    // Saving the Time In
                    Geolocation.getCurrentPosition().then(newPosition => {
                        this.loadClientList[index].attendance.startCall = timeIn;
                        this.loadClientList[index].attendance.geoLocation.timeIn = newPosition.timestamp;
                        this.loadClientList[index].attendance.geoLocation.coorIn = newPosition.coords;
                    })
                    this.openBooking = true;
                    LocalStorage.set("clientList", this.loadClientList)
                }, 500)
            } else {
                this.$q.dialog({
                    title: 'Error Playing Call',
                    message: 'There is still in-progress call please complete it first before starting new call.',
                    position: 'bottom',
                    color: 'red'
                })
            }
            
        },
        stopCall(index){
            let timeOut = moment(new Date).format("lll")
            this.loadClientList[index].client.loading = true;
            this.loadClientList[index].client.status = "finish";

            setTimeout(() => {
                this.loadClientList[index].client.loading = false;
                this.loadClientList[index].client.icon = 'check_circle';
                this.loadClientList[index].client.color = 'blue';
                Geolocation.getCurrentPosition().then(newPosition => {
                    this.loadClientList[index].attendance.endCall = timeOut;
                    this.loadClientList[index].attendance.geoLocation.timeOut = newPosition.timestamp;
                    this.loadClientList[index].attendance.geoLocation.coorOut = newPosition.coords;
                })

                LocalStorage.set("clientList", this.loadClientList)
            }, 500)
        },
        closeBooking(val){
            this.loadClientList[this.inProgress].client.icon = 'play_circle';
            this.loadClientList[this.inProgress].client.color = 'green';
            // Clear the Time IN and OUT
            this.loadClientList[this.inProgress].client.status = "pending";
            this.loadClientList[this.inProgress].attendance.startCall = '';
            this.loadClientList[this.inProgress].attendance.geoLocation.timeIn = '';
            this.loadClientList[this.inProgress].attendance.geoLocation.coorIn = {};

            this.clientList
            LocalStorage.set("clientList", this.loadClientList)
            this.openBooking = false
        },
        updateData(val){
            
            LocalStorage.set("clientList", val)

            this.clientList
        },
        async playCamera(index){
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri
            })
            console.log(image.webPath)
            imageSrc.value = image.webPath
        }
    }
}
</script>
