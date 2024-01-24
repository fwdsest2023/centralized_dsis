<template>
    <div>
        <q-dialog
            v-model="openModal"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card style="width: 700px; max-width: 80vw;" >
                <q-bar class="q-mb-md">
                    <div class="text-h6">Schedule Details</div>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section style="max-height: 70vh; height: 100%;" class="q-pt-none scroll">
                    <q-form
                        ref="formDetails"
                        class="row"
                    >   
                        <div class="col col-md-12 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.weight" 
                                label="Weight" 
                                stack-label 
                                dense
                            >
                                <template v-slot:after>
                                    KG
                                </template>
                            </q-input>
                        </div>
                        <div class="col col-md-12 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.vaxName" 
                                label="Medicines" 
                                stack-label 
                                dense
                            >
                                <template v-slot:after>
                                    <q-icon name="vaccines" size="md" />
                                </template>
                            </q-input>
                        </div>
                    </q-form>  
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn
                        flat 
                        label="Submit" 
                        color="primary"
                        @click="submitForm" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import moment from 'moment';
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default {
    name: 'VaccineModal',
    data(){
        return {
            openModal: false,
            form: {
                weight: '',
                vaxName: '',
                vaxClassification: ''
            },
        }
    },
    watch:{
        modalStatus(newVal, oldVal){
            this.openModal = newVal
            this.fillTheDetails()
        }
    },
    props: {
        appDetails: {
            type: Object
        },
        modalStatus: {
            type: Boolean
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        }
    },

    methods: {
        fillTheDetails(){
            this.form = {
                weight: '',
                vaxName: this.appDetails.vaccineForm.medicine,
                vaxClassification: this.appDetails.vaccineForm.type.value
            }
        },
        async closeModal(){
            this.$emit('updateModalStatus', false);
        },

        submitForm(){
            this.$refs.formDetails.validate().then(success => {
                if(!success){
                    this.$q.notify({
                        color: 'negative',
                        position: 'top-right',
                        title: 'Incomplete Form',
                        message: 'Please fill the required fields',
                        icon: 'report_problem'
                    })
                    return false;
                } else {
                    // Confirm
                    this.$q.dialog({
                        title: 'Save Data',
                        message: 'Would you like to save your data?',
                        ok: {
                            label: 'Yes'
                        },
                        cancel: {
                            label: 'No',
                            color: 'negative'
                        },
                        persistent: true
                    }).onOk(() => {
                        this.saveOrData();
                    })
                }
            })
        },
        async saveOrData(){
            
            let vm = this;
            this.$q.loading.show({
                message: 'Your data is submitting. Please wait...'
            });
            this.btnLoading = true;

            let payload = {
                ...this.form,
                patientId: this.appDetails.patientId,
                vaxDate: this.appDetails.scheduleDate,
                vetId: this.user.userId,
            }

            api.post('patient/add/wellness', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.updateStatusSched();
                } else {
                    this.$q.notify({
                        color: 'negative',
                        position: 'top-right',
                        title:data.title,
                        message: this.$t(`errors.${data.error}`),
                        icon: 'report_problem'
                    })
                    this.$q.loading.hide();
                }

            })
            
            this.btnLoading = false;
        },
        async updateStatusSched(){
            let payload = {
                schedId: this.appDetails.id,
            }

            api.post('patient/update/schedule', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.$q.notify({
                        color: 'positive',
                        position: 'top-right',
                        title:data.title,
                        message: data.message,
                        icon: 'done'
                    })
                    this.$q.loading.hide();
                    this.$emit("refreshData")
                    this.clearForm()
                    this.closeModal()
                } else {
                    this.$q.notify({
                        color: 'negative',
                        position: 'top-right',
                        title:data.title,
                        message: this.$t(`errors.${data.error}`),
                        icon: 'report_problem'
                    })
                    this.$q.loading.hide();
                }

            })
        },
        
        clearForm(){
            this.form = {
                weight: '',
                temperature: '',
                complain: '',
                history: '',
                laboratories: '',
                treatment: '',
                diagnosis: '',
                remarks: '',
            }
        }
    }
    
}
</script>
