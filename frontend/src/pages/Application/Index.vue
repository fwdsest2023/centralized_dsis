<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col"></div>
            <div class="col col-xs-12 col-sm-12 col-md-5 q-pl-xl q-pr-xl text-center">
                <div class="row">
                    <div class="col-12 text-center"> 
                        <q-img
                            class="q-mb-md col-12"
                            style="height: 100%; max-width: 60%"
                            src="/imgs/tenmei1.png"
                        />
                    </div>
                    
                </div>
                <q-card class="my-card q-pa-lg" flat bordered>
                    <q-card-section horizontal>
                        <q-card-actions vertical class="justify-around q-px-md col-12 col-md-12">
                            
                            <!-- Login Form -->
                            <q-form @submit="submitLogin" class="q-gutter-sm">
                                <q-input 
                                    class="q-pt-md" 
                                    bottom-slots
                                    outlined
                                    v-model="form.username"
                                    v-bind="formRules.username"
                                    :label="$t('form_labels.user')" 
                                    :dense="true"
                                >
                                    <template v-slot:prepend>
                                        <q-icon name="account_circle" />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="close" @click="form.username = ''" class="cursor-pointer" />
                                    </template>
                                </q-input>

                                <q-input 
                                    bottom-slots 
                                    outlined
                                    v-model="form.password"
                                    v-bind="formRules.password"
                                    :type="isPwd ? 'password' : 'text'"
                                    :label="$t('form_labels.pass')" 
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

                                <q-btn 
                                    type="submit"
                                    color="positive" 
                                    text-color="white" 
                                    unelevated
                                    :loading="submitting"
                                    class="full-width"
                                    icon-right="done"
                                    label="Login Agent"
                                >
                                    <template v-slot:loading>
                                        <q-spinner-rings color="white" />
                                    </template>
                                </q-btn>
                            </q-form>
                        </q-card-actions>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { loginapi } from '../../boot/loginAxios'

export default{
    name: 'LoginTemplate',
    data(){
        return {
            form: {
                username: "",
                password: "",
            },
            formRules: {
                username: {
                    rules: [
                        value => !!value || this.$t('validations_error.empty'),
                    ]
                },
                password: {
                    rules: [
                        val => !!val || this.$t('validations_error.empty'),
                    ]
                },
            },
            isPwd: true,
            submitting: false,
        }
    },
    methods: {
        async submitLogin(){
            this.submitting = true;
            let vm = this;
            let payload = vm.form;

            loginapi.post('auth/login', payload).then((response) => {
              
                const data = {...response.data};
                if(!data.error){
                    LocalStorage.set('userData', data.jwt);
                    // Session Login with Expiration
                    SessionStorage.set('userDataLogin', data.jwt);
                    this.$router.push('/distribution/dashboard')
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

            this.submitting = false;
        }
    }
}
</script>


<style lang="scss" scoped>
.my-card{
    border-radius: 20px !important;
}
</style>