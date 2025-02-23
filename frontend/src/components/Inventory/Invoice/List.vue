<template>
    <div>
        <div v-if="!isContinueEdit" class="q-pa-md" style="width: 100%;">
            <div class="row">
                <div class="col col-md-6">
                    <span class="title">Invoice List</span>
                </div>
                <div class="col col-md-6 text-right">
                    <!-- <q-btn 
                        unelevated 
                        color="primary"
                        @click="openProductModal('add', 0)"
                    >
                        <q-icon left name="add" />
                        <div>New Product</div>
                    </q-btn> -->
                </div>
                <div v-if="isLoading" class="col col-md-12 text-center">
                    <q-spinner-orbit
                        color="primary"
                        size="3em"
                    />
                </div>
                <div v-if="tableRow.length === 0" class="col col-md-12 text-center">
                    <noData
                        @reloadData="getList"
                    />
                </div>
                <div v-if="tableRow.length > 0" class="col col-md-12 q-mt-md">
                    <q-table
                        :rows="tableRow"
                        :filter="filter"
                        :columns="tableColumns"
                        row-key="referenceNumber"
                        flat bordered
                        wrap-cells
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
                                <q-th>
                                    Action
                                </q-th>
                            </q-tr>
                        </template>
                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td
                                    v-for="col in props.cols"
                                    :key="col.name"
                                    :props="props"
                                >
                                    {{ col.value }}
                                </q-td>
                                <q-td>
                                    <q-btn @click="printInvoice(props.row)" size="sm" class="full-width" color="primary" icon="print" />
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                    <!-- <q-table
                        :rows="tableRow"
                        :filter="filter"
                        :columns="tableColumns"
                        row-key="productName"
                    >
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>
                       
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn 
                                    dense
                                    flat
                                    outline
                                    size="md"
                                    color="primary" 
                                    label="View Details"
                                    @click="openInvoiceModal(props.row)"
                                />
                            </q-td>
                        </template>
                    </q-table> -->
                </div>
            </div>
        </div>

        <invoiceDetailsModal
            :appId="appId"
            :modalStatus="openAddModal"
            @updateModalStatus="closeInvoiceModal"
            @refreshData="getList"
        />
        <printInvoiceModal
            :modalStatus="printModal"
            :appData="appId"
            @updatePrintStatus="closePrintReceipt"
        />
    </div>
</template>

<script>
import moment from 'moment';
import { LocalStorage, SessionStorage } from 'quasar'
import noData from '../../Templates/NoData.vue';
import invoiceDetailsModal from '../Modals/InvoiceDetails.vue'
import printInvoiceModal from '../Modals/PrintInvoice.vue';
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default {
    name: 'ProductList',
    data(){
        return {
            printModal: false,
            isContinueEdit: false,
            isPwd: true,
            isLoading: false,
            submitting: false,
            tableRow: [],
            filter: '',
            saveDetails: null,
            saveId: null,
            insertedID: null,
            openAddModal: false,
            appId: {},
            pType: 'add'
        }
    },
    components: {
        noData,
        invoiceDetailsModal,
        printInvoiceModal
    },
    created(){
        this.getList();
    },
    methods: {
        moment,
        printInvoice(row){
            // show preview
            this.appId = row
            this.printModal = true
        },
        closePrintReceipt(){
            this.printModal = false
        },
        openInvoiceModal(row){
            this.openAddModal = true;
            this.appId = row.key;
        },
        closeInvoiceModal(){
            this.openAddModal = false
            this.appId = {}
        },
        parseData(data){
            let res = JSON.parse(data);
            // console.log(data)
            // console.log(typeof res)
            return res.label
            
        },
        async getList(){
            this.tableRow = [];
            this.isLoading = true;
            let vm = this;
            
            api.post('transaction/temp/list').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.tableRow = response.status < 300 ? data.list : [];
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

            this.isLoading = false;
        },
        
        // end
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        tableColumns: function(){
            return [
                {
                    name: 'id',
                    required: true,
                    label: 'ID',
                    align: 'left',
                    field: row => row.id,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'referenceNumber',
                    required: true,
                    label: 'Invoice No.',
                    align: 'left',
                    field: row => row.referenceNumber,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'storeName',
                    required: true,
                    label: 'Customer',
                    align: 'left',
                    field: row => row.storeName,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'orderDate',
                    required: true,
                    label: 'Date of Order',
                    align: 'left',
                    field: row => row.orderDate,
                    format: val => `${val}`,
                    sortable: true
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.title{
    font-weight: 600;
    font-size: 18pt;
}
</style>
