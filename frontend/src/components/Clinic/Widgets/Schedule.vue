<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col col-xs-12 col-sm-12 col-md-4 q-pa-sm">
                <q-date
                    style="width: 100%;"
                    v-model="form.scheduleDate"
                    landscape
                    :options="optionsFn"
                />
            </div>
            <div class="col col-xs-12 col-sm-12 col-md-8 q-pa-sm">
                <q-card class="my-card q-ma-md" flat bordered>
                    <q-card-section>
                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                Schedule Form
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-form
                            ref="formDetails"
                            class="row"
                        >
                            <div class="col col-xs-12 col-sm-12 col-md-6 q-pa-sm">
                                <q-select
                                    v-model="form.scheduleTime" 
                                    :options="timeOptions" 
                                    label="Schedule Time"
                                    dense 
                                    :options-dense="true"
                                >
                                </q-select>
                            </div>
                            <div class="col col-xs-12 col-sm-12 col-md-6 q-pa-sm">
                                <q-select
                                    v-model="form.schedType" 
                                    :options="schedTypeOptions" 
                                    label="Type of Schedule"
                                    dense 
                                    :options-dense="true"
                                >
                                </q-select>
                            </div>
                            
                            <div v-if="form.schedType.value === 'checkup'" class="col col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                                <q-input
                                    
                                    type="textarea"
                                    outlined 
                                    v-model="form.chckupForm" 
                                    label="Checkup Purpose" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div  v-if="form.schedType.value === 'vaccine'" class="col col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                                <q-select
                                    v-model="form.vaccineForm.type" 
                                    :options="vaccineTypeOptions" 
                                    label="Type of Vacine"
                                    dense 
                                    :options-dense="true"
                                >
                                </q-select>

                                <q-input
                                    class="q-mt-sm"
                                    outlined 
                                    v-model="form.vaccineForm.medicine" 
                                    label="Medicine" 
                                    stack-label 
                                    dense
                                />
                            </div>
                            <div class="col col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                                <q-input
                                    type="textarea"
                                    outlined 
                                    v-model="form.remarks" 
                                    label="Reason of Visit" 
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
            <div class="col col-xs-12 col-sm-12 col-md-12 q-pa-sm">
                <q-table
                    :rows="tableRow"
                    :filter="filter"
                    :columns="tableColumns"
                    row-key="key"
                    separator="cell"
                >
                    <template v-slot:top-left>
                        <span class="text-h6">Schedules</span>
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
                                <!-- <div v-if="col.name === 'action'">
                                    <q-btn 
                                        size="sm" 
                                        color="primary"
                                        dense
                                        label="View"
                                        @click="viewSchedule" 
                                    />
                                </div> -->
                                
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
    name: 'ScheduleDetails',
    props: {
        petId: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            tableRow: [],
            filter: '',
            splitterModel: 35,
            form: {
                patientId: '',
                clientId: '',
                scheduleDate: moment().add(1, 'd').format('YYYY/MM/DD'),
                scheduleTime: '',
                chckupForm: '',
                vaccineForm: {
                    type: '',
                    medicine: '',
                },
                schedType: '',
                createdBy: '',
                remarks: '',
            }
        }
    },
    computed:{
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        timeOptions: function(){
            let res = [];

            for (let index = 8; index < 17; index++) {
                let time = `${this.form.scheduleDate} ${index}:00`;
                let mins = moment(time).add(30, 'm').format('h:mm');
                res.push({label: moment(time).format('h:mm'), value: moment(time).format('h:mm')})
                res.push({label: mins, value: mins})
            }

            return res
        },
        schedTypeOptions: function(){
            let res = [
                { label: "Vaccine", value: "vaccine"},
                { label: "Checkup", value: "checkup"}
            ];
            return res
        },
        vaccineTypeOptions: function(){
            let res = [
                { label: "Treatment", value: "treatment"},
                { label: "Tick and Flea", value: "tickAndFlea"},
                { label: "Vaccination", value: "vaccination"},
                { label: "Deworm", value: "deworm"},
            ];
            return res
        },
        tableColumns: function(){
            return [
                {
                    name: 'scheduleDate',
                    required: true,
                    label: 'Schedule Date',
                    align: 'left',
                    field: row => row.scheduleDate,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'scheduleTime',
                    required: true,
                    label: 'Schedule Time',
                    align: 'left',
                    field: row => row.scheduleTime,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'remarks',
                    required: true,
                    label: 'Reason of Visit',
                    align: 'left',
                    field: row => row.remarks,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'schedType',
                    required: true,
                    label: 'Schedule Type',
                    align: 'left',
                    field: row => row.schedType,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'createdDate', label: 'Date Created', field: 'createdDate', align: 'left' },
                // { name: 'action', label: '', field: 'action', align: 'left' },
            ]
        }
    },
    created(){
        this.getList();
    },
    methods: {
        moment,
        viewSchedule(){},
        optionsFn (date) {
            return date > moment().format('YYYY/MM/DD')
        },
        async getList(){
            this.tableRow = [];
            this.isLoading = true;
            let payload = {
                pid: this.petId
            }

            api.post('patient/get/schedule', payload).then((response) => {
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

            this.form.scheduleTime = this.form.scheduleTime.value;
            this.form.schedType = this.form.schedType.value;
            let payload = {
                ...this.form,
                patientId: this.petId,
                createdBy: this.user.userId,
            }

            api.post('patient/add/schedule', payload).then((response) => {
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
