import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'

import { vInfinteScroll } from './directives'

import './assets/main.css'
import './assets/global.less'



const app = createApp(App)

app.use(ElementPlus)

app.directive('InfinteScroll', vInfinteScroll)

app.use(createPinia())
app.use(router)

app.mount('#app')
