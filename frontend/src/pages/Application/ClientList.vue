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
                    <span class="text-h6">CLIENT LIST</span>
                    <q-space />
                    <q-btn
                        @click="addClient = true"
                        size="sm"
                        color="positive" 
                        text-color="white" 
                        unelevated
                        icon-right="add_business"
                        label="ADD CLIENT"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
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
                        <span class="text-h6">Client Information</span>
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
                        v-model="form.storeName"
                        label="Store Name"
                    />
                </div>
                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        outlined
                        dense
                        v-model="form.ownerName"
                        label="Owner's Name"
                    />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        type="textarea"
                        outlined
                        dense
                        v-model="form.address"
                        label="Address"
                    />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    <q-input
                        outlined
                        dense
                        v-model="form.contact"
                        label="Contact No."
                    />
                </div>

                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    Business Permit
                    <q-file disable outlined dense v-model="form.businessPermit">
                        <template v-slot:prepend>
                            <q-icon name="attach_file" />
                        </template>
                    </q-file>
                </div>
                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    ID Picture
                    <q-file disable outlined dense v-model="form.idPicture">
                        <template v-slot:prepend>
                            <q-icon name="attach_file" />
                        </template>
                    </q-file>
                </div>
                <div class="col-12 q-mt-sm q-pl-md q-pr-md">
                    Store Picture
                    <q-file disable outlined dense v-model="form.storePicture">
                        <template v-slot:prepend>
                            <q-icon name="attach_file" />
                        </template>
                    </q-file>
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
                storeName: '',
                ownerName: '',
                address: '',
                contact: '',
                businessPermit: '',
                idPicture: '',
                storePicture: '',
            },
            selectedModalData: {},
            contacts: [],
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
        getBackDashboard(){
            this.$router.push({name: 'distributionDashboard'})
        },
        getLists(){
            this.$q.loading.show();
            api.post('distribution/getAllClients').then((response) => {
                const data = {...response.data};
                if(!data.error){
                    console.log(data)
                    let list = data.list;
                    this.contacts = list.map((item) => {
                        return {
                            id: item.id,
                            name: item.storeName,
                            details: item.address,
                            letter: item.storeName.charAt(0).toUpperCase()
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
                    createdBy: this.user.userId
                }

                api.post('distribution/addClient', payload).then((response) => {
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