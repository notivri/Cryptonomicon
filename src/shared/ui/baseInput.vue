<template>
  <input
    type="text"
    maxlength="15"
    autocomplete="off"
    :value="props.modelValue"
    @input="emits('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: "",
    },
  })

  const emits = defineEmits(["update:modelValue"])
</script>

<style scoped>
  input {
    all: unset;
    position: relative;
    z-index: 2;
    width: 15rem;
    padding: 0.5rem;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);

    &::placeholder {
      color: #00000080;
      font-weight: 500;
    }
  }
</style>
