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
                Booking / Schedule Details
            </div>
            <!-- Cards -->
            <div class="col col-md-6 q-pa-sm">
                <FullCalendar 
                    :options="calendarOptions"
                >
                    <!-- <template v-slot:eventContent='arg'>
                        <b>{{ arg.event.title }}</b>
                    </template> -->
                </FullCalendar>
            </div>
            
            
        </div>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default{
    name: 'CardWidgets',
    components: {
        FullCalendar
    },
    data(){
        return {
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin ],
                dayMaxEvents: true,
                initialView: 'dayGridMonth',
                // Date Action Handler
                dateClick: (args) => { return this.handleDateClick(args.event) },
                selectable: true,

                events: [],
                eventContent: 'Show Details',
                // eventClick: this.eventClick,


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
        eventClick(val){
            console.log(val)
        },
        handleDateClick(val){
            console.log(val)
            console.log(val.dayEl)
        },
        getSchedules(){
            this.calendarOptions.events = [];
            this.$q.loading.show();
            api.get('dashboard/getScheduleList').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.calendarOptions.events = response.status < 300 ? data.list : [];
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