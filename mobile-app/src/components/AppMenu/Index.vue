<template>
    <div class="q-pa-sm">
        <q-list bordered padding class="rounded-borders">
            <q-item v-for="(item, index) in filteredSettings" :key="index">
                <q-item-section avatar top>
                    <q-avatar v-bind="item.avatar" />
                </q-item-section>

                <q-item-section>
                <q-item-label lines="1">{{ item.label }} <q-badge rounded size :color="item.notSync ? 'red' : 'green' " /></q-item-label>
                <q-item-label caption>{{item.caption}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn 
                        flat 
                        round
                        :loading="item.loading"
                        @click="syndDataToDev"
                        :disabled="!item.notSync"
                        :color="item.sides.color" 
                        :icon="item.sides.icon" 
                    />
                    <!-- <q-icon :name="item.sides.icon" :color="item.sides.color" /> -->
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default {
    name: "SettingPAge",
    data() {
        return {
            tab: 'mails',
            splitterModel: 25,
            expanded: false,
            settingSearch: '',
            settingList: [
                {
                    avatar: {
                        icon: 'sync',
                        color: 'primary',
                        textColor: 'white'
                    },
                    label: 'Sync Data',
                    caption: 'Sync your data to create your record for today.',
                    sides:{
                        icon: 'cloud_sync',
                        color: 'grey'
                    },
                    notSync: true,
                    loading: false
                }
            ]
        }
    },
    computed:{
        filteredSettings: function(){
            return this.settingList.filter(search => {
                return search.label.toLowerCase().includes(this.settingSearch.toLowerCase())
            })
        },
        // checkUnsyncData: function(){
        //     let data = LocalStorage.getItem('clientList');
        //     let filtered = data.filter(el => el.client.status === 'finish')
        //     let check = filtered.length === 0;
        //     this.settingList[0].notSync = !check
        //     this.settingList[0].sides = !check ? {
        //         icon: 'cloud_sync',
        //         color: 'blue'
        //     } : {
        //         icon: 'cloud_sync',
        //         color: 'grey'
        //     }
        // },
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        clData: function(){
            let list = LocalStorage.getItem('clientList');
            let filtered = list.filter(el => el.client.status === 'finish')
            return filtered;
        }
    },
    created(){
        this.checkUnsyncData()
    },
    methods: {
        moment,
        checkUnsyncData(){
            let data = LocalStorage.getItem('clientList');
            let filtered = data.filter(el => el.client.status === 'finish')
            let check = filtered.length === 0;
            this.settingList[0].notSync = !check
            this.settingList[0].sides = !check ? {
                icon: 'cloud_sync',
                color: 'blue'
            } : {
                icon: 'cloud_sync',
                color: 'grey'
            }
        },
        syndDataToDev(){
            // Collection of data
            let payload = {
                agentId: Number(this.user.userId),
                category: "CLIENT",
                listData: this.clData
            }

            // return
            // Loading part
            this.settingList[0].loading = true
            
            // Call Sync API
            api.post('mobile/sync/data', payload).then((response) => {
                if(response.status <= 200){
                    this.$q.dialog({
                        title: response.data.title,
                        message: response.data.message,
                        position: 'top'
                    })
                    this.clearFinishData()
                    this.settingList[0].loading = false
                } else {
                    this.$q.dialog({
                        title: 'Sync Failed',
                        message: 'Something went wrong.',
                        position: 'top'
                    })
                }
                
            })
        },

        async clearFinishData(){
            let list = LocalStorage.getItem('clientList');
            list.map((el) => {
                el.client.status = 'pending'
                el.client.icon = 'play_circle'
                el.client.color = 'green'
                el.files = ''
                el.booking = []
                el.remarks = []
                el.attendance = {
                    startCall: "",
                    endCall: "",
                    geoLocation: {
                        timeIn:"",
                        timeOut:"",
                        coorIn: {},
                        coorOut: {}
                    }
                }
                return el
            });

            LocalStorage.set('clientList', list);

            this.$nextTick(() => {
                this.checkUnsyncData()
            })
            
        }
    }
}
</script>
