<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col col-md-3">
                <q-card class="my-card" flat bordered>
                    <q-card-section>

                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                Checkup Form
                            </div>
                        </div>

                        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
                    </q-card-section>

                    <q-card-section class="q-pt-none">
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
                                    v-model="form.temperature" 
                                    label="Temperature" 
                                    stack-label 
                                    dense
                                >
                                    <template v-slot:after>
                                        <q-icon name="thermostat" size="md" />
                                    </template>
                                </q-input>
                            </div>
                            <div class="col col-md-12 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="form.complain" 
                                    label="complain" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div class="col col-md-12 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="form.history" 
                                    label="history" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div class="col col-md-12 q-pa-sm">
                                <q-input
                                    outlined 
                                    v-model="form.treatment" 
                                    label="treatment" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div class="col col-md-12 q-pa-sm">
                                <q-input
                                    type="textarea"
                                    outlined 
                                    v-model="form.diagnosis" 
                                    label="diagnosis" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div class="col col-md-12 q-pa-sm">
                                <q-input
                                    type="textarea"
                                    outlined 
                                    v-model="form.remarks" 
                                    label="remarks" 
                                    stack-label 
                                    dense
                                />
                            </div>
                        </q-form>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn @click="submitForm" flat color="primary">
                            Submit Checkup Details
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-9 q-pl-md">
                <q-table
                    :rows="tableRow"
                    :filter="filter"
                    :columns="tableColumns"
                    row-key="key"
                    separator="cell"
                >
                    <template v-slot:top-left>
                        <span class="text-h6">Checkup History</span>
                    </template>
                    <template v-slot:top-right>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:header="props">
                        <q-tr :props="props">
                            <q-th auto-width />
                            <q-th
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                {{ col.label }}
                            </q-th>
                        </q-tr>
                    </template>
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td auto-width>
                                <q-btn 
                                    size="sm" 
                                    :color="props.expand ? 'negative' : 'primary'"
                                    round 
                                    dense 
                                    @click="props.expand = !props.expand" 
                                    :icon="props.expand ? 'cancel' : 'display_settings'"
                                />
                            </q-td>
                            <q-td
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                            >
                                {{ col.value }}
                            </q-td>
                        </q-tr>

                        <q-tr v-if="props.expand" :props="props">
                            <q-td colspan="100%">
                                <!-- Content for other details -->
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import jwt_decode from 'jwt-decode'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export default {
    name: 'CheckUpDetails',
    props: {
        petId: {
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            tableRow: [],
            filter: '',
            form: {
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
    },
    computed:{
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        tableColumns: function(){
            return [
                {
                    name: 'createdDate',
                    required: true,
                    label: 'Checkup Date',
                    align: 'left',
                    field: row => row.createdDate,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'complain',
                    required: true,
                    label: 'Complain',
                    align: 'left',
                    field: row => row.complain,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'diagnosis',
                    required: true,
                    label: 'Diagnosis',
                    align: 'left',
                    field: row => row.diagnosis,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'treatment', label: 'Treatment', field: 'treatment', align: 'left' },
                { name: 'action', label: '', field: 'action', align: 'left' },
            ]
        }
    },
    created(){
        this.getList();
    },
    methods: {
        moment,
        async getList(){
            this.tableRow = [];
            this.isLoading = true;
            let payload = {
                pid: this.petId
            }

            api.post('patient/get/checkup', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.tableRow = response.status < 300 ? data.list : [];
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
                patientId: this.petId,
                createdBy: this.user.userId,
            }

            api.post('patient/add/checkup', payload).then((response) => {
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
                    this.getList()
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
    }
}
</script>
