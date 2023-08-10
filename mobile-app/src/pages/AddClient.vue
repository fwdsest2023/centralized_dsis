<template>
  <q-page >
    <q-card class="my-card" flat >
      <q-img src="imgs/home_background.jpg" />

      <q-card-section class="q-mb-lg">
        <q-card 
            class="absolute card-overlap"
            flat 
            rounded
            bordered
        >
            <q-card-section>
                <q-toolbar>
                    <div class="text-h6">Client Information</div>
                    <q-space />
                    <q-btn
                        @click="addClient"
                        color="primary"
                        label="Submit"
                        size="md"
                    />
                    
                </q-toolbar>
            </q-card-section>
        </q-card>
      </q-card-section>


      <q-separator />



      <q-card-actions>
        <q-form
            ref="formDetails"
            class="row"
        >
          <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-lg">
              <span class="text-h6">STORE DETAILS</span>
          </div>
            <q-input 
                class="col col-xs-12 col-md-6 q-pa-sm" 
                bottom-slots
                v-model="form.client.storeName"
                label="Store Name *" 
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

            
            <q-input
                class="col col-xs-12 col-md-12 col-sm-12  q-pa-sm q-mt-sm"
                dense
                v-model="form.client.contactPerson.name"
                label="Store Owner/Representantive *"
                :rules="[ val => val && val.length > 0 || 'This field is required']"
            />
            <q-input
                class="col col-xs-12 col-md-12 col-sm-12  q-pa-sm q-mt-sm"
                dense
                v-model="form.client.contactPerson.contactNum"
                mask="(####) ### - ####"
                label="Contact Number *"
                placeholder="(09#) ### - ####"
                :rules="[val => val && val.length > 0 || 'This field is required']"
            />
            <q-select
                class="col col-xs-12 col-md-12 q-pa-sm"
                bottom-slots
                v-model="form.client.categoryId" 
                :options="categoryList" 
                label="Category *"
                dense 
                :options-dense="true"
            >
            </q-select>

            <q-select
              v-if="userProfile.userType === '1'"
              class="col col-xs-12 col-md-12 q-pa-sm"
              bottom-slots
              v-model="form.client.adminAssigned" 
              :options="agentList" 
              label="Assinged Agent *"
              dense 
              :options-dense="true"
            >
            </q-select>
            
            <q-separator />
            <div class="text-h6">Address Details</div>
            <q-input
                class="col col-xs-12 col-md-12 col-sm-12  q-pa-sm q-mt-sm"
                dense
                v-model="form.client.address"
                label="Address Line 1 (House No/ST/Sub Division/etc..) *"
                :rules="[val => val && val.length > 0 || 'This field is required']"
            />

            <q-select
              class="col col-xs-12 col-md-12 q-pa-sm"
              bottom-slots
              v-model="form.client.addressDetails.region" 
              :options="regionList" 
              label="Region *"
              dense 
              :options-dense="true"
              @update:model-value="regionChanged"
            >
            </q-select>

            <q-select
              class="col col-xs-12 col-md-12 q-pa-sm"
              bottom-slots
              v-model="form.client.addressDetails.province" 
              :options="provinceList" 
              label="Province *"
              dense 
              :options-dense="true"
              @update:model-value="provinceChanged"
            >
            </q-select>

            <q-select
              class="col col-xs-12 col-md-12 q-pa-sm"
              bottom-slots
              v-model="form.client.addressDetails.city" 
              :options="cityList" 
              label="City *"
              dense 
              :options-dense="true"
              @update:model-value="cityChange"
            >
            </q-select>

            <q-select
              class="col col-xs-12 col-md-12 q-pa-sm"
              bottom-slots
              v-model="form.client.addressDetails.barangay" 
              :options="brgyList" 
              label="Baranagay *"
              dense 
              :options-dense="true"
            >
            </q-select>

            

            <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-lg">
              <q-toolbar>
                  <span class="text-h6">STORE MAP</span>
                  <q-space />
                  <q-btn
                      @click="initMap"
                      color="primary"
                      label="Pin Location"
                      size="md"
                  />
              </q-toolbar>
            </div>
            <div id="map" style="width:100%; height: 200px;"></div>
        </q-form>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import {regions, provinces, cities, barangays} from 'select-philippines-address';
import jsonMisc from '../context-data/misc.json'
import addressesJson from '../context-data/addresses.json'
import { SessionStorage } from 'quasar'
import { Geolocation } from '@capacitor/geolocation'
import { Loader } from "@googlemaps/js-api-loader"
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

const loader = new Loader({
    apiKey: 'AIzaSyCrQ2gSBwhbFsnj8JSYxCnTkXrb1ZJbmjw',
    version: "weekly",
    libraries: ["places"]
});

export default {
  name: 'AddClient',
  data(){
    return {
      isOnline: true,
      userProfile: {},
      tab: 'client',
      agentList: [],
      regionList: [],
      provinceList: [],
      cityList: [],
      brgyList: [],
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
              addressDetails: {
                region: "",
                province: "",
                city: "",
                barangay: "",
              },
              categoryId: null,
              geoLocation: {
                lat: 0,
                lng: 0,
              },
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
          isAdmin: false,
          adminAssigned: 0,
          booking:[],
          remarks: [],
          files: ""
      }
    }
  },
  computed: {
    getUserProfile: function(){
      let profile = SessionStorage.getItem('userDataLogin');
      this.userProfile = jwt_decode(profile);
    },
    categoryList: function(){
      let list = jsonMisc.category;
      let res = list.map((el) => {
          let opt = {
              id: el.id,
              value: el.catName,
              label: el.catName,
              desc: el.catDesc
          }

          return opt
      });

      return res
    },
  },
  mounted(){
      const vm = this;
      Network.addListener('networkStatusChange', status => {
        vm.isOnline = status.connected
        vm.loadRegion()
      });
  },
  created(){
    this.getUserProfile
    this.loadRegion()
    this.loadAgents()
  },
  methods:{
    loadAgents(){
      if(this.userProfile.userType === "1"){
        this.form.client.isAdmin = true
        api.get('users/getAgents')
        .then((response) => {
            if(response.status <= 200){
              let list = response.data.list;
              this.agentList = list.map((el) => {
                let obj = {
                  label: el.name,
                  value: el.key
                }

                return obj
              })
            } else {
                this.$q.dialog({
                  title: 'Fetch Failed',
                  message: 'Something went wrong. Please contact your administrator',
                  position: 'top'
                })
            }
            
        }).catch((err) => {
            alert(JSON.stringify(err))
            this.settingList[0].loading = false
        })
      }
    },
    loadRegion(){
      if(this.isOnline){
        regions().then((region) =>{
          let res = region.map((el, _index) => {
            let obj = {
              label: el.region_name,
              value: el.region_code
            }

            return obj
          })
          this.regionList = res;
        })
      } else {
        const regionsList = addressesJson.region;
        this.regionList = regionsList.map((el, _index) => {
          let obj = {
            label: el.region_name,
            value: el.region_code
          }

          return obj
        })
      }
    },
    async addClient(){
        const { value } = await Preferences.get({ key: 'clientList' });
        let data = value !== null && value.length !== 0 ? JSON.parse(value) : []
        let frm = this.form

        // validate
        let compoDetails = this.$refs.formDetails;
        compoDetails.validate().then(async (success) => {
          if(!success){
            this.$q.dialog({
              title: 'Error Adding Client',
              message: 'All Fields is require!',
              position: 'top',
              color: 'red'
            })
          } else{
            frm.client.branch = frm.client.addressDetails.region.label
            frm.client.categoryId = frm.client.categoryId.id

            // Check if the transaction network is offline or Online
            data.push(frm)

            await Preferences.set({
                key: 'clientList',
                value: JSON.stringify(data)
            }).then(() => {
              this.clearForm();
            })
          }
        })
        
    },
    async clearForm(){
      this.form = {
        client: {
            storeName: "",
            address: "",
            branch: "",
            addressDetails: {
              region: "",
              province: "",
              city: "",
              barangay: "",
            },
            categoryId: null,
            geoLocation: {
              lat: 0,
              lng: 0,
            },
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
    },
    regionChanged(val){
      if(this.isOnline){
        provinces(val.value).then((province) => {
          let res = province.map((el, _index) => {
            let obj = {
              label: el.province_name,
              value: el.province_code
            }

            return obj
          })
          this.provinceList = res
        });
      } else {
        const provList = addressesJson.province
        let filterProv = provList.filter(el => {return el.region_code === val.value})
        this.provinceList = filterProv.map((el, _index) => {
          let obj = {
            label: el.province_name,
            value: el.province_code
          }

          return obj
        })
      }
    },
    provinceChanged(val){
      if(this.isOnline){
        cities(val.value).then((city) => {
          let res = city.map((el, _index) => {
            let obj = {
              label: el.city_name,
              value: el.city_code
            }

            return obj
          })
          this.cityList = res
        });
      } else {
        const cityList = addressesJson.city
        let filterCity = cityList.filter(el => {return el.province_code === val.value})
        this.cityList = filterCity.map((el, _index) => {
          let obj = {
            label: el.city_name,
            value: el.city_code
          }

          return obj
        })
      }

    },
    cityChange(val){
      if(this.isOnline){
        barangays(val.value).then((barangay) => {
          let res = barangay.map((el, _index) => {
            let obj = {
              label: el.brgy_name,
              value: el.brgy_code
            }

            return obj
          })
          this.brgyList = res
        });
      } else {
        const brgyList = addressesJson.barangay
        let filterCity = brgyList.filter(el => {return el.city_code === val.value})
        this.brgyList = filterCity.map((el, _index) => {
          let obj = {
            label: el.brgy_name,
            value: el.brgy_code
          }

          return obj
        })
      }
    },
    initMap(){
        loader
        .load()
        .then(async (google) => {
            let coordinates = {};
            const perm = await Geolocation.checkPermissions()
            if(perm.location !== 'granted' || perm.coarseLocation !== 'granted'){
                const reqPerm = await Geolocation.requestPermissions();
                if(reqPerm.location === 'granted' || reqPerm.coarseLocation === 'granted'){
                    coordinates = await Geolocation.getCurrentPosition();
                } else {
                    return false
                }
            } else {
                coordinates = await Geolocation.getCurrentPosition();
            }
            // const coordinates = await Geolocation.getCurrentPosition();
            // Setting the geoTag
            let frm = this.form;

            frm.client.geoLocation.lat = coordinates.coords.latitude
            frm.client.geoLocation.lng = coordinates.coords.longitude


            // Loading the maps
            await this.$nextTick(() => {
                const mstore = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: mstore,
                    zoom: 17,
                });
                const coordInfoWindow = new google.maps.InfoWindow();

                coordInfoWindow.setContent(this.createInfoWindowContent());
                coordInfoWindow.setPosition(mstore);
                coordInfoWindow.open(map);
                // map.addListener("zoom_changed", () => {
                //     coordInfoWindow.setContent(this.createInfoWindowContent());
                //     coordInfoWindow.open(map);
                // });

                // Store Marker
                const marker = new google.maps.Marker({
                    map,
                    position: {lat: coordinates.coords.latitude, lng: coordinates.coords.longitude},
                });
            
                marker.addListener('click', ({domEvent, latLng}) => {
                  coordInfoWindow.setContent(this.createInfoWindowContent());
                });
            })
        })
        .catch((e) => {
            // do something
            console.log(e)
        });

    },

    createInfoWindowContent() {
      let brgy = this.form.client.addressDetails.barangay.label;
      let city = this.form.client.addressDetails.city.label;
      let prov = this.form.client.addressDetails.province.label;
      let address = `${this.form.client.address}, ${brgy}, ${city}, ${prov}`;
      return [
          this.form.client.storeName,
          "Address: " + address
      ].join("<br>");
    },
  }
}
</script>
<style scoped>
.my-card{
  margin-top: -20px;
}
.card-overlap{
    width: 92%; 
    top: 0; 
    transform: translateY(-50%); 
    border-radius: 15px;
}
.mapouter{position:relative;text-align:right;width:600px;height:400px;}
.gmap_canvas {overflow:hidden;background:none!important;width:600px;height:400px;}
.gmap_iframe {width:600px!important;height:400px!important;}
</style>