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
                    <div class="text-h6">Add New Stock</div>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>
                <q-card-section class="row items-center no-wrap" >
                    <div>
                        <div class="text-h6 ">Upload Product Stock Details: </div>
                    </div>
                    <q-space />
                    <div>
                        <q-file 
                            outlined 
                            v-model="csvFile"
                            dense
                        >
                            <template v-slot:prepend>
                                <q-icon name="attach_file" />
                            </template>
                        </q-file>
                    </div>
                </q-card-section>
                <q-card-section style="max-height: 70vh;" class="q-pt-none scroll">
                    <q-form
                        v-if="productList.length <= 0"
                        ref="formDetails"
                        class="row"
                    >   
                        <div class="col col-md-12">
                            <span class="text-h5">Inventory Details</span>
                            <q-separator />
                        </div>
                        <div class="col col-md-12 q-pa-sm">
                            <q-select 
                                outlined
                                use-input
                                input-debounce="0"
                                v-model="form.productId" 
                                :options="productOptions" 
                                label="Product" 
                                stack-label 
                                dense
                                options-dense
                                @filter="searchProductsFn"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No product found!
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                        </div>
                        <div class="col col-md-4 q-pa-sm">
                            <q-input 
                                type="number"
                                outlined 
                                v-model="form.quantity" 
                                label="Product Quantity" 
                                stack-label 
                                dense
                            />
                        </div>
                        <div class="col col-md-4 q-pa-sm">
                            <q-input 
                                type="number"
                                outlined 
                                v-model="form.stockNotice" 
                                label="Stock Notice" 
                                stack-label 
                                dense
                            />
                        </div>
                        <div class="col col-md-4 q-pa-sm">
                            <q-select 
                                outlined 
                                v-model="form.status" 
                                :options="statusOption" 
                                label="Status" 
                                stack-label 
                                dense
                                options-dense
                            />
                        </div>
                    </q-form>
                    <q-form
                        v-if="productList.length > 0"
                        ref="formDetails"
                        class="row"
                    >   
                        <div class="col col-md-12 q-pa-sm q-mt-md">
                            <span class="text-h5">Product Stock Details</span>
                            <q-separator />
                        </div>
                        <div class="col-12">
                            <q-table
                                flat bordered
                                :rows="productList"
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
                                    </q-tr>
                                </template>
                            </q-table>
                        </div>
                    </q-form>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn 
                        v-if="productList.length <= 0"
                        flat 
                        label="Submit" 
                        color="primary"
                        @click="submitModalClick" 
                    />
                    <q-btn 
                        v-if="productList.length > 0"
                        flat 
                        label="Submit Bulk Upload" 
                        color="primary"
                        @click="submitModalClick" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import * as d3 from "d3"
import moment from 'moment';
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

const dateNow = moment().format('MM/DD/YYYY');

export default {
    name: 'PrintModal',
    data(){
        return {
            csvFile: null,
            productList: [],
            openModal: false,
            form: {
                productId: { label: '', value: '' },
                quantity: 0,
                stockNotice: 0,
                status: {label: 'In Stock', value: 'In Stock'},
            },
            otherDetailsLabels: {
                totalQty: 'Unit Total Quantity',
                pricePerItem: 'Individual Item Price',
                perItemType: 'Individual Item Unit',
            },
            productOptions: [],
            stringProductOptions: [],
            uTypeOptions: [
                {label: 'Box', value: 'BX'},
                {label: 'Piece', value: 'PC'},
                {label: 'Bottle', value: 'BT'},
                {label: 'Bag', value: 'BG'},
                {label: 'Pouch', value: 'PH'}
            ],
            statusOption: [
                {label: 'In Stock', value: 'In Stock'},
                {label: 'Out of Stock', value: 'Out of Stock'}
            ],
        }
    },
    props: {
        appId: {
            type: Number
        },
        modalStatus: {
            type: Boolean
        }
    },
    watch:{
        csvFile(newVal){
            this.getFile(newVal)
        },
        modalStatus(newVal){
            this.openModal = newVal
            if(newVal){
                this.getProducts();
            }
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        capacityColumns(){
            return [
                {
                    name: 'productName',
                    required: true,
                    label: 'Product',
                    align: 'left',
                    field: row => row.productName,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'quantity',
                    required: true,
                    label: 'Quantity',
                    align: 'left',
                    field: row => row.quantity,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'stockNotice',
                    required: true,
                    label: 'Stock Notice',
                    align: 'left',
                    field: row => row.stockNotice,
                    format: val => `${val}`,
                    sortable: true
                },
            ]
        }
    },
    methods: {
        async getFile(data){
			// console.log(file)
			// return
			var reader = new FileReader();
			// let filePath = data.file.originFileObj
			let filePath = data
			reader.readAsText(new Blob(
				[filePath],
				{"type": filePath.type}
			))
			const fileContent = await new Promise(resolve => {
				reader.onloadend = (event) => {
                    console.log(event.target)
				    resolve(event.target.result)
				}
			})
			let csvData = d3.csvParse(fileContent)
			

            this.productList = csvData

			return false
		},
        async searchProductsFn(val, update){
            const vm = this;
            if (val === '') {
                update(() => {
                    vm.productOptions = vm.stringProductOptions
                    // here you have access to "ref" which
                    // is the Vue reference of the QSelect
                })
                return
            }

            update(() => {

                const needle = val.toLowerCase()
                vm.productOptions = vm.stringProductOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
            })
        },
        async closeModal(){
            this.$emit('updateModalStatus', false);
        },
        async submitModalClick(){
            let vm = this;

            this.$refs.formDetails.validate().then(success => {
                if(!success){
                    this.$q.notify({
                        color: 'negative',
                        position: 'top-right',
                        title: 'Incomplete Form',
                        message: 'Please fill the required fields',
                        icon: 'report_problem'
                    })
                    return false;
                } else {
                    // Confirm
                    this.$q.dialog({
                        title: 'Submit details',
                        message: 'Would you like to finalize and save your data?',
                        ok: {
                            label: 'Yes'
                        },
                        cancel: {
                            label: 'No',
                            color: 'negative'
                        },
                        persistent: true
                    }).onOk(() => {
                        if(vm.productList.length <= 0){
                            vm.addStock()
                        } else {
                            vm.addStockBulk()
                        }
                        // this.addStock()
                    })
                }
            })
            
        },
        async addStock(){
            this.$q.loading.show();
            let payload = this.form
            payload.productId = Number(payload.productId.value)
            payload.status = payload.status.value

            api.post('stock/add/new', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.$emit('refreshData')
                    this.clearForm();
                    this.closeModal();
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

            this.$q.loading.hide();
        },
        async addStockBulk(){
            this.$q.loading.show();
            let payload = { list: this.productList}

            api.post('stock/add/bulk', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.$emit('refreshData')
                    this.clearForm();
                    this.closeModal();
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

            this.$q.loading.hide();
        },
        clearForm(){
            this.form = {
                productId: { label: '', value: '' },
                quantity: 0,
                stockNotice: 0,
                status: {label: 'In Stock', value: 'In Stock'},
            }
        },
        getProducts(){
            api.post('product/get/products').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let listVal = data.list;

                    this.productOptions = listVal.map((el) => {

                        return {
                            label: el.productName,
                            value: el.id
                        }
                    })
                    this.stringProductOptions = listVal.map((el) => {
                        return {
                            label: el.productName,
                            value: el.id
                        }
                    })
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
        parseData(data){
            let res = JSON.parse(data);
            return res
        },
    }
    
}
</script>
