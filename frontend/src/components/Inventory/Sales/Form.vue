<template>
    <q-page class="q-mb-md">
        <div class="row">
            <div class="col-12 col-md-12 q-pa-xs q-mb-md">
                
            </div>
            <div class="col-12 col-md-5 q-pa-xs">
                <q-card
                    flat
                    class="my-card bg-white"
                >
                    <q-card-section>
                    <div class=" q-mb-sm">
                        Customer Details
                    </div>
                    
                    <q-separator />
                    <div class="row">
                        
                        
                        <div class="col-12 col-md-12 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.storeName" 
                                label="Store Name" 
                                stack-label 
                                dense
                                ref="customerInput"
                                @keypress.enter="getStoreNames(form.storeName)"
                            >  
                                <template v-slot:append>
                                    <q-icon
                                        v-if="form.storeName > 2 && !showMatchCustomer"
                                        name="search" 
                                        @click="getStoreNames(form.storeName)" 
                                        class="cursor-pointer" 
                                    />
                                    <q-icon
                                        v-if="form.storeName > 2 && showMatchCustomer"
                                        name="search_off" 
                                        @click="showMatchCustomer = false" 
                                        class="cursor-pointer" 
                                    />
                                </template>
                                <q-popup-proxy
                                    v-model="showMatchCustomer"
                                    ref="customerPopup"
                                    no-parent-event
                                >
                                    <q-list bordered>
                                        <q-item 
                                            v-for="(val, index) in customerList" 
                                            :key="index" 
                                            clickable
                                            @click="appendCustomerData(val)" 
                                            v-ripple
                                        >
                                            <q-item-section avatar>
                                                <q-icon color="primary" name="face" />
                                            </q-item-section>

                                            <q-item-section>{{ `${val.storeName} (${val.ownerName})` }}</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-popup-proxy>
                            </q-input>
                            
                        </div>
                        <div  class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.ownerName" 
                                label="Owener Name" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div  class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.contact" 
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
                                v-model="form.address" 
                                label="Address" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                    </div>
                    <div class="fit row wrap justify-start items-center content-center q-mt-lg q-mb-sm">
                        <span class="text-h6 q-mr-lg">Order Details</span>
                    </div>
                    <q-separator />
                    <div class="row">
                        <div class="col-12 col-md-12 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.agentName" 
                                label="Agent Name" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.terms" 
                                label="Terms" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.modePayment" 
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
                                v-model="form.orderDate" 
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
                                v-model="form.deliveryDate" 
                                label="Delivery Date" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.bank" 
                                label="Bank" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.checkNo" 
                                label="Check Number" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-12 q-pa-sm">
                            <q-input
                                outlined
                                v-model="form.notes" 
                                label="Note" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <!-- <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined 
                                type="date"
                                v-model="form.postDated" 
                                label="Post Dated Check"
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div> -->
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
                    label="Save Order Details" 
                    icon="receipt_long" 
                />
                <q-btn 
                    @click="previewReceipt"
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
                                    <!-- <q-item-section avatar>
                                        <q-icon color="primary" name="face" />
                                    </q-item-section> -->

                                    <q-item-section>({{ val.supplier }}) {{ val.productName }}</q-item-section>
                                </q-item>
                            </q-list>
                        </q-popup-proxy>
                    </q-input>
                    <q-table
                        class="q-mt-sm"
                        v-if="this.form.orderItem.length > 0"
                        flat bordered
                        :rows="this.form.orderItem"
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
                        v-if="this.form.orderItem.length === 0" 
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


        <printInvoiceModal
            :modalStatus="printModal"
            :appData="form"
            @updatePrintStatus="closePrintReceipt"
        />
    </q-page>
</template>
  
<script>
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import moment from 'moment';
import printInvoiceModal from '../Modals/PrintInvoice.vue';

  const dateNow = moment().format('YYYY-MM-DD');

  export default {
    name:"POSPage",
    components: {
        printInvoiceModal
    },
    data(){
      return {
        productListLoading: false,
        showProductSearch: false,
        productList: [],

        printModal: false,

        showMatchCustomer: false,
        showScanModal: false,
        showCheckModal: false,
        selectedScan: "",
        quantity: 1,

        
        sellerList: [],
        customerList: [],
        tab: 'grocery',
        items: [],
        subTotal: "--",
        vat: "--",
        total: "--",


        typeCustomerOption: [
            "Regular",
            "Business",
        ],
        paymenMethodOpt: [
            'CC',
            'Bank Transfer',
            'Cash'
        ],


        form: {
            referenceNumber: '',
            storeName: '',
            address: '',
            ownerName: '',
            contact: '',
            terms: '',
            modePayment: '',
            bank: '',
            postDated: '',
            orderItem: [],
            amount: '',
            notes: '',
            checkNo: '',
            agentName: '',
            orderDate: dateNow,
            deliveryDate: dateNow,
            createdBy: '',
        },
      }
    },
    computed:{
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        sellerOpt(){
            let res = []

            res = this.sellerList.map((el) => {
                return {
                    label: `${el.firstName} ${el.lastName}`,
                    value: el.id
                }
            })

            return res
        },
        customerOpt(){
            let res = []

            res = this.customerList.map((el) => {
                return {
                    label: el.customerName,
                    value: el.id
                }
            })

            return res
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
                // {
                //     name: 'supplier',
                //     required: true,
                //     label: 'Company',
                //     align: 'left',
                //     field: row => row.supplier,
                //     format: val => `${val}`,
                //     sortable: true
                // },
                // {
                //     name: 'srp',
                //     required: true,
                //     label: 'Price',
                //     align: 'left',
                //     field: row => row.srp,
                //     format: val => `${val}`,
                //     sortable: true
                // },
                
            ]
        },
        computeSubTotal(){
            let res = this.items.map((el) => {
            let value = Number(el.product.basePrice) * Number(el.qty)
            return value.toFixed(2);
            })
            return res.length > 0 ? res.reduce((a, b) => {
            let val = Number(a) + Number(b)
            return val.toFixed(2)
            }) : "--"
        },
        computeVat(){
            let res = this.items.map((el) => {
            let value = Number(el.product.vatPrice) - Number(el.product.basePrice) 
            return value.toFixed(2);
            })
            return res.length > 0 ? res.reduce((a, b) => {
            let val = Number(a) + Number(b)
            return val.toFixed(2)
            }) : "--"
        },
        computeTotal(){
            let res = this.items.map((el) => {
            let value = Number(el.product.vatPrice) * Number(el.qty) 
            return value.toFixed(2);
            })
            return res.length > 0 ? res.reduce((a, b) => {
            let val = Number(a) + Number(b)
            return val.toFixed(2)
            }) : "--"
        },
    },
    created(){
        // this.fetchSalesPersonList()
        this.getReference()
    },
    methods:{
        appendCustomerData(data){
            this.form.storeName = data.storeName
            this.form.ownerName = data.ownerName
            this.form.contact = data.contact
            this.form.address = data.address
            this.showMatchCustomer = false;
        },
        getReference(){
            api.post('transaction/temp/reference').then((response) => {
                const data = {...response.data}; 
                this.form.referenceNumber = data.reference
            });
        },
        getStoreNames(val){
            this.showMatchCustomer = true;
            this.customerList = []
            api.post('client/search/store', {searchParam: val}).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.customerList = data.list
                }
            })
        },
        submitForm(){
            this.$q.dialog({
                title: 'Create Order',
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

                this.form.createdBy = this.user.userId
                api.post('transaction/temp/create/order', this.form).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top-right',
                            message: 'Order Successfully Created',
                            icon: 'verified'
                        })
                        this.resetForm()
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
        previewReceipt(){
            // show preview
            this.printModal = true
        },
        closePrintReceipt(){
            this.printModal = false
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
        pushToTableList(item){
            if(this.form.orderItem.length === 7){
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
            this.form.orderItem.push(obj)
            this.showProductSearch = false;
        },
        removeStockItem(val){
            let index = this.form.orderItem.indexOf(val)
            this.form.orderItem.splice(index, 1)
        },
        resetForm(){
            this.form = {
                referenceNumber: '',
                storeName: '',
                address: '',
                ownerName: '',
                contact: '',
                terms: '',
                modePayment: '',
                bank: '',
                postDated: '',
                orderItem: [],
                amount: '',
                notes: '',
                checkNo: '',
                agentName: '',
                orderDate: dateNow,
                deliveryDate: dateNow,
                createdBy: '',
            }
        },
        computePrice(qty, price){
            let amount = (Number(price) * Number(qty))
            let res = Number(amount).toLocaleString('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
    
            return res
        }
    }
  }
  </script>
  
  <style scoped>
  .my-card{
      border-radius: 10px;
      box-shadow: 0px 0px 3px -2px !important;
  }
  .singleImgOpcity{
    opacity: 0.4;
  }
  </style>