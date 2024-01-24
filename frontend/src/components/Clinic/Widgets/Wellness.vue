<template>
    <div class="q-pa-md" style="width: 100%;">
        <div class="row">
            <div
                v-for="(item, index) in vaccineTableList"
                :key="index"
                class="col col-sm-12 col-md-4 col-lg-3 q-pa-sm"
            >
                <q-card flat bordered class="my-card">
                    <q-card-section class="text-center">
                        <div class="text-h6">{{item.title}}</div>
                    </q-card-section>

                    <q-separator inset />

                    <q-card-section>
                        <q-list
                            v-if="item.vaxList.length !== 0"
                            bordered 
                            separator
                        >
                            <q-item
                                v-for="(itm, idx) in item.vaxList"
                                :key="idx"
                            >
                                <q-item-section>
                                    <q-item-label>{{itm.vet}} - {{itm.date}}</q-item-label>
                                    <q-item-label class="text-bold text-subtitle1">{{itm.medicine}}</q-item-label>
                                </q-item-section>

                                <q-item-section side top>
                                    <q-item-label caption>{{itm.weight}}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <span v-else>No History Found</span>
                    </q-card-section>
                </q-card>
            </div>  
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import jwt_decode from 'jwt-decode'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

export default{
    name: 'PetWellness',
    props: {
        petId: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            tableRow: [],
            vaccineTableList: [
                {
                    title: 'Treatment History',
                    name: 'treatment',
                    vaxList: [],
                },
                {
                    title: 'Tick and Flea Prevention',
                    name: 'tickAndFlea',
                    vaxList: [],
                },
                {
                    title: 'Vaccination Record',
                    name: 'vaccination',
                    vaxList: [],
                },
                {
                    title: 'Deworm Record',
                    name: 'deworm',
                    vaxList: [],
                },
            ]
        }
    },
    computed:{},
    created(){
        this.getList();
    },
    methods: {
        moment,
        async getList(){
            this.tableRow = [];
            this.isLoading = true;
            let payload = {
                pid: this.petId
            }

            api.post('patient/get/wellness', payload).then((response) => {
                const data = {...response.data};
                if(!data.error){
                    this.tableRow = response.status < 300 ? data.list : [];
                    this.tableRow.forEach((el, idx) => {

                        this.vaccineTableList.map(elv => {
                            if(elv.name === el.vaxClassification){
                                let details = {
                                    date: moment(el.vaxDate).format('MM/DD/YYYY'),
                                    weight: `${el.weight} KG`,
                                    medicine: el.vaxName,
                                    vet: `${el.vetDetails.firstName} ${el.vetDetails.lastName}`,
                                }
                                elv.vaxList.push(details)
                            }
                        })
                        
                    });
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
    }
}
</script>
