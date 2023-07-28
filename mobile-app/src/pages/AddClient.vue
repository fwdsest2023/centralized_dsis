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
                        label="Add"
                        size="sm"
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
                            <div id="map" style="width:100%; height: 200px;">
                                <!-- <iframe
                                    width="100%"
                                    height="250"
                                    frameborder="0" 
                                    style="border:0"
                                    referrerpolicy="no-referrer-when-downgrade"
                                    :src="`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${form.client.geoLocation.lat},${form.client.geoLocation.lng}&zoom=18&maptype=satellite`"
                                >
                                </iframe> -->
                            </div>
                        </q-form>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'


export default {
  name: 'AddClient',
  data(){
    return {
      userProfile: {},
      tab: 'client'
    }
  },
  computed: {
    getUserProfile: function(){
      let profile = SessionStorage.getItem('userDataLogin');
      this.userProfile = jwt_decode(profile);
    }
  },
  created(){
    this.getUserProfile
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
</style>