<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>{{ item.servico.titulo }}</v-list-item-title>
      <v-list-item-subtitle>Qtd: {{ item.quantidade }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon @click="$emit('remover', item.servico.id)"><v-icon>mdi-delete</v-icon></v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default { name: "CarrinhoItem", props: { item: { type: Object, required: true } } };
</script>
