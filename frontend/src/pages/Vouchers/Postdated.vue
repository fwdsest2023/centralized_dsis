<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col-12 col-md-12">
                <FullCalendar :options="calendarOptions" />
            </div>
            
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { LocalStorage } from 'quasar'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import addCheckModal from '../../components/Modals/AddCheckVoucher.vue'
import printModal from '../../components/Modals/PrintVoucherModal.vue'

export default {
    name: 'UserCheckVoucherPage',
    components: {
        FullCalendar,
        addCheckModal,
        printModal
    },
    data(){
        return {
            rows: [],
            tableLoading: false,
            openAddCheckModal: false,
            openPrintModal: false,
            previewData: {},
            eventList: [],
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin ],
                dayMaxEvents: true,
                initialView: 'dayGridMonth',
                // Date Action Handler
                selectable: true,
                dateClick: (info) => { 
                    return this.getDateInfo(info)
                },
                eventClick: (info) => { 
                    return this.getEventInfo(info.event.extendedProps.data)
                },
                events: [],
            },
            
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return profile;
        },
        columns(){
            return [
                {
                    name: 'voucherNumber',
                    required: true,
                    label: 'Voucher #',
                    align: 'left',
                    field: row => row.voucherNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'vendor',
                    required: true,
                    label: 'Payee',
                    align: 'left',
                    field: row => row.vendor,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'checkDate',
                    required: true,
                    label: 'Date',
                    align: 'left',
                    field: row => row,
                    format: val => `${moment(val.checkDate).format('LL')}`,
                    sortable: true
                },
                {
                    name: 'amount',
                    required: true,
                    label: 'Amount',
                    align: 'left',
                    field: row => row,
                    format: val => val,
                    sortable: true
                },
            ]
        }
    },
    mounted(){
        this.getCheckVouchers()
    },
    methods: {
        moment,
        getDateInfo(info){
            console.log('Date Clicked >>>', info)
        },
        getEventInfo(info){
            console.log('Date Clicked >>>', info)
        },
        async getCheckVouchers(){
            this.rows = []
            this.$api.get('voucher/list/postdated').then((response) => {
                const data = {...response.data};
                this.calendarOptions.events = data.list.map((el) => {
                    return {
                        title: `${el.bank}(${el.checkNumber}) - ${Number(el.amount).toLocaleString('en-US', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`,
                        start: el.checkDate,
                        data: el
                    }
                })
                this.rows = data.list;
            })
        },
        generateAmount(data){
            let res = 0;
            let totalAmount = []
            if(data.checkDetails !== undefined){
                totalAmount = data.checkDetails.map((el) => { return el.amount })
                totalAmount = totalAmount.reduce((accumulator, currentValue) => {
                return Number(accumulator) + Number(currentValue)
                },0);

                res = totalAmount
            } else {
                res = data.amount
            }
            

            return this.convertCurrency(res)
        },
        openPreviewVoucher(data){
            this.openPrintModal = true;
            this.previewData = data;
        },
        closePrintModal(){
            this.openPrintModal = false;
            this.previewData = {};
        },
        closeClientModal(){
            this.openAddCheckModal = false;
        },
        convertCurrency(value){
            let amount = Number(value);
            return amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
            })
        },
    }
}
</script>
<style scoped>
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
