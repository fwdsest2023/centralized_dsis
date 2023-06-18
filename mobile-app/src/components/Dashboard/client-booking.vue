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
                        <div v-for="(item, index) in loadClientData.booking" :key="index">
                            <q-item>
                                <q-item-section>
                                    <q-item-label>{{item.itemName}}</q-item-label>
                                    <q-item-label caption lines="2">{{item.price}}</q-item-label>
                                </q-item-section>
                                <q-item-section side top>
                                    <q-input type="number" outlined v-model="item.qty" style="width: 70px;" label="QTY" />
                                </q-item-section>
                            </q-item>
                        </div>
                        <q-item v-if="loadClientData.booking.length === 0" >
                            <q-item-section>
                                No Booked Product
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                     <q-btn flat label="Cancel" :loading="btnLoading" color="negative" @click="closeModal" />
                    <q-btn flat label="Next" :loading="btnLoading" color="positive" @click="submitOrder" />
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
                                    <q-item-label caption lines="2">{{item.productCost}}</q-item-label>
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
import jsonClient from '../../context-data/clients.json'

export default {
    name: "ClientBooking",
    data() {
        return {
            openModal: false,
            loadProductList: [],
            loadClientData: {
                booking: []
            },
            addProductView: false,
            searchClient: '',
            imageSrc: ''
        }
    },
    props: {
        clientId: {
            type: Number,
            default: 0
        },
        modalStatus: {
            type: Boolean
        }
    },
    watch:{
        modalStatus: function(newVal){
            this.openModal = newVal
        }
    },
    computed: {
        clientList: function(){
            this.loadProductList = json.products
            this.loadClientData = this.clientId !== null ? jsonClient.list[this.clientId] : {
                booking:[]
            }
        },
        filterList(){
            return  this.loadProductList.filter(search => {
                return search.productName.toLowerCase().includes(this.searchClient.toLowerCase())
            })
        },
    },
    created(){
        this.clientList
    },
    methods: {
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        async submitOrder(){
            this.$emit('orderSubmit', false);
        },
        addProduct(item){
            let list = {
                itemId: item.id,
                itemName: item.productName,
                price: item.productCost,
                qty: 0,
                total: 0
            }
            
            this.loadClientData.booking.push(list)
        }
    }
}
</script>
