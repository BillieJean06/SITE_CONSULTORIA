<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" sm="4">
        <v-text-field
          label="CEP"
          v-model="cep"
          @blur="buscarCep"
          placeholder="000.00-000"
        />
      </v-col>

      <v-col cols="12" sm="8">
        <v-text-field label="Rua" v-model="rua" />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field label="Bairro" v-model="bairro" />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field label="Cidade" v-model="cidade" />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field label="Estado" v-model="estado" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CEPAddressForm",

  data() {
    return {
      cep: "",
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
    };
  },

  methods: {
    async buscarCep() {
      const cleaned = this.cep.replace(/\D/g, "");

      if (cleaned.length !== 8) return;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await res.json();

        if (data.erro) {
          console.log("CEP não encontrado");
          return;
        }

        this.rua = data.logradouro || "";
        this.bairro = data.bairro || "";
        this.cidade = data.localidade || "";
        this.estado = data.uf || "";
      } catch (e) {
        console.error("Erro ao buscar CEP:", e);
      }
    },
  },
};
</script>

<style scoped></style>
