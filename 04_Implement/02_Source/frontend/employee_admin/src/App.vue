<template>
   <transition name="fade" mode="out-in">
      <div>
          <PageLoading v-if="isLoadingRedirect"/>
          <router-view/>    
      </div>
    </transition>
</template>

<script>
import {mapState} from "vuex"
export default {
  name: 'App',
  computed: {
    ...mapState({
      isLoadingRedirect: state => state.isLoadingRedirect
    })
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
