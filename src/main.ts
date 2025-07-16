import './assets/main.css'

import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()

createApp(App)
.use(ElementPlus)
.use(pinia)
.mount('#app')
