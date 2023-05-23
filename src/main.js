import { createApp } from 'vue'
import App from './App.vue'
import * as labs from 'vuetify/labs/components'

//import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from "axios";
import router from './router'
import { Icon } from '@iconify/vue';

//import { fa } from "vuetify/iconsets/fa";
//import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";


loadFonts()

const app = createApp(App);

// set API and add to global variable
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

app.config.globalProperties.$api = api;

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
//import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  icons: {
    iconfont: 'mdi', // Choose your icon font
    values: {
      customIcon: { // Define your custom icon
        component: Icon,
        props: {
          icon: 'mdi-home',
        },
      },
    },
  },
  components: {
    ...labs,
  },
  directives,
});

// use all component
app.use(router)
app.use(vuetify)
app.use(Icon)
// app.use(BootstrapVue)
// app.use(IconsPlugin)

app.mount('#app')
