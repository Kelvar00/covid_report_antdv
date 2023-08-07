import './assets/main.css'


import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import 'vue-fullpage.js/dist/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(Antd).mount('#app');
