<script setup>
import userInput from '@/components/userInput.vue';
import cryptoCard from '@/components/cryptoCard.vue';
import graphSection from '@/components/graphSection.vue';
</script>

<template>
  <div class="container">
    <userInput />
    <hr style="margin: 1rem;">
    <div class="grid-container">
      <cryptoCard />
      <cryptoCard />
      <cryptoCard />
      <cryptoCard />
    </div>
    <hr style="margin: 1rem;">
    <graphSection />
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}
</style>
