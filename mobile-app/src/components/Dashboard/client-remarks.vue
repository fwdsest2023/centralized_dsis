<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Remarks and Recommendation</q-toolbar-title>
                        <q-btn
                            @click="addProductView = true"
                            round 
                            color="primary" 
                            icon="add_comment" 
                        />
                        
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:60vh;max-height: 60vh" class="scroll">
                    <q-list>
                        <div v-for="(item, index) in loadClientData[clientId].remarks" :key="index">
                            <q-item>
                                <q-item-section avatar>
                                    <q-icon name="radio_button_checked" size="sm" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{item}}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <q-item v-if="loadClientData[clientId].remarks.length === 0" >
                            <q-item-section class="text-center">
                                <q-item-label>
                                    <q-icon name="report" color="grey-3" size="7rem" /><br>
                                    <strong>No Remarks Found!</strong>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                     <q-btn flat label="Previous" :loading="btnLoading" color="negative" @click="closeModal" />
                    <q-btn flat label="Next" :loading="btnLoading" color="positive" @click="submitOrder" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="addProductView" persistent transition-show="scale" 
            transition-hide="scale">
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Remarks</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input
                        v-model="remark"
                        filled
                        autogrow
                        dense
                        autofocus 
                    />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Remarks" @click="addRemarks" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        
    </div>
</template>
<script>
import {LocalStorage} from 'quasar'

export default {
    name: "ClientRemarks",
    data() {
        return {
            openModal: false,
            loadClientData: [],
            addProductView: false,
            searchClient: '',
            imageSrc: '',
            remark: ''
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
            if(newVal === true){
                this.clientList()
            }
        }
    },
    computed: {
        filterList(){
            return  this.loadProductList.filter(search => {
                return search.productName.toLowerCase().includes(this.searchClient.toLowerCase())
            })
        },
    },
    methods: {
        clientList(){
            let data = LocalStorage.getItem('clientList')
            this.loadClientData = data
        },
        async closeModal(){
            this.$emit('updateStatus', false);
            this.$emit('backStep', {nextTo: 'booking'});
        },
        async submitOrder(){
            this.$emit('addClientRemarks', this.loadClientData);
            this.$emit('moveStep', {nextTo: 'selfie'});
        },
        addRemarks(){
            this.loadClientData[this.clientId]
            .remarks
            .push(this.remark)
            this.$nextTick(() => {
                this.remark = ""
                LocalStorage.set("clientList", this.loadClientData)
            })
        }
    }
}
</script>
