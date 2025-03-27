<template>
    <div>
        <q-dialog
            class="modalIndex"
            v-model="openModal"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card style="width: 85dvw; max-width: 85dvw;" >
                <q-bar class="q-mb-md">
                    <div class="text-h6">Add New Agent</div>
                    <q-space />
                    <q-btn dense flat icon="close" @click="closeModal">
                        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                </q-bar>

                <q-card-section style="max-height: 70vh; height: 100%;" class="q-pt-none scroll q-mb-md">
                    <q-form
                        ref="formDetails"
                        class="row"
                    >
                        <div class="col col-xs-12 col-sm-12 col-md-12">
                            <span class="text-h6">ACCOUNT CREDENTIAL</span>
                        </div>
                        <q-input 
                            class="col col-xs-12 col-md-6 q-pa-sm q-mt-sm" 
                            bottom-slots
                            v-model="form.username"
                            :label="$t('form_labels.user')" 
                            :dense="true"
                            :rules="[ val => val && val.length > 0 || 'This field is required']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="account_circle" />
                            </template>
                            <template v-slot:append>
                                <q-icon name="close" @click="form.username = ''" class="cursor-pointer" />
                            </template>
                        </q-input>

                        <q-input 
                            class="col col-xs-12 col-md-6 q-pa-sm q-mt-sm" 
                            bottom-slots 
                            v-model="form.password"
                            :type="isPwd ? 'password' : 'text'"
                            :label="$t('form_labels.pass')" 
                            :dense="true"
                            :rules="[ val => val && val.length > 0 || 'This field is required']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="password" />
                            </template>
                            <template v-slot:append>
                                <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                />
                            </template>
                        </q-input>


                        <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-lg">
                            <span class="text-h6">USER DETAILS</span>
                        </div>
                        
                        <q-input
                            class="col col-xs-12 col-md-4  q-pa-sm q-mt-sm"
                            dense
                            v-model="form.firstName"
                            label="First Name *"
                            hint="Given Name and Suffix (if has)"
                            :rules="[ val => val && val.length > 0 || 'This field is required']"
                        />
                        <q-input
                            class="col col-xs-12 col-md-4  q-pa-sm q-mt-sm"
                            dense
                            v-model="form.middleName"
                            label="Middle Name"
                            hint="Optional"
                        />
                        <q-input
                            class="col col-xs-12 col-md-4 q-pa-sm q-mt-sm"
                            dense
                            v-model="form.lastName"
                            label="Last Name *"
                            hint="Family Name"
                            :rules="[ val => val && val.length > 0 || 'This field is required']"
                        />


                        <q-input
                            class="col col-xs-12 col-md-3 q-pa-sm q-mt-lg"
                            dense
                            type="number"
                            v-model="form.commission.percent"
                            label="Percentage Commission"
                        />
                        <q-input
                            class="col col-xs-12 col-md-3 q-pa-sm q-mt-lg"
                            dense
                            type="number"
                            v-model="form.commission.bag"
                            label="Per Bag Commission"
                        />
                        <q-input
                            class="col col-xs-12 col-md-3 q-pa-sm q-mt-lg"
                            dense
                            type="number"
                            v-model="form.targetSales.percent"
                            label="Monthly Target"
                        />
                        <q-input
                            class="col col-xs-12 col-md-3 q-pa-sm q-mt-lg"
                            dense
                            type="number"
                            v-model="form.targetSales.bag"
                            label="Bags Target"
                        />

                    </q-form>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn
                        flat 
                        label="Create Account" 
                        color="primary"
                        @click="addNeAgentUser" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'
import moment from 'moment'

const dateNow = moment().format('YYYY-MM-DD');

export default {
    name: 'AddAgentModal',
    components: {},
    data(){
        return {
            splitterModel: 40,
            splitterInfoModel: 20,
            openModal: false,
            openSignModal: false,
            openPrintModal: false,
            isPwd: true,
            form: {
                username: "",
                password: "",
                lastName: "",
                firstName: "",
                middleName: "",
                userType: 3,
                commission: {
                    percent: 0,
                    bag: 0,
                },
                targetSales: {
                    percent: 0,
                    bag: 0,
                },
            },
            typeOpt: ['CASH', 'CHECK'],
            checkTypeOpt: ['voucher', 'postdated'],
        }
    },
    watch:{
        modalStatus(newVal, oldVal){
            this.openModal = newVal
        }
    },
    props: {
        appData: {
            type: Object
        },
        modalStatus: {
            type: Boolean
        },
        processType: {
            type: String
        }
    },
    computed: {
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return profile;
        }
    },

    methods: {
        previewVoucher(){
            this.openPrintModal = true
        },
        closePrintModal(){
            this.openPrintModal = false
        },
        async updatePayeeDetails(val){
            if(val === null){
                this.form.tin = ''
                this.form.address = ''
                return
            }
            
            if(typeof val === 'string'){
                // Insert to DB
                let payload = {
                    vendor: val,
                    tin: this.form.tin,
                    address: this.form.address
                }
                await addVendor('vendorList', payload);
                this.getCheckTitles();
            } else {
                this.form.tin = val.data.tin || '--'
                this.form.address = val.data.address || '--'
            }
        },
        async updatePayeeTIN(val){
            let dataSelection = this.form.vendor

            if(typeof this.form.vendor === 'string'){
                // filter out
                dataSelection = this.payeeList.filter(el => el.value === this.form.vendor)
            }


            console.log(dataSelection)
        },
        async getCheckTitles(){
            try {
                const res = await listDocuments(`vendorList`)
                this.payeeList = res.map((obj) => {
                    return {
                        label: obj.name,
                        value: obj.name,
                        data: obj
                    }
                })
                this.originalPayeeList = res.map((obj) => {
                    return {
                        label: obj.name,
                        value: obj.name,
                        data: obj
                    }
                })
            } catch (error) {
                console.log(error)
                this.$q.notify({
                    message: 'Error on fetching product list',
                    color: 'negative',
                });
            }
        },
        async getVoucherNumber(){
            api.get('voucher/reference').then((response) => {
                const data = {...response.data};
                this.form.voucherNumber = data.voucherNumber
            })
        },
        async fillExistingData(){
            for(const key in this.form){
                this.form[key] = this.appData[key]
            }
        },
        addAccountTitle(){
            this.form.titleDetails.push({
                accountNumber: '',
                description: '',
                type: 'sundries',
                dr: '',
                cr: ''
            })
        },
        addCheckDetails(){
            this.form.checkDetails.push({
                docNo: "",
                checkDate: dateNow,
                amount: "",
                bankId: {
                    value: "cash",
                    label: "CASH",
                },
            })
        },
        addInvoiceDetails(){
            this.form.invoiceDetails.push({
                salesInvoice: "",
                description: ""
            })
        },
        filterFn (val, update, abort) {
            update(() => {
                const needle = val.toLowerCase()
                this.payeeList = this.originalPayeeList.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
            })
        },
        titleOnChange(item, idx){
            this.form.titleDetails[idx].description = item.orig.description
            this.form.titleDetails[idx].accountNumber = item.orig.accountNumber
            this.form.titleDetails[idx].type = item.orig.type
        },
        removeId(index, type){
            if(type === "check"){
                this.form.checkDetails.splice(index, 1)
            } else if(type === "invoice"){
                this.form.invoiceDetails.splice(index, 1)
            } else {
                this.form.titleDetails.splice(index, 1)
            }
        },
        async closeModal(){
            this.$emit('updateModalStatus', false);
        },

        async addNeAgentUser(){
            let vm = this;
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
                        this.$q.loading.show({
                            message: 'Your data is submitting. Please wait...'
                        });

                        try {
                            let payload = {
                                ...this.form,
                                createdBy: this.user.id
                            }

                            api.post('users/create', payload).then((response) => {
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
                                    
                                    this.$nextTick(() => {
                                        this.clearForm();
                                        this.$emit('refreshData');
                                        this.$emit('updateModalStatus');
                                    });
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
                        } catch (error) {
                            console.log(error)
                            this.$q.notify({
                                message: 'Error saving data',
                                color: 'negative',
                            });
                        }
                    })
                }
            })

            
            
        },
        

        clearForm(){
            this.form = {
                username: "",
                password: "",
                lastName: "",
                firstName: "",
                middleName: "",
                userType: 3,
                commission: {
                    percent: 0,
                    bag: 0,
                },
                targetSales: {
                    percent: 0,
                    bag: 0,
                },
            }
        },
    }
    
}
</script>

<style>
.hydrated{
    z-index: 9999999 !important;
}
.dashed-border {
    border: 1px dashed !important;
}
</style>