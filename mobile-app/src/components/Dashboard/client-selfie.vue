<template>
    <div>
        <q-dialog v-if="showPicture" persistent seamless v-model="openModal" position="top">
            <q-card>
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title>Selfie Evidence</q-toolbar-title>
                        <q-btn
                            v-if="!isDone"
                            @click="reTake"
                            round 
                            color="red" 
                            icon="cameraswitch" 
                        />
                    </q-toolbar>
                </q-card-section>

                <q-separator />

                <q-card-section class="scroll">
                    <q-img
                        :src="imgSrc"
                        spinner-color="white"
                    />
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Close" :loading="btnLoading" color="negative" @click="closeModal" />
                    <q-btn v-if="!isDone" flat label="Done" :loading="btnLoading" color="positive" @click="submitOrder" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        
    </div>
</template>
<script>
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Preferences } from '@capacitor/preferences';
import {LocalStorage} from 'quasar'

export default {
    name: "ClientRemarks",
    data() {
        return {
            openModal: false,
            showPicture: false,
            isDone: false,
            loadClientData: [],
            imgSrc: ''
        }
    },
    props: {
        clientId: {
            type: Number,
            default: 0
        },
        modalStatus: {
            type: Boolean
        },
        resetData: {
            type: Boolean
        }
    },
    watch:{
        modalStatus: function(newVal){
            let vm = this
            this.openModal = newVal
            if(newVal === true){
                let data = this.clientId;
                if(data.files !== ''){
                    this.imgSrc = data.files
                    this.showPicture = true
                    this.isDone = true
                } else {
                    defineCustomElements(window).then(()=>{
                        vm.playCamera()
                    })
                }
                
            }
        },
        resetData: function(newVal){
            this.imgSrc = ""
            this.isDone = false
        }
    },
    methods: {
        async clientList(){
            const { value } = await Preferences.get({ key: 'clientList' });
            let data = value !== null ? JSON.parse(value) : [];
            this.loadClientData = data
        },
        async closeModal(){
            this.imgSrc = '';
            this.$emit('updateStatus', false);
        },
        async submitOrder(){
            // this.loadClientData[this.clientId].files = this.imgSrc
            // // console.log(this.loadClientData)
            // await Preferences.set({
            //     key: 'clientList',
            //     value: JSON.stringify(this.loadClientData)
            // }).then(() => {
            //     this.imgSrc = ''
            //     this.$emit('updateStatus', false);
            //     this.$emit('finishStep', this.clientId);
            // })
            let data = {
                type: 'selfie',
                value: this.imgSrc
            }
            this.$emit('clientSelfie', data);
            this.imgSrc = ''
            this.$emit('updateStatus', false);
        },
        reTake(){
            const vm = this
            this.imgSrc = ''
            this.showPicture = false
            defineCustomElements(window).then(()=>{
                vm.playCamera()
            })
            
        },
        async playCamera(){
            let vm = this;
            const perm = await Camera.checkPermissions();

            const image = await Camera.getPhoto({
                quality: 15,
                source: CameraSource.Camera,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                presentationStyle:'popover',
                saved: true
            }).catch((err) => { 
                alert(err)
                vm.closeModal()
            })
            this.imgSrc = image.dataUrl
            this.showPicture = true
        }
    }
}
</script>

<style>
.hydrated{
    z-index: 9999999;
}
.camera-footer > .pick-image{
    display: none!important;
} 
</style>
