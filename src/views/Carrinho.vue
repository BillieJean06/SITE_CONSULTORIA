<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-4">
          <h2>Dados do Cliente</h2>

          <v-text-field
            label="Nome"
            v-model="nome"
            :rules="[rules.nome]"
            @input="onChange"
            outlined
            dense
          />
          <v-text-field
            label="Email"
            v-model="email"
            :rules="[rules.email]"
            @input="onChange"
            outlined
            dense
          />
          <v-text-field
            label="Telefone"
            v-model="telefone"
            v-mask="masks.telefone"
            :rules="[rules.telefone]"
            @input="onChange"
            outlined
            dense
          />

          <endereco-form v-model="enderecoObj" @input="onEnderecoChange" />
          <v-switch v-model="mostrarMapa" label="Mostrar mapa" />

          <div v-if="mostrarMapa" class="mt-4">
            <mapa-endereco :query="enderecoObjFull" mapId="map-carrinho" />
          </div>

          <v-row class="mt-4">
            <v-col>
              <v-btn
                color="primary"
                :loading="enviando"
                :disabled="!formValido"
                @click="enviarPedido"
                >Finalizar Pedido</v-btn
              >
            </v-col>

            <v-col>
              <v-btn
                color="green"
                @click="baixarPdf"
                :disabled="!carrinho.length"
                >Gerar PDF</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4">
          <h2>Resumo do Pedido</h2>
          <v-list two-line>
            <carrinho-item
              v-for="it in carrinho"
              :key="it.servico.id"
              :item="it"
              @remover="removerItem"
            />
          </v-list>

          <v-divider class="my-3" />
          <div class="text-right">
            <strong>Total: R$ {{ total.toFixed(2) }}</strong>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EnderecoForm from "@/components/EnderecoForm.vue";
import MapaEndereco from "@/components/MapaEndereco.vue";
import CarrinhoItem from "@/components/CarrinhoItem.vue";
import { masks } from "@/utils/masks";
import { validarEmail, validarNome, validarTelefone } from "@/utils/validators";
import { salvarState, carregarState } from "@/utils/localStorage";
import { gerarPdfPedido } from "@/utils/pdfGenerator";
import { enviarPedido } from "@/api/pedidoService";

export default {
  name: "CarrinhoView",
  components: { EnderecoForm, MapaEndereco, CarrinhoItem },
  data() {
    return {
      nome: "",
      email: "",
      telefone: "",
      enderecoObj: { cep: "", endereco: "", numero: "", complemento: "" },
      mostrarMapa: false,
      carrinho: JSON.parse(localStorage.getItem("carrinho") || "[]"),
      enviando: false,
      masks,
    };
  },
  computed: {
    total() {
      return this.carrinho.reduce(
        (s, i) => s + i.servico.preco * i.quantidade,
        0
      );
    },
    enderecoObjFull() {
      return `${this.enderecoObj.endereco} ${this.enderecoObj.numero}`.trim();
    },
    formValido() {
      return (
        !validarNome(this.nome) &&
        !validarEmail(this.email) &&
        !validarTelefone(this.telefone) &&
        this.carrinho.length > 0
      );
    },
    rules() {
      return {
        nome: (v) => (v && v.length >= 3) || "Nome inválido",
        email: (v) => !validarEmail(v) || "E-mail inválido",
        telefone: (v) => !validarTelefone(v) || "Telefone inválido",
      };
    },
  },
  watch: {
    nome() {
      this.salvar();
    },
    email() {
      this.salvar();
    },
    telefone() {
      this.salvar();
    },
    enderecoObj: {
      handler() {
        this.salvar();
      },
      deep: true,
    },
    carrinho: {
      handler() {
        localStorage.setItem("carrinho", JSON.stringify(this.carrinho));
      },
      deep: true,
    },
  },
  mounted() {
    const st = carregarState();
    if (st) {
      this.nome = st.nome || this.nome;
      this.email = st.email || this.email;
      this.telefone = st.telefone || this.telefone;
      if (st.enderecoObj) this.enderecoObj = st.enderecoObj;
    }
  },
  methods: {
    onChange() {
      this.salvar();
    },
    onEnderecoChange(obj) {
      this.enderecoObj = obj;
    },
    salvar() {
      salvarState({
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        enderecoObj: this.enderecoObj,
      });
    },
    removerItem(id) {
      this.carrinho = this.carrinho.filter((x) => x.servico.id !== id);
    },
    async baixarPdf() {
      try {
        await gerarPdfPedido({
          cliente: {
            nome: this.nome,
            email: this.email,
            telefone: this.telefone,
            endereco: `${this.enderecoObj.endereco}, ${this.enderecoObj.numero}`,
          },
          carrinho: this.carrinho,
          total: this.total,
        });
      } catch (e) {
        console.error(e);
        alert("Erro ao gerar PDF");
      }
    },
    async enviarPedido() {
      if (!this.formValido) return alert("Preencha os dados corretamente.");
      this.enviando = true;
      try {
        const payload = {
          nome: this.nome,
          email: this.email,
          telefone: this.telefone,
          endereco: `${this.enderecoObj.endereco}, ${this.enderecoObj.numero}`,
          pedido: this.carrinho.map((i) => ({
            nome: i.servico.titulo,
            preco: i.servico.preco,
            quantidade: i.quantidade,
          })),
          total: this.total,
        };
        const res = await enviarPedido(payload);
        if (res.status === "sucesso" || res.ok) {
          alert("Pedido enviado com sucesso");
          this.carrinho = [];
          localStorage.removeItem("carrinho");
        } else {
          alert("Erro ao enviar pedido");
        }
      } catch (e) {
        console.error(e);
        alert("Erro ao enviar pedido");
      } finally {
        this.enviando = false;
      }
    },
  },
};
</script>

<style scoped>
/* adicione estilos simples para cards/form */
.form-box {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
}
.item-linha {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
}
</style>
