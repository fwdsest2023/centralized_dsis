<template>
    <div class="" style="width: 100%;">
        <div class="row">
            <div class="col-12">
                <div class="fit row wrap justify-start items-center content-center">
                    <q-btn
                        flat
                        color="negative" 
                        unelevated
                        @click="getBackDashboard"
                        icon="backspace"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
                </div>
            </div>
            <div class="col-12 q-mt-lg">
                <div class="fit row wrap justify-start items-center content-center">
                    <span class="text-h6">ACTIVITY LIST</span>
                    <q-space />
                    <q-btn
                        @click="addClient = true"
                        size="sm"
                        color="positive" 
                        text-color="white" 
                        unelevated
                        icon-right="analytics"
                        label="ADD ACTIVITY"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
                </div>
            </div>
            <div class="col-12">
                <div class="fit row wrap justify-start items-center content-center">
                    <q-btn 
                        flat 
                        round 
                        color="primary" 
                        icon="west"
                        @click="backToYesterday"
                    />

                    <q-space />
                    <div class="text-center text-bold">
                        {{dayToday}}, {{dateToday}}
                    </div>
                    <q-space />

                    <q-btn 
                        flat 
                        round 
                        color="primary" 
                        icon="east"
                        @click="goToTommorrow"
                    />
                </div>
            </div>
            <div class="col-12 q-mt-md">
                <q-separator />
            </div>
            <div class="col-12">
                <q-list>
                    <q-item v-for="contact in contacts" :key="contact.id" class="q-my-sm" clickable v-ripple>
                        <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                            {{ contact.letter }}
                        </q-avatar>
                        </q-item-section>

                        <q-item-section>
                        <q-item-label>{{ contact.name }}</q-item-label>
                        <q-item-label caption lines="1">{{ contact.details }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

        </div>

        <q-drawer 
            show-if-above 
            v-model="addClient" 
            side="left" 
            bordered
            persistent
        >
            <div class="row">

                <div class="col-12 q-pa-md">
                    <div class="fit row wrap justify-start items-center content-center">
                        <span class="text-h6">Activity Information</span>
                        <q-space />
                        <q-btn
                            @click="addClient = false"
                            size="sm"
                            color="negative" 
                            text-color="white" 
                            unelevated
                            icon="close"
                        />
                    </div>
                </div>

                <div class="col-12">
                    <q-separator />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        outlined
                        dense
                        v-model="form.activityType"
                        label="Type of Activity"
                    />
                </div>
                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        type="date"
                        outlined
                        dense
                        v-model="form.schedule"
                        label="Date of Activity"
                    />
                </div>
                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        outlined
                        dense
                        v-model="form.title"
                        label="Event Title"
                    />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        type="textarea"
                        outlined
                        dense
                        v-model="form.content"
                        label="Activity Description"
                    />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        outlined
                        dense
                        v-model="form.timeDuration"
                        label="Duration"
                        hint="e.g. 1 hour, 2 hours, 3 hours"
                    />
                </div>

                <div class="col-12 q-mt-md">
                    <q-separator />
                </div>

                <div class="col-12 q-mt-md q-pl-md q-pr-md">
                    <q-btn
                        color="positive" 
                        text-color="white" 
                        unelevated
                        class="full-width"
                        label="Submit Information"
                        @click="addNewClient"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
                </div>

                

            </div>
            
        </q-drawer>
    </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'
import moment from 'moment'

export default{
    name: 'Dashboard',
    components: {},
    data(){
        return {
            addClient: false,
            form: {
                activityType: '',
                title: '',
                content: '',
                timeDuration: '',
                schedule: moment().format('YYYY-MM-DD'),
            },
            selectedModalData: {},
            contacts: [],
            dateToday: moment().format('MMMM D YYYY'),
            dayToday: moment().format('dddd'),
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
    },
    created(){
      this.getLists()
    },
    methods: {
        moment,
        async goToTommorrow(){
            let tom = moment(this.dateToday).add(1, 'days').startOf('day').format('MMMM D YYYY').toString();
            this.dateToday = tom
            this.dayToday = moment(tom).format('dddd')
            this.getLists()
         },
        async backToYesterday(){
            let yesterday = moment(this.dateToday).subtract(1, 'days').startOf('day').format('MMMM D YYYY').toString();
            this.dateToday = yesterday
            this.dayToday = moment(yesterday).format('dddd')
            this.getLists()
        },
        getBackDashboard(){
            this.$router.push({name: 'distributionDashboard'})
        },
        getLists(){
            this.$q.loading.show();
            api.post('distribution/activity/list', {
                userId: this.user.userId,
                schedule: moment(this.dateToday).format('YYYY-MM-DD')
            }).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    let list = data.list;
                    this.contacts = list.map((item) => {
                        return {
                            id: item.id,
                            name: item.title,
                            details: item.content,
                            letter: item.title.charAt(0).toUpperCase()
                        }
                    })
                    // {
                    //     id: 4,
                    //     name: 'Seka Fawdrey',
                    //     email: 'sfawdrey3@wired.com',
                    //     letter: 'S'
                    // }
                } 
            })

            this.$q.loading.hide();
        },
        addNewClient(){
            this.$q.dialog({
                title: 'Create New Client',
                message: 'Would you like to add this client?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                this.$q.loading.show();

                let payload = {
                    ...this.form,
                    userId: this.user.userId
                }

                api.post('distribution/add/activity', payload).then((response) => {
                    const data = {...response.data};
                    if(!data.error){
                       this.addClient = false
                       this.resetForm()
                       this.getLists();
                    } else {
                        this.$q.notify({
                            color: 'negative',
                            position: 'top',
                            message: data.message
                        })
                    }
                })
                this.$q.loading.hide();
                
            })
           
        },
        resetForm(){
            this.form = {
                storeName: '',
                ownerName: '',
                address: '',
                contact: '',
                businessPermit: '',
                idPicture: '',
                storePicture: '',
            }
        }
    }
}
</script>


<style scoped>
.custom-item-border{
    border-radius: 15px;
}
.generatedIconDash{
  background: rgb(0,177,250);
  background: linear-gradient(148deg, rgb(0 61 250) 0%, rgb(241 48 48) 98%);
}
.my-card{
    border-radius: 15px;
    box-shadow: 0px 0px 3px -2px !important;
}
.my-card-item{
    border-radius: 10px;
}
</style>