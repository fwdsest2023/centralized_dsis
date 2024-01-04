<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div class="col col-md-3">
                <q-card class="my-card" flat bordered>
                    <q-img src="/imgs/logo1.png" />

                    <q-card-section>

                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                {{`${ownerDetails.firstName} ${ownerDetails.middleName} ${ownerDetails.lastName}`}}
                            </div>
                            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                                <!-- <q-icon name="place" /> -->
                            </div>
                        </div>

                        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <div class="text-subtitle1">
                        Contact: {{ownerDetails.contact}}
                        </div>
                        <div class="text-caption text-grey">
                        {{ownerDetails.address}}
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn flat color="primary">
                            Edit Details
                        </q-btn>
                    </q-card-actions>
                </q-card>
                <q-card class="my-card q-mt-md" flat bordered>
                    <q-card-section>

                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                Username: {{`${ownerDetails.username}`}} <br/>
                                Password: ********
                            </div>
                        </div>

                        <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <div class="text-caption text-grey">
                        Joined Date: {{ownerDetails.createdAt}}
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <q-btn flat color="red">
                            Reset Password
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-4 q-pl-sm">
                <q-card class="my-card" flat bordered>
                    <q-img src="/imgs/image2.jpg" />

                    <q-card-section>
                        <div class="row no-wrap items-center">
                            <div class="col text-h6 ellipsis">
                                {{`${petDetails.petName}`}}
                            </div>
                            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                                <!-- <q-icon name="place" /> -->
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <div class="text-subtitle1">
                        Details
                        </div>
                        <div class="text-caption text-grey">
                            Date of Birth: {{`${petDetails.birthDate} (${petDetails.age})`}}
                        </div>
                        <div class="text-caption text-grey">
                            Breed: {{petDetails.breed}}
                        </div>
                        <div class="text-caption text-grey">
                            Species: {{petDetails.species}}
                        </div>
                        <div class="text-caption text-grey q-mb-sm">
                            Gender: {{petDetails.sex}}
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                        <!-- <q-btn flat round icon="event" /> -->
                        <q-btn flat color="primary">
                            Edit Pet Details
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col col-md-5 q-pl-md" style="max-height: 60vh; overflow: auto;">
                <q-timeline color="secondary">
                    <q-timeline-entry heading body="Pet History" />

                    <q-timeline-entry
                        title="Event Title"
                        subtitle="February 22, 1986"
                        :body="body"
                    />

                    <q-timeline-entry
                        title="Event Title"
                        subtitle="February 22, 1986"
                        :body="body"
                    />

                    <q-timeline-entry
                        title="Event Title"
                        subtitle="February 22, 1986"
                        color="orange"
                        icon="done_all"
                        :body="body"
                    />

                    <q-timeline-entry
                        title="Event Title"
                        subtitle="February 22, 1986"
                        :body="body"
                    />

                    <q-timeline-entry
                        title="Event Title"
                        subtitle="February 22, 1986"
                        :body="body"
                    />
                    </q-timeline>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default{
    name: 'OwnerDetails',
    props: {
        row: {
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            body: 'Lorem ipsum dolor sit amet, consectetur do eiusmod tempor incididest laborum.'
        }
    },
    computed:{
        ownerDetails(){
            return this.row.patientOwner
        },
        petDetails(){
            return this.row
        }
    },
    methods: {
        moment
    }
}
</script>
