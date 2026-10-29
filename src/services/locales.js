import { get, set } from '@/services/storage'

export const LOCALES = ['en-US', 'fr-FR']
export const DEFAULT_LOCALE = LOCALES[0]

const KEY_LOCALE = 'locale'

const DATETIME_FORMATS = {
  short: { year: 'numeric', month: 'short', day: 'numeric' },
  long: { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric' }
}

const NUMBER_FORMATS = {
  currency: { style: 'currency', currency: 'EUR', currencyDisplay: 'symbol' },
  percent: { style: 'percent' }
}

export const datetimeFormats = Object.fromEntries(LOCALES.map(locale => [locale, DATETIME_FORMATS]))
export const numberFormats = Object.fromEntries(LOCALES.map(locale => [locale, NUMBER_FORMATS]))

export function loadLocale () {
  const browserLocale = LOCALES.find(locale => navigator.language.startsWith(locale.slice(0, 2)))
  const locale = get(KEY_LOCALE, browserLocale || DEFAULT_LOCALE)
  return LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

export function saveLocale (locale) {
  set(KEY_LOCALE, locale || DEFAULT_LOCALE)
}
