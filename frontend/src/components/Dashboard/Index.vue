<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col col-md-3 q-pa-sm">
                <q-list >
                    <q-item 
                        class="shadow-2 bg-white custom-item-border q-mb-md q-pa-md" 
                        v-ripple
                    >
                        <q-item-section avatar>
                            <q-avatar rounded class="generatedIconDash" text-color="white" icon="admin_panel_settings" size="xl" />
                        </q-item-section>
                        <q-item-section>
                            <!-- <q-item-label caption style="font-size: 7pt;">Monthly</q-item-label> -->
                            <q-item-label lines="2" class="text-bold">Customers</q-item-label>
                            <!-- <q-item-label class="text-bold text-grey-9 text-h6" lines="2">0</q-item-label> -->
                        </q-item-section>
                        <q-item-section side top >
                            <q-chip
                                color="blue"
                                text-color="white"
                                size="lg"
                            >
                                <q-avatar color="red"  text-color="white" icon="people" >
                                    <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
                                </q-avatar>
                                <div class="ellipsis">
                                0
                                </div>
                            </q-chip>

                            <q-chip
                                color="blue"
                                text-color="white"
                                size="lg"
                            >
                                <q-avatar color="red"  text-color="white" icon="pets" >
                                    <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
                                </q-avatar>
                                <div class="ellipsis">
                                0
                                </div>
                            </q-chip>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
            <div class="col col-md-3 q-pa-sm"> 
                <q-toolbar class="bg-primary text-white shadow-2">
                    <q-toolbar-title>Schedule for Today</q-toolbar-title>
                </q-toolbar>

                <q-list bordered>
                    <q-item 
                        v-for="item in eventList" 
                        :key="item.id" 
                        class="q-my-sm text-left"
                        @click="eventClick(item)" 
                        clickable 
                        v-ripple
                    >
                        <q-item-section avatar>
                            <q-icon :name="item.details.schedType === 'vaccine' ? 'vaccines' : 'fact_check'" />
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>{{ item.title }}</q-item-label>
                            <q-item-label caption lines="3">{{ item.details.remarks }}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{item.details.scheduleTime}}</q-item-label>
                            <q-badge
                                class="q-mt-xs"
                                :color="item.details.status === '0' ? 'primary':'green'" 
                                :label="item.details.status === '0' ? 'Pending':'Done'" 
                            />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
            <!-- Cards -->
            <div class="col col-md-6 q-pa-sm">
                <FullCalendar 
                    :options="calendarOptions"
                />
            </div>
            
            
        </div>


        <!-- Modal -->
        <checkupModal
            :appDetails="selectedModalData"
            :modalStatus="openCheckupModal"
            @updateModalStatus="closeModals"
            @refreshData="getSchedules"
        />
        <wellnessModal
            :appDetails="selectedModalData"
            :modalStatus="openWellnessModal"
            @updateModalStatus="closeModals"
            @refreshData="getSchedules"
        />
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'
import checkupModal from './CheckupModal.vue'
import wellnessModal from './WellnessModal.vue'

export default{
    name: 'Dashboard',
    components: {
        FullCalendar,
        checkupModal,
        wellnessModal
    },
    data(){
        return {
            selectedModalData: {},
            openCheckupModal: false,
            openWellnessModal: false,



            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin ],
                dayMaxEvents: true,
                initialView: 'dayGridMonth',
                // Date Action Handler
                selectable: true,

                events: [],
                eventContent: 'Patient Schedules',
            },
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
            ],
            eventList: []
        }
    },
    mounted(){
        this.getSchedules()
    },
    methods: {
        moment,
        eventClick(val){
            this.selectedModalData = val.details
            if(val.details.schedType === 'vaccine' && val.details.status === "0"){
                this.openWellnessModal = true
            } else if(val.details.schedType === 'checkup' && val.details.status === "0") {
                this.openCheckupModal = true
            }
        },
        closeModals(){
            this.openCheckupModal = false
            this.openWellnessModal = false
        },
        getSchedules(){
            this.calendarOptions.events = [];
            this.$q.loading.show();
            api.post('dashboard/getScheduleList', { currDate: moment().format('YYYY-MM-DD')}).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.calendarOptions.events = response.status < 300 ? data.list : [];
                    this.eventList = data.list
                } else {
                    this.$q.notify({
                        color: 'negative',
                        position: 'top-right',
                        title:data.title,
                        message: this.$t(`errors.${data.error}`),
                        icon: 'report_problem'
                    })
                }
            })

            this.$q.loading.hide();
        },
        getDashboard(){}
    }
}
</script>


<style scoped>
.custom-item-border{
    border-radius: 15px;
}
.generatedIconDash{
  background: rgb(0,177,250);
  background: linear-gradient(148deg, rgb(0 61 250) 0%, rgb(241 48 48) 98%);
}
</style>