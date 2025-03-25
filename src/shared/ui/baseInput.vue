  <template>
    <input type="text" maxlength="15" autocomplete="off" @input="emits('update:modelValue', $event.target.value)"
      :value="props.modelValue" />
  </template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
});

const emits = defineEmits(['update:modelValue']);
</script>

<style scoped>
input {
  all: unset;
  min-width: 15rem;
  max-width: 20rem;
  z-index: 2;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
</style>
