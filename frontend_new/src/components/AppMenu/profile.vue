<template>
    <div class="q-pa-sm">
        <q-list bordered padding class="rounded-borders">
            <q-item v-for="(item, index) in filteredSettings" :key="index">
                <q-item-section avatar top>
                    <q-avatar v-bind="item.avatar" />
                </q-item-section>

                <q-item-section>
                <q-item-label lines="1">{{ item.label }}</q-item-label>
                <q-item-label caption>{{item.caption}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn 
                        flat 
                        round
                        :loading="item.loading"
                        @click="item.action"
                        :color="item.sides.color" 
                        :icon="item.sides.icon" 
                    />
                    <!-- <q-icon :name="item.sides.icon" :color="item.sides.color" /> -->
                </q-item-section>
            </q-item>
        </q-list>

        <q-dialog persistent v-model="openChangePass">
            <q-card style="width: 500px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6">Change Password</div>
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 60vh" class="scroll">
                   <q-form ref="passForm" class="q-gutter-md">
                        <q-input 
                            class="q-pt-md" 
                            bottom-slots 
                            v-model="newPassword"
                            v-bind="formRules.matchPass"
                            :type="isPwd ? 'password' : 'text'"
                            label="New Password" 
                            :dense="true"
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

                        <q-input 
                            class="q-pt-md" 
                            bottom-slots 
                            v-model="retypePass"
                            v-bind="formRules.matchPass"
                            :type="isPwd ? 'password' : 'text'"
                            label="Re-type Password" 
                            :dense="true"
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
                   </q-form>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" :loading="btnLoading" color="negative" @click="cancelChange" />
                    <q-btn flat label="Submit" :loading="btnLoading" color="positive" @click="submitChangePass" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import moment from 'moment'
import {LocalStorage} from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default {
    name: "ProfilePAge",
    data() {
        return {
            tab: 'mails',
            splitterModel: 25,
            expanded: false,
            openChangePass: false,
            newPassword:'',
            retypePass: '',
            isPwd: true,
            formRules: {
                matchPass: {
                    rules: [
                        val => !!val || this.$t('validations_error.empty'),
                        val => val == this.newPassword || this.$t('validations_error.invalid_match'),
                    ]
                },
            },
            settingSearch: '',
            settingList: [
                {
                    avatar: {
                        icon: 'password',
                        color: 'primary',
                        textColor: 'white'
                    },
                    label: 'Change Password',
                    caption: 'Profile Change Password',
                    sides:{
                        icon: 'lock_reset',
                        color: 'black'
                    },
                    loading: false,
                    action: () => {return this.changePassModal()}
                }
            ]
        }
    },
    computed:{
        filteredSettings: function(){
            return this.settingList.filter(search => {
                return search.label.toLowerCase().includes(this.settingSearch.toLowerCase())
            })
        },
        user: function(){
            let profile = LocalStorage.getItem('userData');
            return jwt_decode(profile);
        },
        clData: function(){
            let list = LocalStorage.getItem('clientList');
            let filtered = list.filter(el => el.client.status === 'finish')
            return filtered;
        }
    },
    created(){
        
    },
    methods: {
        moment,
        changePassModal(){
            this.openChangePass = true;
        },
        cancelChange(){
            this.openChangePass = false;
        },
        async submitChangePass(){
            let vm = this;
            let payload = {
                id: this.user.userId,
                newPassword: this.retypePass
            };
            let compoDetails = this.$refs.passForm;

            compoDetails.validate().then(success => {

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
                        title: 'Change Password?',
                        message: 'Are you sure you want to change your password?',
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
                            message: 'Changing your password. Please wait...'
                        });

                        api.post('auth/changePassword', payload).then((response) => {
              
                            const data = {...response.data};
                            if(!data.error){
                                LocalStorage.remove('userData');
                                vm.$router.push('/')
                            } else {
                                vm.$q.notify({
                                    color: 'negative',
                                    position: 'top-right',
                                    title:data.title,
                                    message: vm.$t(`errors.${data.error}`),
                                    icon: 'report_problem'
                                })
                            }
                        })

                        this.$q.loading.hide();

                    })
                }
            })

        }
    }
}
</script>
