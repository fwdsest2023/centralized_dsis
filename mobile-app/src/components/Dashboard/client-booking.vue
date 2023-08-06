<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Booking</q-toolbar-title>
                        <q-btn
                            @click="addProductView = true"
                            round 
                            color="primary" 
                            icon="add_shopping_cart" 
                        />
                        
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:60vh;max-height: 60vh" class="scroll">
                    <q-list>
                        <div v-if="bookingList.length !== 0">
                            <div v-for="(item, index) in bookingList" :key="index">
                                <q-slide-item @right="removeItem(index)"  right-color="red">
                                    <template v-slot:right>
                                        <q-icon name="delete_forever" />
                                    </template>
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label>{{item.itemName}}</q-item-label>
                                            <q-item-label caption lines="2">{{item.price}}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side top>
                                            <q-input type="number" outlined v-model="item.qty" style="width: 70px;" label="QTY" />
                                        </q-item-section>
                                    </q-item>
                                </q-slide-item>
                            </div>
                        </div>
                        <q-item v-if="bookingList.length === 0" >
                            <q-item-section class="text-center">
                                <q-item-label>
                                    <q-icon name="report" color="grey-3" size="7rem" /><br>
                                    <strong>No Product Added!</strong>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                     <q-btn flat label="Cancel" :loading="btnLoading" color="negative" @click="closeModal" />
                    <q-btn flat label="Done" :loading="btnLoading" color="positive" @click="submitOrder" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog 
            v-model="addProductView" 
            persistent 
            transition-show="scale" 
            transition-hide="scale">
            <q-card  style="width: 100%">
                <q-bar class="q-mb-md">
                    <div class="text-h6">Search for Product</div>
                    <q-space />
                    <q-btn dense flat icon="close" v-close-popup>
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>

                    
                </q-bar>

                <q-card-header>
                    <q-input
                        class="q-mt-sm q-pa-md"
                        bottom-slots 
                        v-model="searchClient" 
                        label="Search Product" 
                        dense
                    >
                        <template v-slot:append>
                            <q-icon v-if="searchClient !== ''" name="close" @click="searchClient = ''" class="cursor-pointer" />
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </q-card-header>

                <q-card-section style="height:50vh;max-height: 50vh" class="q-pt-none">
                    <q-list>
                        <div v-for="(item, index) in filterList" :key="index">
                            <q-item>
                                <q-item-section>
                                    <q-item-label>{{item.productName}}</q-item-label>
                                    <q-item-label caption lines="2">{{`P - ${item.productSRP}`}}</q-item-label>
                                </q-item-section>
                                <q-item-section side top>
                                    <q-btn
                                        @click="addProduct(item)"
                                        flat 
                                        round
                                        color="blue" 
                                        icon="add" 
                                        size="md" 
                                    />
                                </q-item-section>
                            </q-item>
                        </div>
                        <q-item v-if="filterList.length === 0" >
                            <q-item-section>
                                No Booked Product
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import json from '../../context-data/products.json'
import { Preferences } from '@capacitor/preferences';

export default {
    name: "ClientBooking",
    data() {
        return {
            openModal: false,
            loadProductList: [],
            loadClientData: [],
            bookingList: [],
            addProductView: false,
            searchClient: '',
            imageSrc: ''
        }
    },
    props: {
        clientId: {
            type: Object,
            default: 0
        },
        modalStatus: {
            type: Boolean
        },
        resetData: {
            type: Boolean
        }
    },
    watch:{
        modalStatus: function(newVal){
            this.openModal = newVal
            if(newVal === true){
                // this.clientList()
                // this.clientId
                this.bookingList = this.clientId.booking.length > 0 ? this.clientId.booking : [];
                this.loadProductList = json.products
            }
        },
        resetData: function(newVal){
            this.bookingList = []
        }
    },
    computed: {
        filterList(){
            let dataClient = this.clientId
            let area = dataClient.client.addressDetails.province !== undefined ? 
            dataClient.client.addressDetails.province.label : "";
            this.loadProductList.map((item) => {
                if(item.hasPriceGroup === "1"){
                    let setPrice = item.costGroup.filter(el => {
                        return el.regionName === area
                    })
                    item.productSRP = setPrice[0].price
                }

                item.productSRP = Number(item.productSRP).toFixed(2)
                return item
            })

            return this.loadProductList.filter(search => {
                return search.productName.toLowerCase().includes(this.searchClient.toLowerCase())
            })
        },
    },
    methods: {
        async clientList(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : [];
            
            this.loadClientData = data;
        },
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        async submitOrder(){
            if(this.bookingList.length === 0){
                this.$q.notify({
                    color: 'negative',
                    position: 'top',
                    title: 'Invalid to proceed',
                    message: 'Please add product before moving to the next step',
                    icon: 'report_problem'
                })
                return false;
            }
            let data = {
                type: 'booking',
                value: this.bookingList
            }

            this.$emit('orderSubmit', data)
            
            // set the booking value
            // this.loadClientData[this.clientId].booking = this.bookingList

            // await Preferences.set({
            //     key: 'clientList',
            //     value: JSON.stringify(this.loadClientData)
            // }).then(() => {
            //     this.bookingList = [];
            //     this.$emit('moveStep', {nextTo: 'remarks'});
            // })
        },
        async addProduct(item){
            let list = {
                itemId: item.id,
                itemName: item.productName,
                price: item.productCost,
                qty: 0
            }
            
            this.bookingList.push(list)
            this.addProductView = false;

        },
        async removeItem(index){
            this.bookingList.splice(index, 1)
        }
    }
}
</script>
