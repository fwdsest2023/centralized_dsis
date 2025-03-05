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
            <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                
                <q-card
                    flat
                    class="my-card bg-white"
                >
                    <q-card-section>
                        <div class="text-right q-mb-md">
                            <q-btn 
                                @click="openAddCheckModal = !openAddCheckModal" 
                                color="secondary" 
                                no-caps 
                                label="Add New Voucher" 
                            />
                        </div>
                        <div v-if="tableLoading && rows.length === 0" class="text-center">
                            <q-spinner-bars
                                color="primary"
                                size="3em"
                            />
                        </div>

                        <div 
                            v-if="!tableLoading && rows.length === 0" 
                            class="text-center q-pa-md"
                        >
                            <q-icon color="grey-4" name="ti-dropbox-alt" size="6em" /> <br/>
                            <span class="text-caption text-grey-8">
                                No Data Can Be Shown.
                            </span>
                        </div>
                        <q-table
                            v-if="rows.length > 0"
                            flat bordered
                            :rows="rows"
                            wrap-cells
                            :columns="columns"
                            row-key="voucherNumber"
                            separator="cell"
                        >  
                            <template v-slot:header="props">
                                <q-tr :props="props">
                                    <q-th
                                        v-for="col in props.cols"
                                        :key="col.name"
                                        :props="props"
                                    >
                                        {{ col.label }}
                                    </q-th>
                                    <q-th>Action</q-th>
                                </q-tr>
                            </template>
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td
                                        v-for="col in props.cols"
                                        :key="col.name"
                                        :props="props"
                                    >
                                        <div v-if="col.name === 'docNo'">
                                            <q-chip 
                                                v-if="col.value.checkDetails === undefined"
                                                outline 
                                                color="green"
                                                size="sm"
                                                text-color="white"
                                                icon="tag"
                                            >{{ col.value.docNo }}</q-chip>
                                            <div v-else>
                                                <q-chip 
                                                    v-for="(itm) in col.value.checkDetails" 
                                                    :key="itm" 
                                                    outline 
                                                    color="green"
                                                    size="sm"
                                                    text-color="white"
                                                    icon="tag"
                                                >
                                                    {{ itm.docNo }}
                                                </q-chip>
                                            </div>
                                        </div>
                                        <div v-else-if="col.name === 'amount'">
                                            {{ generateAmount(col.value) }}
                                        </div>
                                        <span v-else>
                                            {{ col.value }}
                                        </span>
                                    </q-td>
                                    <q-td>
                                        <q-btn 
                                            size="sm" 
                                            color="primary"
                                            dense
                                            icon="print"
                                            no-caps
                                            label="Preview"
                                            @click="openPreviewVoucher(props.row)"
                                        />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <addCheckModal 
            :modalStatus="openAddCheckModal"
            @updateModalStatus="closeClientModal"
            @refreshData="getCheckVouchers"
        />
        <printModal
            :modalStatus="openPrintModal"
            :appData="previewData"
            @updatePrintStatus="closePrintModal"
            @refreshData="getCheckVouchers"
        />
    </div>
</template>

<script>
import moment from 'moment'
import { LocalStorage } from 'quasar'
import addCheckModal from '../../components/Modals/AddCheckVoucher.vue'
import printModal from '../../components/Modals/PrintVoucherModal.vue'

export default {
    name: 'UserCheckVoucherPage',
    components: {
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
            dashCards: [
                {
                    key: 'applicants',
                    title: 'Check Vouchers',
                    value: 0,
                    subVal: '',
                    type: '',
                    info: '',
                    icon: 'contact_emergency',
                    valueType: 'Count',
                    chartType: '',
                    color: 'bg-amber-2',
                    iconBg: 'amber-5',
                    captions: 'All check vouchers record count',
                    captionColor: 'text-blue-14',
                },
                {
                    key: 'totalSales',
                    title: 'Outgoing Checks',
                    value: 0.00,
                    subVal: '',
                    type: '',
                    info: '',
                    icon: 'attach_money',
                    valueType: 'Number',
                    chartType: '',
                    color: 'bg-red-2',
                    iconBg: 'red-5',
                    captions: 'Total amount of checks issued',
                    captionColor: 'text-blue-14',
                },
                {
                    key: 'totalLoans',
                    title: 'Available Balance',
                    value: 0,
                    subVal: '',
                    type: '',
                    info: '',
                    icon: 'devices_other',
                    valueType: 'Count',
                    chartType: '',
                    color: 'bg-light-green-2',
                    iconBg: 'light-green-5',
                    captions: 'Amount available cash in bank',
                    captionColor: 'text-blue-14',
                },
                {
                    key: 'totalRedeem',
                    title: 'Post Dated Checks',
                    value: 0,
                    subVal: '',
                    type: '',
                    info: '',
                    icon: 'fact_check',
                    valueType: 'Count',
                    chartType: '',
                    color: 'bg-blue-grey-2',
                    iconBg: 'blue-grey-5',
                    captions: 'Amount accumulated for post dated checks',
                    captionColor: 'text-blue-14',
                }
            ],
            eventList: [],

            
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
        async getCheckVouchers(){
            this.rows = []
            this.$api.get('voucher/list').then((response) => {
                const data = {...response.data};
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
