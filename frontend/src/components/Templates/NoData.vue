<template>
    <div class="row">
        <div class="col text-center q-pl-lg q-pr-lg"> 
            <q-icon name="upcoming" style="color: #554c4c" size="7.4em" />
            <q-separator inset  />
            <span class="text-h4" style="color: #554c4c;">No Data Found!</span>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Breadcrumbs',
  props: {
    contentLink: {
      type: Array,
    },
  }
})
</script>
