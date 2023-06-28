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
                                :rules="[val => val && val.length > 0 || 'This field is required']"
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
                                v-model="form.client.contactPerson.name"
                                label="Store Owner/Representantive"
                                :rules="[ val => val && val.length > 0 || 'This field is required']"
                            />
                            <q-input
                                class="col col-xs-12 col-md-12 col-sm-12  q-pa-sm q-mt-sm"
                                dense
                                v-model="form.client.contactPerson.contactNum"
                                label="Contact Number"
                                :rules="[ val => val && val.length > 0 || 'This field is required']"
                            />
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

                            <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-lg">
                                <span class="text-h6">STORE MAP</span>
                            </div>
                            <capacitor-google-map ref="myMap" id="map"></capacitor-google-map>
                            <div ref="map" id="map"></div>
                            <!-- <div id="map" v-if="map" style="width:100%;">
                                <iframe
                                    width="100%"
                                    height="250"
                                    frameborder="0" 
                                    style="border:0"
                                    referrerpolicy="no-referrer-when-downgrade"
                                    :src="`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${form.client.geoLocation.lat},${form.client.geoLocation.lng}&zoom=18&maptype=satellite`"
                                >
                                </iframe>
                            </div> -->
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
<style scoped> 
    .mapouter{position:relative;text-align:right;width:600px;height:400px;}
    .gmap_canvas {overflow:hidden;background:none!important;width:600px;height:400px;}
    .gmap_iframe {width:600px!important;height:400px!important;}
</style>
<script>
import jsonMisc from '../../context-data/misc.json'
import jsonBranch from '../../context-data/branches.json'
import { Geolocation } from '@capacitor/geolocation'
import { Preferences } from '@capacitor/preferences';

// GOOGLE API KEY: AIzaSyCrQ2gSBwhbFsnj8JSYxCnTkXrb1ZJbmjw
export default {
    name: "ClientAdd",
    data() {
        return {
            map: false,
            apiKey: 'AIzaSyCrQ2gSBwhbFsnj8JSYxCnTkXrb1ZJbmjw',
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
                    label: el.branchName,
                    branch: el.branchName,
                    code: el.branchCode
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
    mounted(){
        this.initMap()
    },
    methods: {
        async initMap(){
            
            
            // const coordinates = await Geolocation.getCurrentPosition();
            const vm = this;
            // console.log(mapRef)

            // const newMap = await GoogleMap.create({
            //     id: 'my-map', // Unique identifier for this map instance
            //     element: mapRef, // reference to the capacitor-google-map element
            //     apiKey: vm.apiKey, // Your Google Maps API Key
            //     config: {
            //         center: {
            //         // The initial position to be rendered by the map
            //         lat: coordinates.coords.latitude,
            //         lng: coordinates.coords.longitude,
            //         },
            //         zoom: 8, // The initial zoom level to be rendered by the map
            //     },
            // });
            Geolocation.getCurrentPosition().then(newPosition => {
                let coordinates = newPosition.coords
                vm.form.client.geoLocation  = {
                    lat: coordinates.latitude,
                    lng: coordinates.longitude
                }
                vm.map = true
            })

        },
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        async addClient(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null && value.length !== 0 ? JSON.parse(value) : []

            let frm = this.form
            frm.client.branch = frm.client.regionId.branch
            frm.client.regionId = frm.client.regionId.value
            frm.client.categoryId = frm.client.categoryId.value

            // jsonClient.list.push(frm)
            // this.$emit('addClientData', frm);
            data.push(frm)
            
            await Preferences.set({
                key: 'clientList',
                value: JSON.stringify(data)
            }).then(() => {
                this.clearForm();
                this.$emit('updateStatus', false);
            })
            
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