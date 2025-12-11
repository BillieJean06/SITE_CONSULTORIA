import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueTheMask from "vue-the-mask";
import "leaflet/dist/leaflet.css";

Vue.use(VueTheMask);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
