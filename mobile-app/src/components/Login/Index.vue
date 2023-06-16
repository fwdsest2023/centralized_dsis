<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col col-xs-12 col-sm-12 text-center">
                <span class="text-h5 indigo-12" color="indigo-12">
                    <q-img src="imgs/dvslogo.png"  />
                </span>
                
                <!-- Login Form -->
                <q-form @submit="submitLogin" class="full-width q-gutter-sm">
                    <q-input 
                        class="q-pt-md" 
                        bottom-slots
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
                        class="q-pt-md" 
                        bottom-slots 
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
                    <q-separator />
                    <q-btn 
                        type="submit"
                        color="teal-5" 
                        text-color="white" 
                        :loading="submitting"
                        class="full-width custom-button-border"
                        :label="$t('form_labels.login')"
                    >
                        <template v-slot:loading>
                            <q-spinner-rings color="white" />
                        </template>
                    </q-btn>
                </q-form>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import { loginapi } from 'boot/loginAxios'

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
                    this.$router.push('/dashboard')
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

<style scoped>
.custom-button-border{
    border-radius: 20px;
}
</style>