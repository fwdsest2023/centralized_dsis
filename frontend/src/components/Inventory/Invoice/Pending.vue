<template>
    <div>
        <div v-if="!isContinueEdit" class="q-pa-md" style="width: 100%;">
            <div class="row">
                <div class="col col-md-6">
                    <span class="title">Invoice List</span>
                </div>
                <div class="col col-md-6 text-right">
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
                                    <q-btn 
                                        @click="editInvoice(props.row)" 
                                        size="sm" 
                                        class="full-width" 
                                        color="primary" 
                                        label="Edit Order"
                                        icon="edit" />
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>
        <div v-if="isContinueEdit" class="q-pa-md" style="width: 100%;">
            <div class="row">
                <div class="col-12 col-md-12 q-pa-xs q-mb-md">
                    <q-btn 
                        @click="backToList"
                        class="q-mt-sm q-mr-sm" 
                        no-caps 
                        unelevated 
                        rounded 
                        color="red" 
                        label="Back to List" 
                        icon="arrow_back" 
                    />
                </div>
                <div class="col-12 col-md-5 q-pa-xs">
                    <q-card
                        flat
                        class="my-card bg-white"
                    >
                        <q-card-section>
                        <div class=" q-mb-sm">
                            <span class="text-h6 q-mr-lg">Customer Details</span>
                        </div>
                        
                        <q-separator />
                        <div class="row">
                            
                            
                            <div class="col-12 col-md-12 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="appData.storeName" 
                                    label="Store Name" 
                                    stack-label 
                                    dense
                                    :disable="true"
                                    ref="customerInput"
                                > 
                                </q-input>
                                
                            </div>
                            <div  class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="appData.ownerName" 
                                    label="Owener Name"
                                    :disable="true" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div  class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="appData.contact" 
                                    :disable="true"
                                    label="Contact Number" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-12 q-pa-sm">
                                <q-input
                                    outlined
                                    type="textarea"
                                    v-model="appData.address"
                                    :disable="true" 
                                    label="Address" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                        </div>
                        <div class="fit row wrap justify-start items-center content-center q-mt-lg q-mb-sm">
                            <span class="text-h6 q-mr-lg">Order Details # {{ this.appData.referenceNumber }}</span>
                        </div>
                        <q-separator />
                        <div class="row">
                            <div class="col-12 col-md-12 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.agentName" 
                                    label="Agent Name" 
                                    stack-label 
                                    :disable="true"
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.terms" 
                                    label="Terms" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.modePayment" 
                                    label="Mode of Payment" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined 
                                    type="date"
                                    :disable="true"
                                    v-model="appData.orderDate" 
                                    label="Order Date"
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined 
                                    type="date"
                                    v-model="appData.deliveryDate" 
                                    label="Delivery Date" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.bank" 
                                    label="Bank" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-6 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.checkNo" 
                                    label="Check Number" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                            <div class="col-12 col-md-12 q-pa-sm">
                                <q-input
                                    outlined
                                    v-model="appData.notes" 
                                    label="Note" 
                                    stack-label 
                                    dense
                                >
                                </q-input>
                            </div>
                        </div>
                        
                    </q-card-section>
        
                    
                </q-card>
                <!-- Button Transact -->
                    <q-btn 
                        @click="submitForm"
                        class="q-mt-sm q-mr-sm" 
                        no-caps 
                        unelevated 
                        rounded 
                        color="primary" 
                        label="Move to Delivery" 
                        icon="receipt_long" 
                    />
                    <q-btn 
                        @click="printInvoice(appData)"
                        class="q-mt-sm" 
                        no-caps 
                        unelevated 
                        rounded 
                        color="positive" 
                        label="Preview Receipt" 
                        icon="receipt_long" 
                    />
                </div>
                <div class="col-12 col-md-7 q-pa-xs">
                <div class="row">
                    <div class="col col-12 q-mb-sm">
                        <q-input v-model="selectedScan" dense round outlined placeholder="Search to add Product" @keypress.enter="getProducts(selectedScan)" >
                        
                            <template v-slot:append>
                                <q-icon
                                    v-if="selectedScan.length > 2 && !showProductSearch"
                                    name="search" 
                                    @click="getProducts(selectedScan)" 
                                    class="cursor-pointer" 
                                />
                                <q-icon
                                    v-if="selectedScan.length > 2 && showProductSearch"
                                    name="search_off" 
                                    @click="showProductSearch = false" 
                                    class="cursor-pointer" 
                                />
                            </template>
                            <q-popup-proxy
                                v-model="showProductSearch"
                                ref="customerPopup"
                                no-parent-event
                            >
                                <q-list bordered style="width: 30dvw;">
                                    <q-item 
                                        v-for="(val, index) in productList" 
                                        :key="index" 
                                        clickable
                                        @click="pushToTableList(val)" 
                                        v-ripple
                                    >
                                        <q-item-section>{{ val.productName }}</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-popup-proxy>
                        </q-input>
                        <q-table
                            class="q-mt-sm"
                            v-if="appData?.orderItem.length > 0"
                            flat bordered
                            :rows="appData.orderItem"
                            wrap-cells
                            :columns="capacityColumns"
                            row-key="capacity"
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
                                        Price
                                    </q-th>
                                    <q-th>
                                        Discount
                                    </q-th>
                                    <q-th>
                                        Quantity
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
                                        <q-input
                                            outlined 
                                            v-model="props.row.srp"
                                            stack-label 
                                            dense
                                        >
                                        </q-input>
                                    </q-td>
                                    <q-td>
                                        <q-input
                                            outlined 
                                            v-model="props.row.discount"
                                            stack-label 
                                            dense
                                        >
                                        </q-input>
                                    </q-td>
                                    <q-td>
                                        <q-input
                                            outlined 
                                            v-model="props.row.quantity" 
                                            stack-label 
                                            dense
                                        >
                                        </q-input>
                                    </q-td>
                                    <q-td>
                                        <q-btn @click="removeStockItem(props.row)" size="sm" class="full-width" color="red" icon="delete" />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </div>
                    
                    <div class="col col-12 q-mt-sm">
                        <div 
                            v-if="appData.orderItem.length === 0" 
                            class="text-center q-pa-md"
                        >
                            <q-img
                            width="30%"
                            class="singleImgOpcity"
                            src="/barcode-scanner.png"
                            /><br/>
                            <span class="text-caption text-grey-8">
                            No Items Scanned Yet.
                            </span>
                        </div>
                    </div>
                </div>
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
            pType: 'add',
            appData: {},


            productListLoading: false,
            showProductSearch: false,
            productList: [],
            selectedScan: "",
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
        removeStockItem(val){
            let index = this.appData.orderItem.indexOf(val)
            this.appData.orderItem.splice(index, 1)
        },
        pushToTableList(item){
            if(this.appData.orderItem.length === 7){
                return false;
            }

            let obj = {
                id: item.id,
                supplier: item.supplier,
                product: item.productName,
                minSell: item.minSellPrice,
                maxSell: item.maxSellPrice,
                srp: item.productSRP,
                quantity: 1,
                discount: ''
            }
            this.appData.orderItem.push(obj)
            this.showProductSearch = false;
        },
        getProducts(val){
            this.showProductSearch = true;
            this.productListLoading = true
            this.productList = []
            api.post('product/get/products/search', {searchParam: val}).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.productList = data.list
                    this.productListLoading = false
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
        },
        editInvoice(row){
            this.appData = row
            this.isContinueEdit = true
            this.getReference()
        },
        backToList(){
            this.isContinueEdit = false
            this.getList()
        },
        getReference(){
            api.post('transaction/temp/reference').then((response) => {
                const data = {...response.data}; 
                this.appData.referenceNumber = data.reference
            });
        },
        submitForm(){
            this.$q.dialog({
                title: 'Finalize Order',
                message: 'Would you like to finalize this order',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                let payload = {
                    id: this.appData.id,
                    updateDetails:{
                        orderStatus: 2,
                        referenceNumber: this.appData.referenceNumber,
                        orderItem: this.appData.orderItem,
                        terms: this.appData.terms,
                        modePayment: this.appData.modePayment,
                        deliveryDate: this.appData.deliveryDate,
                        bank: this.appData.bank,
                        checkNo: this.appData.checkNo,
                        notes: this.appData.notes
                    }
                }
                api.post('transaction/temp/update/order', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top-right',
                            message: 'Order Successfully Updated',
                            icon: 'verified'
                        })
                        
                        this.getList();
                        this.isContinueEdit = false
                        this.appData = {}
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
            })
        },


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
            
            api.post('transaction/temp/list/pending').then((response) => {
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
        capacityColumns(){
            return [
                {
                    name: 'product',
                    required: true,
                    label: 'Product Name',
                    align: 'left',
                    field: row => row.product,
                    format: val => `${val}`,
                    sortable: true
                },
            ]
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
                    label: 'Store & Customer Name',
                    align: 'left',
                    field: row => row,
                    format: val => `${val.storeName} - ${val.ownerName}`,
                    sortable: true
                },
                {
                    name: 'orderItem',
                    required: true,
                    label: 'Order Count',
                    align: 'left',
                    field: row => row.orderItem,
                    format: val => `${val.length}`,
                    sortable: true
                },
                {
                    name: 'agentName',
                    required: true,
                    label: 'Agent',
                    align: 'left',
                    field: row => row.agentName,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'terms',
                    required: true,
                    label: 'Term',
                    align: 'left',
                    field: row => row.terms,
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
