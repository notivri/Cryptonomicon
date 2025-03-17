<template>
  <div class="container">
    <h3>VUE - USD</h3>
    <div class="graph">
      <div style="width: 2.5rem; height: 5rem; background-color: peachpuff;" />
      <div style="width: 2.5rem; height: 7rem; background-color: peachpuff;" />
      <div style="width: 2.5rem; height: 12rem; background-color: peachpuff;" />
      <div style="width: 2.5rem; height: 3rem; background-color: peachpuff;" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  position: relative;
  padding: 1rem;
  box-sizing: border-box;
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
}

.graph {
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-height: 15rem;
  gap: 0.3rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0.2rem;
}
</style>
