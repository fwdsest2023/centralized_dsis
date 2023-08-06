<template>
    <div>
        <q-dialog
            v-model="openModal"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card style="width: 700px; max-width: 80vw;" >
                <q-bar class="q-mb-md">
                    <div class="text-h6">Booking Details</div>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section style="max-height: 70vh; height: 50vh;" class="q-pt-none scroll">
                    <q-table
                        :rows="productList"
                        :filter="filter"
                        :columns="tableColumns"
                        row-key="itemName"
                        separator="cell"
                    >
                        <template v-slot:body-cell-total="props">
                            <q-td :props="props">
                                {{props.row.qty * props.row.price}}
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn 
                        :disable="productList.length === 0"
                        flat 
                        label="Generate Invoice" 
                        color="primary" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import { LocalStorage } from 'quasar'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

const dateNow = moment().format('MM/DD/YYYY');

export default{
    name: 'PrintModal',
    data(){
        return {
            openModal: false,
            productList: []
        }
    },
    watch:{
        modalStatus(newVal){
            this.openModal = newVal
            this.productList = this.bookedList
        }
    },
    props: {
        bookedList: {
            type: Array
        },
        modalStatus: {
            type: Boolean
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        tableColumns: function(){
            // ["Business Name", "Address", "Category", "Call", "Remarks", "Action"];
            return [
                {
                    name: 'itemName',
                    required: true,
                    label: 'Item Name',
                    align: 'left',
                    field: row => row.itemName,
                    format: val => `${val}`,
                    sortable: true
                },
                // { name: 'category', label: 'Category', field: 'category', align: 'left' },
                { name: 'price', label: 'Price', field: 'price', align: 'left' },
                { name: 'qty', label: 'QTY', field: 'qty', align: 'left' },
                { name: 'total', label: 'Total', field: 'total', align: 'left' },
            ]
        }
    },

    methods: {
        async closeModal(){
            this.$emit('updateModalStatus', false);
        },
    }
    
}
</script>
