<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style>
  .base-button {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: rgba(74, 85, 104, 1);
    font-weight: 500;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
      background-color: #5d6b83;
    }

    &:disabled {
      background-color: #e0e0e0;
      color: #9e9e9e;
      cursor: not-allowed;
    }
  }
</style>
