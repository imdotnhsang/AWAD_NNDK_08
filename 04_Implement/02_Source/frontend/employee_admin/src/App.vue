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

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
      opacity: 0.2;
      background: rgba(164, 164, 164, 0.5);
      border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(196, 196, 196, 0.15);
      border-radius: 4px;
  }

</style>
