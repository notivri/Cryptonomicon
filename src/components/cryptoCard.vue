<template>
  <div class="card">
    <div>
      <dt>BTC - UCD</dt>
      <dd>232.24</dd>
    </div>
    <button id="deleteButton">
      <deleteIcon />
      Удалить
    </button>
  </div>
</template>

<script setup>
import deleteIcon from '@/app/icons/deleteIcon.vue';
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  margin: 0.5rem;

  & dt {
    color: rgba(0, 0, 0, 0.5);
    font-weight: 500;
    margin: 1rem;
  }

  & dd {
    font-size: 1.875rem;
    font-weight: 500;
    margin: 1rem;
  }

  & #deleteButton {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
    color: rgba(113, 128, 150, 1);
    background-color: whitesmoke;
    font-weight: 600;
    width: 100%;
    margin-bottom: 0.5rem;

    &:hover {
      background-color: rgb(228, 228, 228);
    }
  }
}
</style>
