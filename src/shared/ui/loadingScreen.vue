<template>
  <div class="loadingScreen">
    <loadingIcon class="loadingIcon" />
  </div>
</template>

<script setup>
  import loadingIcon from "../icons/loadingIcon.vue"
</script>

<style scoped>
  .loadingScreen {
    z-index: 100;
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(85, 60, 154, 1);
  }

  .loadingIcon {
    animation: loading 1s linear infinite;
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
