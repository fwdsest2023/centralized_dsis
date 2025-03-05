<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <!-- Users Count Overview -->
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                <q-card
                    flat
                    class="my-card bg-white"
                >
                    <q-card-section>
                        <span class="text-h6 text-bold">Check Voucher Overview</span><br/>
                        <!-- <span class="text-caption text-grey">Invoice & Check summary</span><br/> -->

                        <div class="row">
                            <div
                                v-for="(item, idx) in dashCards"
                                :key="idx"
                                class="col-3 col-xs-12 col-sm-4 col-md-3 q-pa-xs"
                            >
                                <q-card
                                    flat
                                    class="my-card-item "
                                    :class="item.color"
                                >

                                    <q-card-section>
                                        <q-avatar
                                            size="md"
                                            :color="item.iconBg"
                                            text-color="white"
                                            :icon="item.icon"
                                        />
                                        <br/>
                                        <span class="text-bold text-h6 text-blue-grey-9" >{{item.value}}</span>
                                        <br/>
                                        <span class="text-subtitle text-blue-grey-9" >{{item.title}}</span>
                                        <br/>
                                        <span class="text-caption ellipsis" :class="item.captionColor" >{{item.captions}}</span>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
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
            eventList: [],
            dashCards: [
              {
                  key: 'applicants',
                  title: 'New Check Voucher',
                  value: 0,
                  subVal: '',
                  type: '',
                  info: '',
                  icon: 'contact_emergency',
                  valueType: 'Count',
                  chartType: '',
                  color: 'bg-amber-2',
                  iconBg: 'amber-5',
                  captions: 'All check vouchers recorded and realeased',
                  captionColor: 'text-blue-14',
              },
              {
                  key: 'totalLoans',
                  title: 'For Entry',
                  value: 0,
                  subVal: '',
                  type: '',
                  info: '',
                  icon: 'devices_other',
                  valueType: 'Count',
                  chartType: '',
                  color: 'bg-light-green-2',
                  iconBg: 'light-green-5',
                  captions: 'Checks for Entry to be release',
                  captionColor: 'text-blue-14',
              },
              {
                  key: 'totalRedeem',
                  title: 'Cancelled',
                  value: 0,
                  subVal: '',
                  type: '',
                  info: '',
                  icon: 'fact_check',
                  valueType: 'Count',
                  chartType: '',
                  color: 'bg-blue-grey-2',
                  iconBg: 'blue-grey-5',
                  captions: 'Cancelled checks & vouchers',
                  captionColor: 'text-blue-14',
              },
              {
                  key: 'totalSales',
                  title: 'Late Entry',
                  value: 0.00,
                  subVal: '',
                  type: '',
                  info: '',
                  icon: 'attach_money',
                  valueType: 'Number',
                  chartType: '',
                  color: 'bg-red-2',
                  iconBg: 'red-5',
                  captions: 'Late Entry Checks',
                  captionColor: 'text-blue-14',
              },
            ],
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