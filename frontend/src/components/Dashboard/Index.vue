<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <!-- Cards -->
            <div class="col col-md-4 q-pa-sm">
                <q-card class="my-card" flat bordered>
                    <q-item>
                        <q-item-section>
                        <q-item-label>DVS Vet Clinic</q-item-label>
                        <q-item-label caption>
                            Subhead
                        </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-card-section horizontal class="row">
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Today's Sales
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Clients
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Patients
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Overall Sales
                            </div>
                        </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn flat round icon="event" />
                        <q-btn flat>
                        7:30PM
                        </q-btn>
                        <q-btn flat color="primary">
                        Reserve
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-4 q-pa-sm">
                <q-card class="my-card" flat bordered>
                    <q-item>
                        <q-item-section>
                        <q-item-label>DVS Distribution</q-item-label>
                        <q-item-label caption>
                            Subhead
                        </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-card-section horizontal class="row">
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Today's Sales
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Clients
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Products
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pt-xs col">
                            <div class="text-h6 q-mt-sm q-mb-xs">0</div>
                            <div class="text-caption text-grey">
                                Overall Sales
                            </div>
                        </q-card-section>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn flat round icon="event" />
                        <q-btn flat>
                        7:30PM
                        </q-btn>
                        <q-btn flat color="primary">
                        Reserve
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-4 q-pa-sm">
                <q-card class="my-card" flat bordered>

                    <q-card-section horizontal class="row">
                        <q-card-section class="col">
                            <q-list >
                                <q-item v-for="(item, index) in activities" tag="label" :key="index" v-ripple>
                                    <q-item-section side top>
                                        <q-icon v-if="!item.active" name="warning" color="orange" />
                                        <q-icon v-else name="check_circle" color="green" />
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>{{item.title}}</q-item-label>
                                        <q-item-label caption>
                                            {{item.caption}}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card-section>
                    </q-card-section>
                </q-card>
            </div>
            <!-- Calendar -->
            <div class="col col-md-6 q-pa-sm">
                
            </div>
            <!-- Inventory -->
        </div>
    </div>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { api } from 'boot/axios'

export default{
    name: 'CardWidgets',
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
            activities: [
                {
                    active: false,
                    title: "Client Visit",
                    caption: "Check and Inspect for the client",
                    action: () => { return false }
                },
                {
                    active: false,
                    title: "Booking",
                    caption: "Proceeds with client order transactions",
                    action: (val) => { return this.openBookingDetails(val) }
                },
                {
                    active: false,
                    title: "Onsite Activity",
                    caption: "Vaccines, Inspections, Etc.",
                    action: () => { return false }
                },
            ]
        }
    },
    methods: {
        
    }
}
</script>
