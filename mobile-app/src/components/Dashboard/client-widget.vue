<template>
    <div>
        <q-toolbar>

            <q-toolbar-title>Select Client</q-toolbar-title>

            <!-- <q-btn flat round dense icon="search" /> -->
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
        </q-toolbar>
        <q-list>
          <div v-for="(item, index) in filterList" :key="index">
            <q-item>
              <q-item-section>
                <q-item-label>{{item.storeName}}</q-item-label>
                <q-item-label caption lines="2">{{item.address}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{item.branch}}</q-item-label>
                <q-btn 
                    @click="item.status === 'in-progress' ? stopCall(index) : playCall(index)"
                    flat 
                    round
                    :loading="item.loading"
                    :color="item.color" 
                    :icon="item.icon" 
                    size="md" 
                />
              </q-item-section>
            </q-item>
          </div>
          
        </q-list>
    </div>
</template>
<script>
import json from '../../context-data/clients.json'

export default {
    name: "ClientWidget",
    data() {
        return {
            loadClientList: [],
            searchClient: ''
        }
    },
    computed: {
        clientList: function(){
            this.loadClientList = json.list
        },
        filterList(){
            return  this.loadClientList.filter(search => {
                return search.storeName.toLowerCase().includes(this.searchClient.toLowerCase())
            })
        },
    },
    created(){
        this.clientList
    },
    methods: {
        playCall(index){
            // check if there is still playing
            let filterCall = this.loadClientList.filter(el => el.status === "in-progress")

            if(filterCall.length === 0){
                // Executes the play call
                this.loadClientList[index].loading = true;
                this.loadClientList[index].status = "in-progress";

                setTimeout(() => {
                    this.loadClientList[index].loading = false;
                    this.loadClientList[index].icon = 'fiber_manual_record';
                    this.loadClientList[index].color = 'red';
                }, 2000)
            } else {
                this.$q.dialog({
                    title: 'Error Playing Call',
                    message: 'There is still in-progress call please complete it first before starting new call.',
                    position: 'bottom',
                    color: 'red'
                })
            }
            
        },
        stopCall(index){
            this.loadClientList[index].loading = true;
            this.loadClientList[index].status = "pending";

            setTimeout(() => {
                this.loadClientList[index].loading = false;
                this.loadClientList[index].icon = 'play_circle';
                this.loadClientList[index].color = 'green';
            }, 2000)
        }
    }
}
</script>
