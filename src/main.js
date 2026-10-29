import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import Icon from '@/components/Icon.vue'
import messages from '@/locales'
import { DEFAULT_LOCALE, datetimeFormats, numberFormats } from '@/services/locales'
import { store } from '@/store'

import '@/assets/styles/main.scss'

const i18n = createI18n({
  legacy: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
  datetimeFormats,
  numberFormats
})

createApp(App)
  .use(store)
  .use(i18n)
  .component('mc-icon', Icon)
  .mount('#app')
