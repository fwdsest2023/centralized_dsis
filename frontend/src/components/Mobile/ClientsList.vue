<template>
    <div>
        <div v-if="!isContinueEdit" class="q-pa-md" style="width: 100%;">
            <div class="row">
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
                    <q-splitter
                        v-model="splitterModel"
                        style="height: 80dvh"
                    >

                        <template v-slot:before>
                            <div class="q-pa-md">
                            <div class="text-h4 q-mb-md">Clients</div>
                                <q-list>
                                    <q-item v-for="(item, idx) in tableRow" :key="idx" clickable v-ripple>
                                        <q-item-section avatar>
                                        <q-icon color="primary" name="location_on" />
                                        </q-item-section>

                                        <q-item-section>{{ item.storeName }}</q-item-section>
                                    </q-item>
                            </q-list>
                            </div>
                        </template>

                        <template v-slot:after>
                            <div class="q-pa-md">
                            <div class="text-h4 q-mb-md">Locations</div>
                                <div id="map" style="width:100%; height: 70dvh; border:1px solid black;"></div>
                            </div>
                        </template>

                    </q-splitter>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { LocalStorage, SessionStorage } from 'quasar'
import noData from '../Templates/NoData.vue';
import { Loader } from "@googlemaps/js-api-loader"
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

const loader = new Loader({
    apiKey: process.env.GMAPS_API_KEY,
    version: "weekly",
    libraries: ["places"]
});

export default {
    name: 'ProductList',
    data(){
        return {
            splitterModel: 20,
            isContinueEdit: false,
            isPwd: true,
            isLoading: false,
            submitting: false,
            tableRow: [],
            filter: '',
            saveDetails: null,
            saveId: null,
            insertedID: null,
            openBookModal: false,
            bookList: [],
            appId: 0,

            agentList: [],
            agentId: '',
            syncDate: moment().format('yyyy-MM-DD'),
            imgSrc: '',
        }
    },
    components: {
        noData
    },
    created(){
        this.getList()
    },
    methods: {
        moment,
        async getList(){
            this.tableRow = [];
            this.isLoading = true;

            api.get('mobile/fetch/client/list').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.tableRow = response.status < 300 ? data.list : [];
                    this.initLocations();
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
        initLocations(){
            let locations = [...this.tableRow];
            let mappedLoc = locations.map((item) => {
                return {
                    lat: item.geoLocation.latitude,
                    lng: item.geoLocation.longitude,
                    title: item.storeName
                }
            })

            console.log(mappedLoc);
            loader.load().then(() => {
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: { lat: 13.41, lng: 122.56 }, // Initial center
                    zoom: 6,
                });

                mappedLoc.forEach((location) => {
                    console.log(location);
                    const marker = new google.maps.Marker({
                        position: { lat: location.lat, lng: location.lng },
                        map: map,
                        title: location.title,
                        // label: location.title,
                    });
                    const infowindow = new google.maps.InfoWindow({
                        content: `<div style="display:inline-block;white-space:nowrap;padding:4px 8px;font-size:16px;">${location.title}</div>`,
                    });
                    marker.addListener('click', function() {
                        infowindow.open(map, marker);
                    });
                });
            });
        },
        updateClientGeoLocation(row){
            this.$q.dialog({
                title: 'Change Store Location?',
                message: 'Are you sure you want to take this action?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                let modified = {
                    "geoLocation": {}
                }

                this.updateClientData(row.key, modified)
            })
        },
        async updateClientData(id, value){
            this.tableRow = [];
            this.isLoading = true;
            let payload = {
                id: Number(id),
                modified: value
            }

            api.post('mobile/client/update', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.$q.notify({
                        color: 'success',
                        position: 'top-right',
                        title:data.title,
                        message: 'Success',
                        icon: 'check_circle'
                    })
                    this.getList()
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
        } 
        // end
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
                    name: 'storeName',
                    required: true,
                    label: 'Business Name',
                    align: 'left',
                    field: row => row.storeName,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'address',
                    required: true,
                    label: 'Address',
                    align: 'left',
                    field: row => row.address,
                    format: val => `${val}`,
                    sortable: true
                },
                // { name: 'category', label: 'Category', field: 'category', align: 'left' },
                { name: 'contactPerson', label: 'Contact Person', field: 'contactPerson', align: 'left' },
                { name: 'contactNumber', label: 'Contact Number', field: 'contactNumber', align: 'left' },
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
