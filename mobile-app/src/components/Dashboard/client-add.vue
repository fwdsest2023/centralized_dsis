<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Add Client</q-toolbar-title>
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:60vh;max-height: 100vh" class="scroll">
                    <div class="">
                        <q-form
                            ref="formDetails"
                            class="row"
                        >
                            <q-input 
                                class="col col-xs-12 col-md-6 q-pa-sm" 
                                bottom-slots
                                v-model="form.client.storeName"
                                label="Store Name" 
                                :dense="true"
                                :rules="[ val => val && val.length > 0 || 'This field is required']"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="store" />
                                </template>
                                <template v-slot:append>
                                    <q-icon name="close" @click="form.client.storeName = ''" class="cursor-pointer" />
                                </template>
                            </q-input>

                            <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-lg">
                                <span class="text-h6">STORE DETAILS</span>
                            </div>
                            
                            <q-input
                                class="col col-xs-12 col-md-12 col-sm-12  q-pa-sm q-mt-sm"
                                dense
                                v-model="form.client.address"
                                label="Address"
                                :rules="[ val => val && val.length > 0 || 'This field is required']"
                            />
                            
                            <q-select
                                class="col col-xs-12 col-md-12 q-pa-sm"
                                bottom-slots
                                v-model="form.client.regionId" 
                                :options="regionList" 
                                label="Region"
                                dense 
                                :options-dense="true"
                            >
                            </q-select>

                            <q-select
                                class="col col-xs-12 col-md-12 q-pa-sm"
                                bottom-slots
                                v-model="form.client.categoryId" 
                                :options="categoryList" 
                                label="Category"
                                dense 
                                :options-dense="true"
                            >
                            </q-select>
                        </q-form>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="negative" @click="closeModal" />
                    <q-btn flat label="Add Client" color="positive" @click="addClient" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import jsonClient from '../../context-data/clients.json'
import jsonMisc from '../../context-data/misc.json'
import jsonBranch from '../../context-data/branches.json'

export default {
    name: "ClientAdd",
    data() {
        return {
            openModal: false,
            loadProductList: [],
            loadClientData: {
                booking: []
            },
            addProductView: false,
            searchClient: '',
            imageSrc: '',
            form: {
                client: {
                    storeName: "",
                    address: "",
                    branch: "",
                    regionId: null,
                    categoryId: null,
                    geoLocation: {},
                    type: "client",
                    contactPerson:{
                        name: "",
                        contactNum: ""
                    },
                    loading: false,
                    icon: "play_circle",
                    color: "green",
                    status: "pending"
                },
                attendance: {
                    startCall: "",
                    endCall: "",
                    geoLocation: {
                        timeIn:"",
                        timeOut:"",
                        coorIn: {},
                        coorOut: {}
                    }
                },
                booking:[],
                remarks: [],
                files: ""
            }
        }
    },
    props: {
        modalStatus: {
            type: Boolean
        }
    },
    computed:{
        regionList: function(){
            let list = jsonBranch.regions
            let res = list.map((el) => {
                let opt = {
                    value: el.id,
                    label: el.regionName,
                    branch: el.branchName
                }

                return opt
            });

            return res
        },
        categoryList: function(){
            let list = jsonMisc.category;
            let res = list.map((el) => {
                let opt = {
                    value: el.id,
                    label: el.catName,
                    desc: el.catDesc
                }

                return opt
            });

            return res
        },
    },
    watch:{
        modalStatus: function(newVal){
            this.openModal = newVal
        }
    },
    created(){
        this.clientList
    },
    methods: {
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        addClient(){
            let frm = this.form
            frm.client.branch = frm.client.regionId.branch
            frm.client.regionId = frm.client.regionId.value
            frm.client.categoryId = frm.client.categoryId.value

            // jsonClient.list.push(frm)
            this.$emit('addClientData', frm);
            this.clearForm();
            this.$emit('updateStatus', false);
            
        },
        clearForm(){
            this.form = {
                client: {
                    storeName: "",
                    address: "",
                    branch: "",
                    regionId: null,
                    categoryId: null,
                    geoLocation: {},
                    type: "client",
                    contactPerson:{
                        name: "",
                        contactNum: ""
                    },
                    loading: false,
                    icon: "play_circle",
                    color: "green",
                    status: "pending"
                },
                attendance: {
                    startCall: "",
                    endCall: "",
                    geoLocation: {
                        timeIn:"",
                        timeOut:"",
                        coorIn: {},
                        coorOut: {}
                    }
                },
                booking:[],
                remarks: [],
                files: ""
            }
        }
    }
}
</script>