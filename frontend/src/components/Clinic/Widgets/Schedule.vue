<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <!-- <div class="col col-md-6 q-pa-sm">
                <q-card class="my-card" flat bordered>
                    <q-card-section>

                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                Current Schedule or appointment
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-form
                            ref="formDetails"
                            class="row"
                        >
                            <div class="col col-md-12 q-pa-sm">
                                
                            </div>
                        </q-form>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn flat color="primary">
                            Submit Checkup Details
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-6 q-pa-sm">
                <q-card class="my-card" flat bordered>

                    <q-card-section class="q-pt-none">
                        
                    </q-card-section>
                </q-card>
            </div> -->
            <div class="col col-md-12 q-mt-md">
                <!-- <q-date
                    v-model="form.scheduleDate"
                    landscape
                    :options="optionsFn"
                /> -->
                <q-splitter
                    v-model="splitterModel"
                    style="height: 450px"
                >

                    <template v-slot:before>
                        <div class="q-pa-md">
                        <q-date
                            v-model="form.scheduleDate"
                            landscape
                            :options="optionsFn"
                        />
                        </div>
                    </template>

                    <template v-slot:after>
                        <q-tab-panels
                        v-model="date"
                        animated
                        transition-prev="jump-up"
                        transition-next="jump-up"
                        >
                        <q-tab-panel name="2019/02/01">
                            <div class="text-h4 q-mb-md">2019/02/01</div>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        </q-tab-panel>

                        <q-tab-panel name="2019/02/05">
                            <div class="text-h4 q-mb-md">2019/02/05</div>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        </q-tab-panel>

                        <q-tab-panel name="2019/02/06">
                            <div class="text-h4 q-mb-md">2019/02/06</div>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        </q-tab-panel>
                        </q-tab-panels>
                    </template>
                </q-splitter>
            </div>
            <div class="col col-md-12 q-mt-md">
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
            splitterModel: 45,
            form: {
                patientId: '',
                clientId: '',
                scheduleDate: moment().add(1, 'd').format('YYYY/MM/DD'),
                checkupForm: '',
                vaccineForm: '',
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
