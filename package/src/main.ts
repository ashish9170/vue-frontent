import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import vuetify from './plugins/vuetify'
import '@/scss/style.scss'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import VueApexCharts from 'vue3-apexcharts'
import VueTablerIcons from 'vue-tabler-icons'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { loadConfig } from './configLoader'   // ✅ use new file
import { loadRuntimeConfig } from '@/config/runtimeStore.js';

async function bootstrap() {
    const config = await loadConfig()
    await loadRuntimeConfig();

    console.log('Loaded config:', config)

    const app = createApp(App)

    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)

    app.provide('config', config) // available via inject()

    app.use(pinia)
    app.use(router)
    app.use(PerfectScrollbar)
    app.use(VueTablerIcons)
    app.use(VueApexCharts)
    app.use(vuetify)

    app.mount('#app')
}

bootstrap()
