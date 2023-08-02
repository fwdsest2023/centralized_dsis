<template>
  <q-item
    clickable
    @click="showCrumbs(crumbs)"
    tag="a"
    v-if="checkModule(code)"
    :to="link"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SideNavigation',
    props: {
        title: {
            type: String,
            required: true
        },

        link: {
            type: String,
            default: '#'
        },

        icon: {
            type: String,
            default: ''
        },

        code: {
          type: Number
        },

        crumbs: {
            type: Array,
            default: [{title: '', icon: 'home', link: '/'}]
        }
    },
    computed: {
      user: function(){
        let profile = LocalStorage.getItem('userData');
        return jwt_decode(profile);
      }
    },
    methods:{
      checkModule(id) {
        return this.user.modules.includes(id) ? true : false;
      },
      async showCrumbs(value){
          this.$emit('linkCrumbs', value);
      }
    }
})
</script>
