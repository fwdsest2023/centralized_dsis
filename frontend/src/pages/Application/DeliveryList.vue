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
                            <q-item-label class="text-bold">{{ contact.storeName }}</q-item-label>
                            <q-item-label caption lines="1">{{ contact.address }}</q-item-label>
                            <q-item-label caption lines="1">{{ contact.contact }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <span class="text-caption">Order Count</span>
                            <q-item-label>{{ contact.orderItem.length }}</q-item-label>
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
                        <span class="text-bold">{{selectedClient.storeName}}</span>
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
                    <span class="text-caption"><span class="text-bold">Owner: </span>{{ selectedClient.ownerName }}</span><br>
                    <span class="text-caption"><span class="text-bold">Address: </span>{{ selectedClient.address }}</span><br>

                    <span class="text-bold">Location Details</span>
                    <div class="row q-mt-sm">
                        <div class="col-12 col-md-6 q-pa-xs">
                            {{initMapLoad(selectedClient.geoTag)}}
                            <div id="mapIn" style="width:100%; height: 200px;"></div>
                        </div>
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <span class="text-bold">Order Details</span><br/>
                    <span class="text-caption text-bold">Mode of Payment: {{selectedClient.modePayment}}</span><br/>
                    <span class="text-caption text-bold">Order Date: {{selectedClient.orderDate}}</span><br/>
                    <span class="text-caption text-bold">Delivery Date: {{selectedClient.deliveryDate}}</span><br/>
                    <div class="row">
                        
                        <div class="col col-12 q-mb-sm">
                            <q-list v-if="selectedClient.orderItem.length > 0" >
                                <q-item v-for="item in selectedClient.orderItem" :key="item.id" class="q-my-sm" clickable v-ripple>
                                    <q-item-section>
                                        <q-item-label>{{ item.product }}</q-item-label>
                                        <q-item-label caption lines="2">Supplier: {{item.supplier}}</q-item-label>
                                    </q-item-section>

                                    <q-item-section side top>
                                        <q-item-label caption>{{convertToCurrency(item.srp)}} x {{item.quantity}}</q-item-label>
                                        Total: {{convertToCurrency(item.srp * item.quantity)}}
                                    </q-item-section>
                                </q-item>
                            </q-list>

                            <q-separator class="q-mt-sm q-mb-sm" />
                            <div class="text-right">
                                <span class="text-caption text-bold">Total Items: {{selectedClient.orderItem.length}}</span><br/>
                                <span class="text-caption text-bold">Total Amount: {{convertToCurrency(selectedClient.orderItem.reduce((a, b) => a + (b.srp * b.quantity), 0))}}</span><br/>
                                <span class="text-caption text-bold">Balance: {{convertToCurrency(selectedClient.orderItem.reduce((a, b) => a + (b.srp * b.quantity), 0) - Number(selectedClient.amount))}}</span><br/>
                            </div>

                        </div>
                        <div class="col col-12 q-mt-sm">
                            <div 
                                v-if="selectedClient.length === 0" 
                                class="text-center q-pa-md"
                            >
                                <q-img
                                width="30%"
                                class="singleImgOpcity"
                                src="/barcode-scanner.png"
                                /><br/>
                                <span class="text-caption text-grey-8">
                                No Items Available.
                                </span>
                            </div>
                        </div>
                    </div>
                    <q-separator class="q-mt-sm q-mb-sm" />
                    <span class="text-bold">Collection Details</span>
                    <div class="row">
                        <div v-if="selectedClient.modePayment === 'COD' || selectedClient.modePayment === 'CASH'" class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                v-model="selectedClient.amount" 
                                label="Collection Amount" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                disable
                                outlined
                                v-model="selectedClient.bank" 
                                label="Bank" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined
                                type="textarea"
                                v-model="selectedClient.remarks" 
                                label="Notes/Remarks" 
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
                        label="Order Delivered" 
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

const loader = new Loader({
    apiKey: 'AIzaSyB3DQ31zrDrMQNnbHQkLqj-vMeYVNi8hnM',
    version: "weekly",
    libraries: ["places"]
});
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
                return item.storeName.toLowerCase().includes(this.search.toLowerCase())
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
            await api.post('distribution/delivery/list', { orderDate: moment(this.dateToday).format('YYYY-MM-DD') }).then((response) => {
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
                let payload = {
                    id: this.selectedClient.id,
                    updateDetails:{
                        ...this.selectedClient,
                        amount: Number(this.selectedClient.amount) === 0 ? this.selectedClient.orderItem.reduce((a, b) => a + (b.srp * b.quantity), 0) : this.selectedClient.amount,
                        deliveredBy: this.user.userId,
                        orderStatus: 3,
                    }
                }
                api.post('transaction/temp/update/order', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top-right',
                            message: 'Order Successfully Delivered',
                            icon: 'verified'
                        })

                        //Check if the paid amount is not equal to the total amount
                        if(this.selectedClient.amount !== this.selectedClient.orderItem.reduce((a, b) => a + (b.srp * b.quantity), 0)){
                            // Execute the collection
                            let total = this.selectedClient.orderItem.reduce((a, b) => a + (b.srp * b.quantity), 0);
                            
                            let collectPayload = {
                                userId: this.user.userId,
                                orderId: this.selectedClient.id,
                                clientId: this.selectedClient.clientId,
                                amount: total - Number(this.selectedClient.amount),
                                deliveryDate: this.selectedClient.deliveryDate,
                            }
                            api.post('transaction/temp/create/collection', collectPayload).then((response) => {
                                const data = {...response.data};
                                console.log(data)
                            })
                        }

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