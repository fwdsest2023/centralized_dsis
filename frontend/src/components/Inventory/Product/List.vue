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
                    <noData />
                </div>
                <div v-if="tableRow.length > 0" class="col col-md-12 q-mt-md">
                    <q-table
                        :rows="tableRow"
                        :filter="filter"
                        :columns="tableColumns"
                        row-key="productName"
                    >
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
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
                                    @click="getSavedDetails(props.row.key)"
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

        
    </div>
</template>

<script>
import moment from 'moment';
import { LocalStorage, SessionStorage } from 'quasar'
import noData from '../../Templates/NoData.vue';
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default{
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
            openPrintStatus: false,
            appId: 0,
        }
    },
    components: {
        noData
    },
    created(){
        this.getList();
    },
    methods: {
        moment,
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
        
        // end
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        tableColumns: function(){
            return [
                {
                    name: 'productName',
                    required: true,
                    label: 'Product Name',
                    align: 'left',
                    field: row => row.productName,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'description', label: 'Description', field: 'description' },
                { name: 'category', label: 'Category', field: 'category' },
                { name: 'subCategory', label: 'Sub Category', field: 'subCategory' },
                { name: 'type', label: 'Type', field: 'type' },
                { name: 'status', label: 'Status', field: 'status' },
                { name: 'createdDate', label: 'Created Date', field: 'createdDate' },
                { name: 'actions', label: 'Action', field: 'actions' }
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
