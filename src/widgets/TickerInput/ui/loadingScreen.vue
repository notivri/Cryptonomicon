<script setup>
import loadingIcon from '../icons/loadingIcon.vue';
</script>

<template>
  <div class="loadingScreen">
    <loadingIcon class="loadingIcon" />
  </div>
</template>

<style scoped>
.loadingScreen {
  z-index: 100;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(85, 60, 154, 1);
}

.loadingIcon {
  animation: 1s linear infinite loading;
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(+360deg);
  }
}
</style>
