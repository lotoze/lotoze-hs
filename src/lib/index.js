import LotozeHS from "./components/Lotoze-HS";

const index = {
    install: function (Vue) {
      Vue.component(LotozeHS.name, LotozeHS);
    }
}

if(typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(index);
}

export default index;
