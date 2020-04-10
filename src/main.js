import Vue from 'vue'
import App from './App.vue'
import "./lib/assets/font/iconfont.css";
import "./lib/assets/style/public.css";
import "loaders.css";
import vcolorpicker from 'vcolorpicker';
Vue.use(vcolorpicker);
new Vue({
  el: '#app',
  render: h => h(App)
})
