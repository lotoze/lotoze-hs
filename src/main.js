import Vue from 'vue'
import App from './App.vue'


import vueHS from "./lib/index.js";
Vue.use(vueHS);

new Vue({
  el: '#app',
  render: h => h(App)
})
