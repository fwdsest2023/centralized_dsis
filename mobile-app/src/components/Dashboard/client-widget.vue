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
        <q-list>
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
                    @click="playCamera(index)"
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
        </q-list>
        
        <clientBookingModal 
            :modalStatus="openBooking"
            :clientId="inProgress"
            @updateStatus="closeBooking"
            @orderSubmit="submitOrders"
         />
        <clientAddModal 
            :modalStatus="openAdd"
            @updateStatus="closeAddClient"
         />
    </div>
</template>
<script>
import moment from 'moment'
import json from '../../context-data/clients.json'
import { Geolocation } from '@capacitor/geolocation'
import { Camera, CameraResultType } from '@capacitor/camera'
import clientBookingModal from './client-booking.vue'
import clientAddModal from './client-add.vue'

export default {
    name: "ClientWidget",
    data() {
        return {
            loadClientList: [],
            searchClient: '',
            imageSrc: '',
            openBooking: false,
            openAdd: false,
            inProgress: null
        }
    },
    components:{
        clientBookingModal,
        clientAddModal
    },
    computed: {
        clientList: function(){
            this.loadClientList = json.list
        },
        filterList(){
            return  this.loadClientList.filter(search => {
                return search.client.storeName.toLowerCase().includes(this.searchClient.toLowerCase())
            })
        },
    },
    created(){
        this.clientList
    },
    methods: {
        addClient(){
            this.openAdd = true
        },
        closeAddClient(){
            this.openAdd = false
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
                        json.list[index].attendance.startCall = timeIn;
                        json.list[index].attendance.geoLocation.timeIn = newPosition.timestamp;
                        json.list[index].attendance.geoLocation.coorIn = newPosition.coords;
                    })

                    console.log(this.loadClientList[index])
                    this.openBooking = true;
                }, 2000)
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
                    json.list[index].attendance.endCall = timeOut;
                    json.list[index].attendance.geoLocation.timeOut = newPosition.timestamp;
                    json.list[index].attendance.geoLocation.coorOut = newPosition.coords;
                })
            }, 2000)
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
            this.openBooking = false
        },
        submitOrders(val){
            this.clientList
            this.openBooking = false
        },
        async playCamera(index){
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Uri
            })
            console.log(image.webPath)
            imageSrc.value = image.webPath
        }
    }
}
</script>
