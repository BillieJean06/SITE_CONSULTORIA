<template>
  <div class="endereco-form">
    <label>CEP</label>
    <input v-model="cep" v-mask="'#####-###'" @blur="onBlurCep" />

    <label>Endereço</label>
    <input v-model="endereco" />

    <label>Número</label>
    <input type="number" v-model="numero" min="1" />

    <label>Complemento</label>
    <input v-model="complemento" />
  </div>
</template>

<script>
import { buscarCep } from "@/api/cepService";
export default {
  name: "EnderecoForm",
  props: { value: Object },
  data() {
    return {
      cep: this.value?.cep || "",
      endereco: this.value?.endereco || "",
      numero: this.value?.numero || "",
      complemento: this.value?.complemento || "",
    };
  },
  methods: {
    async onBlurCep() {
      try {
        const data = await buscarCep(this.cep);
        this.endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        this.emitChange();
      } catch (e) {
        // ignora
      }
    },
    emitChange() {
      this.$emit("input", {
        cep: this.cep,
        endereco: this.endereco,
        numero: this.numero,
        complemento: this.complemento,
      });
    },
  },
  watch: {
    cep: "emitChange",
    endereco: "emitChange",
    numero: "emitChange",
    complemento: "emitChange",
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 8px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
</style>
