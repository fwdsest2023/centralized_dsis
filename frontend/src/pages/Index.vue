<template>
  <q-page class="">
    
    <div class="row q-mb-xl" style="height: 60vh;">
      <div class="col col-xs-12 col-md-12"></div>
      <div class="col col-xs-2 col-sm-2 col-md-2"></div>
      <div class="col col-xs-10 col-sm-10 col-md-4 flex items-center" style="z-index:999;">
        <span class="text-h2 text-bold">The Smarter Way to Keep your Paws <span class="text-orange">Healthy</span></span>
        <span class="text-subtitle1">Trust your pet's health to a reliable clinic. Regular check-ups, vaccination, and emergency care ensure their well-being. Choose quality veterinary services.</span>
        
        <q-btn color="red" size="xl" icon-right="app_registration" label="Sign Up Now!" />
        <!-- <q-input rounded outlined stack-label v-model="text" placeholder="Search" style="width: 100%;"/> -->
      </div>
      <div class="col col-xs-6 col-sm-6 col-md-6"></div>

      <div class="backgroundHeader"></div>
    </div>

    <div class="row q-mt-xl">
      <div class="col col-xs-12 col-sm-12 col-md-12 text-center">
        <span class="text-h4 text-bold">Welcome to <span class="text-orange">PRIMPING PAWS</span></span>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-2 flex items-center"></div>
      <div class="col col-xs-12 col-sm-12 col-md-8">
        <div class="row">
          <div
            v-for="(item, index) in programs"
            :key="index"
            class="col col-xs-12 col-sm-6 col-md-3 flex items-center q-pa-md"
          >
            <q-list bordered class="shadow-6" >
              <q-item active class="q-pa-md bg-white">
                <q-item-section top avatar>
                  <q-icon :name="item.icon" :color="item.iconColor" size="md" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold">{{item.title}}</q-item-label>
                  <q-item-label caption lines="2">{{item.value}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <div class="col col-md-2 flex items-center"></div>
    </div>
    <div class="row q-mt-lg">
      <div class="col col-xs-1 col-sm-1 col-md-2 flex items-center"></div>
      <div class="col col-xs-10 col-sm-10 col-md-8">
        <q-carousel
          swipeable
          animated
          v-model="slide"
          thumbnails
          infinite
        >
          <q-carousel-slide :name="1" img-src="/imgs/image1.jpg" />
          <q-carousel-slide :name="2" img-src="/imgs/image2.jpg" />
          <q-carousel-slide :name="3" img-src="/imgs/image3.jpg" />
          <q-carousel-slide :name="4" img-src="/imgs/image4.jpg" />
        </q-carousel>
      </div>
      <div class="col col-xs-1 col-sm-1 col-md-2 flex items-center"></div>
    </div>

    <div class="row q-mt-xl" id="#announcements">
      <div class="col col-xs-1 col-sm-1 col-md-2 flex items-center"></div>
      <div class="col col-xs-10 col-sm-10 col-md-8">
        <div class="row">
          <div class="col col-xs-12 col-sm-12 col-md-12 q-mb-lg flex">
            <span class="text-h4 text-bold">Announcements</span><q-space />
            <q-btn 
              flat
              color="white"
              label="More"
              icon-right="arrow_right_alt"
            />
          </div>
          <div
            v-for="(item, index) in announcements"
            :key="index"
            class="col col-xs-12 col-sm-12 col-md-4 q-pa-lg"
          >
            <q-card class="my-card" flat bordered>
              <q-img :src="item.image" />

              <q-card-section>
                <q-chip 
                  color="primary" 
                  text-color="white" 
                  :icon="item.subject.icon"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%);"
                >
                  {{item.subject.label}}
                </q-chip>
                <div class="row no-wrap items-center">
                  <div class="col text-h6 text-black ellipsis">
                    {{item.title}}
                  </div>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="text-subtitle1 text-black ellipsis" v-html="item.content"></div>
                <div class="text-caption text-grey">
                  {{`By ${item.createdBy}`}}・{{item.tags.join(', ')}}
                </div>
                <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                  <q-icon name="event" /> {{item.createdDate}}
                </div>
              </q-card-section>

              <q-card-actions>
                <q-btn style="width: 100px;" outline rounded color="primary" label="Read" size="sm" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col col-xs-1 col-sm-1 col-md-2 flex items-center"></div>
    </div>
    
    <!-- Footer -->
    <!-- <div class="row footerBackground bg-green-10 text-white" style="z-index:999;">
      <div class="col col-md-2"></div>
      <div class="col col-xs-12 col-sm-12 col-md-8">
        footer
      </div>
      <div class="col col-md-2"></div>
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from 'boot/axios'

export default defineComponent({
  name: 'PageIndex',
  components: {},
  data(){
    return {
      text: '',
      slide: 1,
      programs: [
        {
          icon: 'vaccines',
          iconColor: 'orange',
          title: 'Awesome Medicines',
          value: 'Vivamus interdum, mauris interdum quis curdum sodales',
        },
        {
          icon: 'verified',
          iconColor: 'red',
          title: 'Certificate',
          value: 'Etiam risus neque, volutpat vel laoreet a, finibus volutpat non',
        },
        {
          icon: 'assignment_ind',
          iconColor: 'green',
          title: 'Best Doctors',
          value: 'Etiam risus neque, volutpat vel laoreet a, finibus volutpat non',
        },
        {
          icon: 'medical_services',
          iconColor: 'blue',
          title: 'Best Services',
          value: 'Etiam risus neque, volutpat vel laoreet a, finibus volutpat non',
        },
      ],
      announcements: [],
    }
  },
  created(){
    this.getAnnouncements();
  },
  methods:{
    async getAnnouncements(){
      let vm = this;
      
      api.get('announcement/public/getList').then((response)=>{
          let data = {...response.data}

          if(!data.error){
            this.announcements = response.status < 300 ? data.list : [];
          } else {
              this.$q.notify({
                  color: 'negative',
                  position: 'top-right',
                  title:data.title,
                  message: this.$t(`errors.${data.error}`),
                  icon: 'report_problem'
              })
          }
      });
    },
  }
})
</script>

<style scoped>
.backgroundHeader{
  position: absolute;
  background: url('/imgs/background.svg') no-repeat;
  height: 80vh;
  width: 100%;
  background-position: 50% 60%;
  background-size: 60%;
  opacity: 0.2;
}
.backgroundMid{
  position: absolute;
  background: url('/imgs/background2.svg') no-repeat;
  height: 60vh;
  width: 34%;
  background-position: -25% 66%;
  /* background-size: 60%;
  opacity: 0.2; */
}
.footerBackground{
  height: 30vh;
}
</style>
