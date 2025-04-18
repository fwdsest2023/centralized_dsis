<template>
    <div class="" style="width: 100%;">
        <div class="row">
            <div class="col-12">
                <div class="fit row wrap justify-start items-center content-center">
                    <q-btn
                        flat
                        color="negative" 
                        unelevated
                        @click="getBackDashboard"
                        icon="backspace"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
                </div>
            </div>
            <div class="col-12 q-mt-lg">
                <div class="fit row wrap justify-start items-center content-center">
                    <span class="text-h6">MY ORDER LIST</span>
                    <q-space />
                    
                </div>
            </div>
            <div class="col-12">
                <div class="fit row wrap justify-start items-center content-center">
                    <q-btn 
                        flat 
                        round 
                        color="primary" 
                        icon="west"
                        @click="backToYesterday"
                    />

                    <q-space />
                    <div class="text-center text-bold">
                        {{dayToday}}, {{dateToday}}
                    </div>
                    <q-space />

                    <q-btn 
                        flat 
                        round 
                        color="primary" 
                        icon="east"
                        @click="goToTommorrow"
                    />
                </div>
            </div>
            <div class="col-12 q-mt-sm">
                <q-input
                    outlined
                    dense
                    v-model="search"
                    label="Search Store Name"
                />
            </div>
            <div class="col-12 q-mt-md">
                <q-separator />
            </div>
            <div class="col-12">
                <q-list >
                    <q-item v-for="contact in filteredStores" :key="contact.id" class="q-my-sm" clickable v-ripple @click="addOrder(contact)" >
                        <q-item-section>
                            <q-item-label class="text-bold">{{ contact.customerInfo.storeName }}</q-item-label>
                            <q-item-label caption lines="1">{{ contact.customerInfo.address }}</q-item-label>
                            <q-item-label caption lines="1">{{ contact.customerInfo.contact }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span class="text-caption">Account Balance</span>
                            <q-item-label class="text-bold text-h6">{{ convertToCurrency(contact.amount) }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="filteredStores.length === 0" class="q-my-sm">
                        <q-item-section>
                            <q-item-label class="text-center">No Client Found</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

        </div>

        <q-dialog v-model="addOrderModal" persistent position="bottom">
            <q-card style="width: 100%; height: 100dvh;">
                <q-card-section>
                    <div class="fit row wrap justify-start items-center content-center q-mb-sm">
                        <span class="text-bold">{{selectedClient.customerInfo.storeName}}</span>
                        <q-space />
                        <q-btn
                            flat
                            size="sm"
                            color="negative" 
                            unelevated
                            @click="addOrderModal = false"
                            icon="close"
                        >
                            <template v-slot:loading>
                                <q-spinner-rings color="white" />
                            </template>
                        </q-btn>
                    </div>
                    <span class="text-caption"><span class="text-bold">Owner: </span>{{ selectedClient.customerInfo.ownerName }}</span><br>
                    <span class="text-caption"><span class="text-bold">Address: </span>{{ selectedClient.customerInfo.address }}</span><br>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <span class="text-bold">Payment Details</span>
                    <q-space />
                    <div class="row">
                        <div class="col-6 q-mt-sm q-pa-sm">
                            <span class="text-bold">Total Amount: </span>
                        </div>
                        <div class="col-6 text-right q-mt-sm q-pa-sm">
                            {{ convertToCurrency(selectedClient.amount) }}
                        </div>
                        
                        <div class="col-6 q-mt-sm q-pa-sm">
                            <span class="text-bold">Collection Amount: </span>
                        </div>
                        <div class="col-6 text-right q-mt-sm q-pa-sm">
                            <q-input
                                outlined
                                v-model="selectedClient.collectedAmount" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>

                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn 
                        @click="submitForm"
                        class="q-mt-sm q-mr-sm full-width" 
                        no-caps 
                        unelevated 
                        rounded 
                        color="primary" 
                        label="Receive Payment" 
                        icon="receipt_long" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import moment from 'moment'
import { Loader } from "@googlemaps/js-api-loader"

const dateNow = moment().format('YYYY-MM-DD');

export default{
    name: 'Dashboard',
    components: {},
    data(){
        return {
            addOrderModal: false,
            search: "",
            selectedClient: {},
            selectedScan:"",
            showProductSearch: false,
            productList: [],
            productListLoading: false,
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
                deliveryDate: '',
                createdBy: '',
            },
            selectedModalData: {},
            contacts: [],
            dateToday: moment().format('MMMM D YYYY'),
            dayToday: moment().format('dddd'),
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        filteredStores(){
            return this.contacts.filter((item) => {
                return item.customerInfo.storeName.toLowerCase().includes(this.search.toLowerCase())
            })
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
    },
    created(){
      this.getLists()
    },
    methods: {
        moment,
        initMapLoad(data){
            loader
            .load()
            .then(async (google) => {
                // Loading the maps
                await this.$nextTick(() => {
                    console.log(data)
                    const mstore = new google.maps.LatLng(Number(data.latitude), Number(data.longitude));
                    const map = new google.maps.Map(document.getElementById("mapIn"), {
                        center: mstore,
                        zoom: 16,
                    });
                    map.setMapTypeId('satellite');
                    // Store Marker
                    const marker = new google.maps.Marker({
                        map,
                        position: {lat: Number(data.latitude), lng:  Number(data.longitude)},
                    });
                })
            })
            .catch((e) => {
                // do something
                console.log(e)
            });
        },
        getBackDashboard(){
            this.$router.push({name: 'distributionDashboard'})
        },
        async goToTommorrow(){
            let tom = moment(this.dateToday).add(1, 'days').startOf('day').format('MMMM D YYYY').toString();
            this.dateToday = tom
            this.dayToday = moment(tom).format('dddd')
            this.getLists()
         },
        async backToYesterday(){
            let yesterday = moment(this.dateToday).subtract(1, 'days').startOf('day').format('MMMM D YYYY').toString();
            this.dateToday = yesterday
            this.dayToday = moment(yesterday).format('dddd')
            this.getLists()
        },
        async getLists(){
            this.$q.loading.show();
            await api.post('transaction/temp/list/collections', { 
                userId: this.user.userId,
                deliveryDate: moment(this.dateToday).format('YYYY-MM-DD') 
            }).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let list = data.list;
                    this.contacts = list.map((item) => {
                        // return {
                        //     id: item.id,
                        //     name: item.storeName,
                        //     details: item.address,
                        //     letter: item.storeName.charAt(0).toUpperCase(),
                        //     values: item
                        // }
                        return item
                    })
                } 

                this.$q.loading.hide();
            })

            
        },
        addOrder(details){
            this.selectedClient = details
            console.log(details)
            this.addOrderModal = true
        },
        submitForm(){
            this.$q.dialog({
                title: 'Receive Payment',
                message: 'Would you like to complete this payment?',
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
                    id: this.selectedClient.id,
                    orderId: this.selectedClient.orderId,
                    isPaid: Number(this.selectedClient.amount) === Number(this.selectedClient.collectedAmount),
                    updateDetails:{
                        collectedAmount: Number(this.selectedClient.collectedAmount),
                        collectedDate: dateNow,
                        collectedBy: this.user.userId,
                        status: 1,
                    },
                    newCollection:{
                        amount: (Number(this.selectedClient.amount) - Number(this.selectedClient.collectedAmount)),
                        userId: this.selectedClient.userId,
                        orderId: this.selectedClient.orderId,
                        clientId: this.selectedClient.clientId,
                        deliveryDate: this.selectedClient.deliveryDate,
                        status: 0
                    }
                }
                // console.log(payload)
                // return
                api.post('transaction/temp/update/collection', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top-right',
                            message: 'Payment Received',
                            icon: 'verified'
                        })

                        this.selectedClient = {}
                        this.addOrderModal = false
                        this.addClient = false
                        this.getLists()
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
            this.selectedScan = ""
            this.showProductSearch = false;
        },
        removeStockItem(val){
            let index = this.form.orderItem.indexOf(val)
            this.form.orderItem.splice(index, 1)
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
        convertToCurrency(price){
            let amount = Number(price)
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
</style>