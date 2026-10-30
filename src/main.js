import { createApp } from 'vue'

import App from './App.vue'
import Icon from '@/components/Icon.vue'
import { store } from '@/store'

import '@/assets/styles/main.scss'

createApp(App)
  .use(store)
  .component('mc-icon', Icon)
  .mount('#app')
