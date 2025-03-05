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
                    <div class="text-h6">Add Check Voucher</div>
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
                        <div class="col-12 col-md-12">
                            <span v-if="this.form.checkType === 'voucher'" class="text-h6">Voucher #: {{form.voucherNumber}}</span><br/>
                            <span class="text-h6">Check Details</span>
                            <!-- <q-separator /> -->
                        </div>
                        <div class="col-12 col-md-12 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.vendor" 
                                label="Vendor / Issued To" 
                                stack-label
                                dense
                            />
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-select 
                                outlined 
                                v-model="form.type" 
                                :options="typeOpt" 
                                label="Type" 
                                stack-label 
                                dense
                                options-dense
                            >
                            </q-select>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-select 
                                outlined 
                                v-model="form.checkType" 
                                :options="checkTypeOpt" 
                                label="Voucher Type" 
                                stack-label 
                                dense
                                options-dense
                            >
                            </q-select>
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.receivedBy" 
                                label="Received By" 
                                stack-label
                                dense
                            />
                        </div>
                        <div class="col-12 col-md-6 q-pa-sm">
                            <q-input
                                outlined 
                                v-model="form.approvedBy" 
                                label="Approved By" 
                                stack-label
                                dense
                            />
                        </div>
                        <div class="col col-md-12 q-mt-md">
                            <span class="text-h5">Check Deposits Details</span>
                            <!-- <q-separator /> -->
                        </div>
                        <div class="col col-md-12 q-pa-xs">
                            <div class="row q-mt-sm">
                                <div class="col-12 col-md-3 q-pa-xs">
                                    <q-input
                                        outlined 
                                        v-model="form.bank" 
                                        label="Bank" 
                                        stack-label 
                                        dense
                                    >
                                    </q-input> 
                                </div>
                                <div class="col-12 col-md-3 q-pa-xs">
                                    <q-input
                                        type="number"
                                        outlined 
                                        v-model="form.checkNumber" 
                                        label="Check No." 
                                        stack-label 
                                        dense
                                    >
                                    </q-input> 
                                </div>
                                <div class="col-12 col-md-3 q-pa-xs">
                                    <q-input
                                        outlined 
                                        v-model="form.amount" 
                                        label="Amount"
                                        stack-label
                                        dense
                                    >
                                    </q-input>
                                </div>
                                <div class="col-12 col-md-3 q-pa-xs">
                                    <q-input
                                        type="date"
                                        outlined 
                                        v-model="form.checkDate" 
                                        label="Check Date" 
                                        stack-label
                                        dense
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-12 q-pa-sm">
                            <q-input
                                type="textarea"
                                outlined 
                                v-model="form.particulars" 
                                label="Particulars / Remarks" 
                                stack-label
                                dense
                            />
                        </div>
                    </q-form>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn
                        flat 
                        label="Preview Voucher" 
                        color="green"
                        @click="previewVoucher" 
                    />
                    <q-btn
                        flat 
                        label="Create Voucher" 
                        color="primary"
                        @click="submitModalClick" 
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <printModal
            :modalStatus="openPrintModal"
            :appData="form"
            @updatePrintStatus="closePrintModal"
        />
    </div>
</template>
<script>
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'
import printModal from './PrintVoucherModal.vue'
import moment from 'moment'

const dateNow = moment().format('YYYY-MM-DD');

export default {
    name: 'AddCheckVoucherModal',
    components: {
        printModal
    },
    data(){
        return {
            splitterModel: 40,
            splitterInfoModel: 20,
            openModal: false,
            openSignModal: false,
            openPrintModal: false,
            form: {
                vendor: '',
                bank: '',
                checkDate: dateNow,
                amount: '',
                particulars: '',
                type: "CASH",
                checkType: "voucher",
                approvedBy: '',
                receivedBy: '',
                receivedDate: '',
                voucherNumber: "TPST 000001",
                createdBy: 0,
            },
            typeOpt: ['CASH', 'CHECK'],
            checkTypeOpt: ['voucher', 'postdated'],
        }
    },
    watch:{
        modalStatus(newVal, oldVal){
            this.openModal = newVal
            this.getVoucherNumber()
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
        async submitModalClick(){
            let vm = this;

            // Confirm
            this.$q.dialog({
                title: 'Submit details',
                message: 'Would you like to submit this check details?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                // this.$emit('submitModalClick', vm.form);
                this.addNewVoucher();
            })
            
        },

        async addNewVoucher(){
            let vm = this;
            this.$q.loading.show({
                message: 'Your data is submitting. Please wait...'
            });

            try {
                let payload = {
                    ...this.form,
                    voucherNumber: this.form.checkType === 'voucher' ? `TPST ${this.form.voucherNumber}` : "",
                    createdBy: this.user.id
                }

                api.post('voucher/add', payload).then((response) => {
                    const data = {...response.data};
                    this.form.voucherNumber = data.voucherNumber
                })

                this.$q.loading.hide();
                this.$nextTick(() => {
                    this.$emit("refreshData")
                    this.clearForm();
                    this.closeModal()
                })
            } catch (error) {
                console.log(error)
                this.$q.notify({
                    message: 'Error saving data',
                    color: 'negative',
                });
            }
            
        },
        

        clearForm(){
            this.form = {
                vendor: '',
                bank: '',
                checkDate: dateNow,
                amount: '',
                particulars: '',
                type: "CASH",
                checkType: "voucher",
                approvedBy: '',
                receivedBy: '',
                receivedDate: '',
                voucherNumber: "TPST 000001",
                createdBy: 0,
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