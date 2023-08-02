<template>
    <div class="q-pa-sm">
        <q-list v-if="!showClient"  padding >
            <q-item
                v-for="(item, index) in settingList" 
                :key="index"
            >
                <q-item-section avatar top>
                    <q-avatar v-bind="item.avatar" />
                </q-item-section>

                <q-item-section>
                <q-item-label lines="1">{{ item.label }}</q-item-label>
                <q-item-label caption>{{item.caption}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn 
                        flat 
                        round
                        size="lg"
                        :loading="item.loading"
                        @click="item.action"
                        :color="item.sides.color" 
                        :icon="item.sides.icon" 
                    />
                    <!-- <q-icon :name="item.sides.icon" :color="item.sides.color" /> -->
                </q-item-section>
            </q-item>
        </q-list>
        <clientWidget 
            v-if="showClient" 
            :transType="transType"
            @closeClient="closeAllClients"
        />
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import jwt_decode from 'jwt-decode'
import clientWidget from './client-widget.vue'

export default {
    name: "AgentBoard",
    components: {
        clientWidget
    },
    data() {
        return {
            tab: 'mails',
            splitterModel: 25,
            expanded: false,
            showClient: false,
            transType: 'Client Visit',
            settingList: [
                {
                    avatar: {
                        icon: 'tour',
                        color: 'primary',
                        textColor: 'white'
                    },
                    label: 'Client Visit',
                    caption: 'No transaction call',
                    sides:{
                        icon: 'queue_play_next',
                        color: 'warning'
                    },
                    loading: false,
                    action: () => {return this.showAllClients('Client Visit')}
                },
                {
                    avatar: {
                        icon: 'bookmark_added',
                        color: 'positive',
                        textColor: 'white'
                    },
                    label: 'Booking',
                    caption: 'Agent call with transaction and booking of products',
                    sides:{
                        icon: 'queue_play_next',
                        color: 'warning'
                    },
                    loading: false,
                    action: () => {return this.showAllClients('Client Booking')}
                }
            ]
        }
    },
    computed:{
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
    },
    methods: {
        moment,
        showAllClients(type){
            this.transType = type
            this.showClient = true
        },
        closeAllClients(){
            this.transType = 'Client Visit'
            this.showClient = false
        },
        
    }
}
</script>
