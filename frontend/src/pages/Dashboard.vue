<template>
  <div class="text-center">
    <span class="text-h2">COMING SOON!</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Login from '../components/Login/Index';

export default defineComponent({
  name: 'PageIndex',
  components: {
    Login
  },
  data(){
    return {
      sample: "Here it is"
    }
  }
})
</script>
