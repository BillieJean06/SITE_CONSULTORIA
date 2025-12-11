<template>
  <div>
    <input
      v-bind="$attrs"
      v-on="$listeners"
      v-mask="mask"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
export default {
  name: "InputMasked",
  directives: { mask },
  props: {
    value: { type: String, default: "" },
    mask: { type: String, required: true },
  },
};
</script>

<style scoped>
/* pequeno ajuste */
input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}
</style>
