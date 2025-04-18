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
                    <span class="text-h6">CREATE CUSTOMER ORDER</span>
                    <q-space />
                    
                </div>
            </div>
            <div class="col-12 q-mt-lg">
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
                    <q-item v-for="contact in filteredStores" :key="contact.id" class="q-my-sm" clickable v-ripple @click="addOrder(contact.values)">
                        <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                            {{ contact.letter }}
                        </q-avatar>
                        </q-item-section>

                        <q-item-section>
                        <q-item-label>{{ contact.name }}</q-item-label>
                        <q-item-label caption lines="1">{{ contact.details }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item v-if="filteredStores.length === 0" class="q-my-sm">
                        <q-item-section>
                            <q-item-label class="text-center">No Client Found</q-item-label>
                            <q-item-label class="text-center">
                                Try to add new client <q-btn flat size="xs" to="client-list">here</q-btn>
                            </q-item-label>
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
                    <span class="text-caption"><span class="text-bold">Address: </span>{{ selectedClient.address }}</span>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row">
                        <div class="col-6 col-md-6 q-pa-xs">
                            <q-input
                                outlined
                                v-model="form.terms" 
                                label="Terms" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-6 col-md-6 q-pa-xs">
                            <q-input
                                outlined
                                v-model="form.modePayment" 
                                label="Mode of Payment" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                        <div class="col-12 col-md-12 q-pa-xs">
                            <q-input
                                outlined
                                v-model="form.notes" 
                                label="Note" 
                                stack-label 
                                dense
                            >
                            </q-input>
                        </div>
                    </div>
                    <q-separator class="q-mt-sm q-mb-sm" />

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
                                    <q-card>
                                        <q-card-section>
                                            <q-list>
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
                                        </q-card-section>
                                    </q-card>
                                </q-popup-proxy>
                            </q-input>

                            <div v-if="form.orderItem.length > 0" class="q-mt-md">
                                <q-card v-for="item in form.orderItem" :key="item.id" class="my-card q-mt-sm" flat bordered>
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label class="text-bold">{{ item.product }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn @click="removeStockItem(item)" size="sm" class="full-width" color="red" icon="delete" />
                                        </q-item-section>
                                    </q-item>

                                    <q-separator />

                                    <q-card-section horizontal>
                                        <q-card-section class="col-4">
                                            <q-item-label>Order Details: </q-item-label>
                                        </q-card-section>

                                        <q-separator vertical />

                                        <q-card-section>
                                            <q-input
                                                outlined
                                                v-model="item.srp" 
                                                stack-label 
                                                dense
                                                label="Price"
                                                :rules="[
                                                    val => val > 0 || 'Invalid Price',
                                                    val => val >= item.minSell || `Price cannot be lower than ${item.minSell}`,
                                                    val => val <= item.minSell || `Price cannot be greater than ${item.minSell}`
                                                ]"
                                            >
                                            </q-input>
                                            <q-input
                                                label="Quantity"
                                                outlined
                                                v-model="item.quantity" 
                                                stack-label 
                                                dense
                                            >
                                            </q-input>
                                        </q-card-section>
                                    </q-card-section>
                                </q-card>
                            </div>
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
                                No Items Added Yet.
                                </span>
                            </div>
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
                        label="Save Order Details" 
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
import { last } from 'pdf-lib';
import geolocation from 'geolocation';

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
                orderStatus: 1,
                createdBy: '',
                geoTag: {
                    latitude: 0,
                    longitude: 0
                }
            },
            selectedModalData: {},
            contacts: [],
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        filteredStores(){
            return this.contacts.filter((item) => {
                return item.name.toLowerCase().includes(this.search.toLowerCase())
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
        getBackDashboard(){
            this.$router.push({name: 'distributionDashboard'})
        },
        getLists(){
            this.$q.loading.show();
            api.post('distribution/getAllClients').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let list = data.list;
                    this.contacts = list.map((item) => {
                        return {
                            id: item.id,
                            name: item.storeName,
                            details: item.address,
                            letter: item.storeName.charAt(0).toUpperCase(),
                            values: item
                        }
                    })
                    // {
                    //     id: 4,
                    //     name: 'Seka Fawdrey',
                    //     email: 'sfawdrey3@wired.com',
                    //     letter: 'S'
                    // }
                } 
            })

            this.$q.loading.hide();
        },
        async addOrder(details){

            // Get GeoLocation
            let vm = this
            geolocation.getCurrentPosition(function (err, position) {
                if (err) throw err

                console.log(position.coords.latitude, position.coords.longitude)
                alert(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`)
                vm.form.geoTag = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            })
            
            this.selectedClient = details
            this.addOrderModal = true
        },
        addNewClient(){
            this.$q.dialog({
                title: 'Create New Client',
                message: 'Would you like to add this client?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                this.$q.loading.show();

                let payload = {
                    ...this.form,
                    createdBy: this.user.userId
                }

                api.post('distribution/addClient', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                       this.addClient = false
                       this.getLists();
                    } else {
                        this.$q.notify({
                            color: 'negative',
                            position: 'top',
                            message: data.message
                        })
                    }
                })
                this.$q.loading.hide();
                
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


                let payload = {
                    transaction: {
                        ...this.form,
                        storeName: this.selectedClient.storeName,
                        address: this.selectedClient.address,
                        ownerName: this.selectedClient.ownerName,
                        contact: this.selectedClient.contact,
                        agentName: this.user.fullName,
                        clientId: this.selectedClient.id,
                        agentId: this.user.userId,
                        createdBy: this.user.userId || 1
                    },
                    updateDetails: {
                        attendanceId: this.user.userId,
                        attendanceDate: dateNow,
                        lastOrderDate: moment().format('YYYY-MM-DD HH:mm'),
                    },
                }
                api.post('distribution/create/order', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                        this.$q.notify({
                            color: 'positive',
                            position: 'top-right',
                            message: 'Order Successfully Save',
                            icon: 'verified'
                        })
                        this.selectedClient = {}
                        this.addOrderModal = false
                        this.addClient = false
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
    border-radius: 10px;
    box-shadow: 0px 0px 3px -2px !important;
}
.my-card-item{
    border-radius: 10px;
}
</style>