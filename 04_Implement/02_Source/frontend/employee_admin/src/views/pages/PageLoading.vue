<template>
  <div id="pageLoading">
    <div class="lds-ghn">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PageLoading"
};
</script>
<style scoped>
#pageLoading {
    text-align: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99999;
    background-color:white;
    opacity: 0.8;
}
.lds-ghn {
  position: relative;
  height: 100px;
  width: 122px;
  left: 47%;
  margin-top: 70px;
}
.lds-ghn div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 30px;
  background: #ff8300;
  animation: lds-ghn 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  border-radius: 3px;
}

.lds-ghn div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}

.lds-ghn div:nth-child(2) {
  left: 46px;
  animation-delay: -0.12s;
}

.lds-ghn div:nth-child(3) {
  left: 86px;
  animation-delay: 0;
}

@keyframes lds-ghn {
  0% {
    top: 6px;
    height: 102px;
  }

  50%,
  100% {
    top: 28px;
    height: 52px;
  }
}
</style>