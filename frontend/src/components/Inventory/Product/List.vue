<template>
    <div>
        <div v-if="!isContinueEdit" class="q-pa-md" style="width: 100%;">
            <div class="row">
                <div class="col col-md-6">
                    <span class="title">Product List</span>
                </div>
                <div class="col col-md-6 text-right">
                    <q-btn 
                        unelevated 
                        color="primary"
                        @click="openProductModal('add', 0)"
                    >
                        <q-icon left name="add" />
                        <div>New Product</div>
                    </q-btn>
                </div>
                <div v-if="isLoading" class="col col-md-12 text-center">
                    <q-spinner-orbit
                        color="primary"
                        size="3em"
                    />
                </div>
                <div v-if="tableRow.length === 0" class="col col-md-12 text-center">
                    <noData
                        @reloadData="getList"
                    />
                </div>
                <div v-if="tableRow.length > 0" class="col col-md-12 q-mt-md">
                    <q-table
                        :rows="tableRow"
                        :filter="filter"
                        :columns="tableColumns"
                        row-key="productName"
                    >
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" class="q-mr-md" v-model="filter" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <q-btn
                                unelevated
                                color="primary"
                                @click="exportCSVForProduct"
                                label="Export CSV For Stock Import"
                            />
                        </template>
                        <template v-slot:body-cell-unit="props">
                            <q-td :props="props">
                                {{parseData(props.row.unit)}}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-category="props">
                            <q-td :props="props">
                                {{parseData(props.row.category)}}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-stock="props">
                            <q-td :props="props">
                                999999
                            </q-td>
                        </template>
                        <template v-slot:body-cell-hasPriceGroup="props">
                            <q-td :props="props">
                                <span v-if="props.row.hasPriceGroup === '0'">N/A</span>
                                <q-btn
                                    v-else
                                    dense
                                    flat
                                    outline
                                    size="md"
                                    color="primary" 
                                    label="View"
                                    @click="showCostGroup(props.row.costGroup)"
                                />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn 
                                    dense
                                    flat
                                    outline
                                    size="md"
                                    color="primary" 
                                    label="Edit"
                                    @click="openProductModal('edit', props.row)"
                                />
                                <q-btn 
                                    dense
                                    flat
                                    outline
                                    size="md"
                                    color="red" 
                                    label="Delete"
                                    @click="deleleSaveData(props.row.key)"
                                />
                            </q-td>
                        </template>
                    </q-table>
                </div>
            </div>
        </div>
        <addProductModal
            :appId="appId"
            :modalStatus="openAddModal"
            :processType="pType"
            @updateModalStatus="closeProductModal"
            @refreshData="getList"
        />
        
    </div>
</template>

<script>
import moment from 'moment';
import { LocalStorage, SessionStorage } from 'quasar'
import noData from '../../Templates/NoData.vue';
import addProductModal from '../Modals/AddProduct.vue'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default {
    name: 'ProductList',
    data(){
        return {
            isContinueEdit: false,
            isPwd: true,
            isLoading: false,
            submitting: false,
            tableRow: [],
            filter: '',
            saveDetails: null,
            saveId: null,
            insertedID: null,
            openAddModal: false,
            appId: {},
            pType: 'add'
        }
    },
    components: {
        noData,
        addProductModal
    },
    created(){
        this.getList();
    },
    methods: {
        moment,
        openProductModal(type, id){
            this.openAddModal = true;
            this.pType = type;
            this.appId = id;
        },
        closeProductModal(){
            this.openAddModal = false
            this.pType = 'add'
            this.appId = {}
        },
        parseData(data){
            let res = JSON.parse(data);
            // console.log(data)
            // console.log(typeof res)
            return res.label
            
        },
        convertCurrency(value){
            let amount = Number(value);
            return amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'PHP',
            })
        },
        async getList(){
            this.tableRow = [];
            this.isLoading = true;
            let vm = this;
            
            api.post('product/get/products').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.tableRow = response.status < 300 ? data.list : [];
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

            this.isLoading = false;
        },
        async exportCSVForProduct(){
            let exportColumn = [
                'id',
                'productName',
                'quantity',
                'stockNotice'
            ]
			const content = [exportColumn.map(col => this.wrapCsvValue(col))].concat(
				this.tableRow.map(row => exportColumn.map(col => this.wrapCsvValue(
					row[ col === void 0 ? col : col ],
					col.format,
					row
				)).join(','))
			).join('\n')

			const anchor = document.createElement('a');
			anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content);
			anchor.target = '_blank';
			anchor.download = 'ProductStockValues.csv';
			anchor.click();
		},
		wrapCsvValue (val, formatFn, row) {
			let formatted = formatFn !== void 0
				? formatFn(val, row)
				: val

			formatted = formatted === void 0 || formatted === null
				? ''
				: String(formatted)

			formatted = formatted.split('"').join('""')
			/**
			 * Excel accepts \n and \r in strings, but some other CSV parsers do not
			 * Uncomment the next two lines to escape new lines
			 */
			// .split('\n').join('\\n')
			// .split('\r').join('\\r')

			return `"${formatted}"`
		},
        // end
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        exportedColumns(){
            return [
                {
                    dataIndex : 'productName',
                    field: 'productName',
                },
                {
                    dataIndex : 'productName',
                    field: 'productName',
                },
                {
                    dataIndex : 'productName',
                    field: 'productName',
                },
                {
                    dataIndex : 'productName',
                    field: 'productName',
                },
            ]
        },
        tableColumns: function(){
            // "SKU", "Products", "Unit Type", "Unit Price", "Category ID", "Total Stock", "Action"
            return  [
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
    }
}
</script>

<style lang="scss" scoped>
.title{
    font-weight: 600;
    font-size: 18pt;
}
</style>
