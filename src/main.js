import Vue from 'vue'
import App from './App.vue'
import "./lib/assets/font/iconfont.css";
import "loaders.css";


import vcolorpicker from 'vcolorpicker';
Vue.use(vcolorpicker);

import vueHS from "./lib/index.js";
Vue.use(vueHS);

new Vue({
  el: '#app',
  render: h => h(App)
})
