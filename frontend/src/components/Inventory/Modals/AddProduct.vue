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
                    <div class="text-h6">Add New Product</div>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>
                <q-card-section class="row items-center no-wrap" >
                    <div>
                        <div class="text-h6 ">Upload product capacity details: </div>
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
                <q-card-section style="max-height: 70vh; height: 70vh;" class="q-pt-none scroll">
                    <q-form
                        ref="formDetails"
                        class="row"
                    >   
                        <div class="col col-md-12">
                            <span class="text-h5">Product Details</span>
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
                        v-if="processType === 'add'"
                        flat 
                        label="Submit" 
                        color="primary"
                        @click="submitModalClick" 
                    />
                    <q-btn
                        v-else
                        flat 
                        label="Update Data" 
                        color="primary"
                        @click="updateProduct" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import * as d3 from "d3"
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

const dateNow = moment().format('MM/DD/YYYY');

export default{
    name: 'PrintModal',
    data(){
        return {
            openModal: false,
            productList: [],
            csvFile: null,
            form: {
                sku: '',
                productName: '',
                productCost: '',
                productSRP: '',
                unit: '',
                category: '',
                description: '',
                hasPriceGroup: false,
                costGroup: {},
                createdBy: 0,
            },
            catOptions: [
                {label: 'Box', value: 'BX'},
                {label: 'Piece', value: 'PC'},
                {label: 'Bottle', value: 'BT'},
                {label: 'Bag', value: 'BG'},
                {label: 'Pouch', value: 'PH'}
            ],
            uTypeOptions: [
                {label: 'Cat Food', value: '1'},
                {label: 'Dog Food', value: '2'},
                {label: 'OTC Medicine', value: '3'},
                {label: 'Pet Accesories', value: '4'},
                {label: 'Poultry Lines', value: '5'}
            ],
            groupBrnach: [
                {
                    "regionId": 1,
                    "regionName": 'Nueva Ecija',
                    "price": 0
                },
                {
                    "regionId": 2,
                    "regionName": 'Aurora',
                    "price": 0
                }
            ]

        }
    },
    watch:{
        csvFile(newVal){
            this.getFile(newVal)
        },
        modalStatus(newVal){
            this.openModal = newVal
            if(this.processType === 'edit'){
                this.fillTheDetails()
            }
        }
    },
    props: {
        appId: {
            type: Number
        },
        modalStatus: {
            type: Boolean
        },
        processType: {
            type: String
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
                    name: 'supplier',
                    required: true,
                    label: 'Company',
                    align: 'left',
                    field: row => row.supplier,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'productSRP',
                    required: true,
                    label: 'SRP (PHP)',
                    align: 'left',
                    field: row => row.productSRP,
                    format: val => `${this.convertCurrency(val)}`,
                    sortable: true
                },
                {
                    name: 'netCost',
                    required: true,
                    label: 'NET PRICE (PHP)',
                    align: 'left',
                    field: row => row.netCost,
                    format: val => `${this.convertCurrency(val)}`,
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
        fillTheDetails(){
            this.form = {
                sku: this.appId.sku,
                productName: this.appId.productName,
                productCost: this.appId.productCost,
                productSRP: this.appId.productSRP,
                unit: JSON.parse(this.appId.unit),
                category: JSON.parse(this.appId.category),
                description: this.appId.description,
                hasPriceGroup: false,
                costGroup: {},
            }
        },
        async closeModal(){
            this.clearForm();
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
                        // this.$emit('submitModalClick', vm.form);
                        this.addNewProduct();
                    })
                }
            })
            
        },

        async addNewProduct(){
            this.$q.loading.show();
            let payload = { list: this.productList}
            
            api.post('product/add/new', payload).then((response) => {
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
        async updateProduct(){
            this.$q.loading.show();
            let payload = {
                id: this.appId.id,
                ...this.form
            }

           
            api.post('product/update/details', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.$emit('refreshData')
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
        convertCurrency(value){
            let amount = Number(value);
            return amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
            })
        },
        clearForm(){
            this.form = {
                sku: '',
                productName: '',
                productCost: '',
                productSRP: '',
                unit: '',
                category: '',
                description: '',
                hasPriceGroup: false,
                costGroup: {},
                createdBy: 0,
            }
        }
    }
    
}
</script>
