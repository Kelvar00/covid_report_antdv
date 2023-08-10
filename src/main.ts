import './assets/main.css'


import { createApp } from 'vue'
import { Row, Col, Statistic, Menu, Input, Layout, ConfigProvider, Steps } from 'ant-design-vue'
import EChartUtils from './util/echart_util'
import Mitt from './util/mitt_util'
import 'ant-design-vue/dist/reset.css'
import 'vue-fullpage.js/dist/style.css'
import App from './App.vue'

const app = createApp(App)

app
  .use(Row)
  .use(Col)
  .use(Statistic)
  .use(Menu)
  .use(Input)
  .use(Layout)
  .use(ConfigProvider)
  .use(Steps)
  .use(EChartUtils)
  .use(Mitt)
  .mount('#app')
