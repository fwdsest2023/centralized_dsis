<template>
    <div>
        <q-dialog persistent seamless v-model="openModal" position="bottom">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Add Client</q-toolbar-title>
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section style="height:90vh;max-height: 100vh" class="scroll">
                    form of add
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="negative" @click="closeModal" />
                    <q-btn flat label="Add Client" color="positive" @click="addClient" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import jsonClient from '../../context-data/clients.json'

export default {
    name: "ClientAdd",
    data() {
        return {
            openModal: false,
            loadProductList: [],
            loadClientData: {
                booking: []
            },
            addProductView: false,
            searchClient: '',
            imageSrc: '',
            form: {
                client: {
                    id: null,
                    storeName: "",
                    address: "",
                    branch: "",
                    regionId: null,
                    categoryId: null,
                    geoLocation: {},
                    loading: false,
                    icon: "play_circle",
                    color: "green",
                    status: "pending"
                },
                attendance: {
                    startCall: "",
                    endCall: "",
                    geoLocation: {
                        timeIn:"",
                        timeOut:"",
                        coorIn: {},
                        coorOut: {}
                    }
                },
                booking:[],
                remarks: [],
                files: ""
            }
        }
    },
    props: {
        modalStatus: {
            type: Boolean
        }
    },
    watch:{
        modalStatus: function(newVal){
            this.openModal = newVal
        }
    },
    created(){
        this.clientList
    },
    methods: {
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        async submitOrder(){
            this.$emit('orderSubmit', false);
        },
        addClient(){
            
        }
    }
}
</script>