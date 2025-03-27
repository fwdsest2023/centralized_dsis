<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col-12 q-pl-xs q-pr-xs">
                <q-btn
                    :disable="!enableTimeIn"
                    color="positive" 
                    text-color="white" 
                    unelevated
                    class="full-width"
                    icon-right="pending_actions"
                    label="START CLOCK IN"
                    @click="startTimeIn"
                >
                    <template v-slot:loading>
                        <q-spinner-rings color="white" />
                    </template>
                </q-btn>
            </div>
            <div class="col-12 q-mt-lg q-pl-xs q-pr-xs">
                <q-separator />
            </div>
            <div class="col-12 q-mt-lg"></div>

            <div 
                v-for="(item, index) in activities"
                :key="index"
                class="col-4 col-sm-4 col-md-4 text-center q-pa-xs"
            >
                <q-card
                    :class="item.active ? '' : 'disabled'"
                    flat
                    @click="item.active ? item.action() : ''"
                    class="my-card-item bg-green-6"
                >
                    <q-card-section>
                        <q-avatar
                            size="xl"
                            text-color="white"
                            :icon="item.icon"
                        />
                    </q-card-section>
                </q-card>
                <span  class="text-subtitle text-bold" >{{item.title}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment'

export default{
    name: 'Dashboard',
    components: {
        FullCalendar,
    },
    data(){
        return {
            enableTimeIn: false,
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
                    title: "Client Trades",
                    icon: "local_shipping",
                    action: () => { return this.$router.push({ name: 'distributionClientTrades' }) }
                },
                {
                    active: false,
                    title: "Client List",
                    icon: "people_alt",
                    action: (val) => { return this.$router.push({ name: 'distributionClientList' }) }
                },
                {
                    active: false,
                    title: "Admin Activity",
                    icon: "meeting_room",
                    action: () => { return false }
                },

                {
                    active: false,
                    title: "Order List",
                    icon: "shopping_cart",
                    action: () => { return this.$router.push({ name: 'distributionOrderList' }) }
                },
                {
                    active: false,
                    title: "Collections",
                    icon: "account_balance_wallet",
                    action: () => { return false }
                },
                {
                    active: false,
                    title: "Expenses",
                    icon: "paid",
                    action: () => { return false }
                },

                {
                    active: false,
                    title: "Approvals",
                    icon: "verified",
                    action: () => { return false }
                },
                {
                    active: false,
                    title: "Performance Report",
                    icon: "insights",
                    action: () => { return false }
                },
                {
                    active: false,
                    title: "Attendance Calendar",
                    icon: "today",
                    action: () => { return false }
                },
            ],
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
    },
    created(){
      this.getTimeDetails()
    },
    methods: {
        moment,
        closeModals(){
            this.openCheckupModal = false
            this.openWellnessModal = false
        },
        getTimeDetails(){
            this.$q.loading.show();
            api.post('distribution/getTimeInDetails', { userId: this.user.userId, timeInDate: moment().format('YYYY-MM-DD')}).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let activcate = this.activities.map((item) => {

                        let tobeEnable = "Client Trades,Client List,Order List"
                        return {
                            ...item,
                            active: tobeEnable.includes(item.title)
                        }
                    })

                    this.activities = activcate
                    this.enableTimeIn = false
                } else {
                    this.enableTimeIn = true
                }
            })

            this.$q.loading.hide();
        },
        startTimeIn(){
            this.$q.loading.show();
            let payload = {
                userId: this.user.userId,
                timeInDate: moment().format('YYYY-MM-DD'),
                timeInTime: moment().format('HH:mm A'),
            }

            api.post('distribution/setTimeIn', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let activcate = this.activities.map((item) => {
                        let tobeEnable = "Client Trades,Client List,Order List"
                        return {
                            ...item,
                            active: tobeEnable.includes(item.title)
                        }
                    })

                    this.activities = activcate
                    this.enableTimeIn = false
                } else {
                    this.enableTimeIn = true
                }
            })
            this.$q.loading.hide();
        }
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
.my-card{
    border-radius: 15px;
    box-shadow: 0px 0px 3px -2px !important;
}
.my-card-item{
    border-radius: 10px;
}
.generatedDash{
  color: white;
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgb(255 251 176) 0%, rgb(0 55 255 / 61%) 89%);
}
.generatedDash2{
  color: white;
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgb(38 148 243) 0%, rgb(45 253 215 / 61%) 89%);
}
</style>