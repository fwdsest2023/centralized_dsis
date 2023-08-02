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
                    <q-input
                        class="q-mt-sm"
                        bottom-slots 
                        v-model="searchClient" 
                        label="Search Client" 
                        dense
                    >
                        <template v-slot:append>
                            <q-icon v-if="searchClient !== ''" name="close" @click="searchClient = ''" class="cursor-pointer" />
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    
                    <q-space />
                    <q-btn
                        @click="addClient"
                        round 
                        color="primary" 
                        icon="filter_alt" 
                        size="md"
                    />
                    
                </q-toolbar>
            </q-card-section>
        </q-card>
        <!-- <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        /> -->

        <!-- <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            Cafe Basilico
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div> -->

        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1 text-bold">
          Call Logs
        </div>
        <div class="text-caption text-grey">
          All agent call action history
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <!-- Logs List -->
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'


export default {
  name: 'CallHistory',
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