import './styles/main.scss'
import { createApp } from 'vue'
import App from './App.vue'
import  router  from './router'
import store from './store';
import vuetify from './plugins/vuetify'

const app = createApp(App)

const baseURL = import.meta.env.VITE_BASE_URL;
console.log('Base URL:', baseURL);

app.use(router)
app.use(store);
app.use(vuetify)

app.mount('#app')