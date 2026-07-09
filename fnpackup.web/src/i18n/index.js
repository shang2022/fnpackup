import { createI18n } from 'vue-i18n'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'
import zhCnElement from 'element-plus/es/locale/lang/zh-cn'
import enElement from 'element-plus/es/locale/lang/en'

const normalizeLocale = (locale) => `${locale || ''}`.toLowerCase()

export const resolveBrowserLocale = () => {
  const languages = typeof navigator === 'undefined'
    ? []
    : (navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language])

  return languages.some((language) => normalizeLocale(language).startsWith('zh')) ? 'zh-CN' : 'en-US'
}

export const currentLocale = resolveBrowserLocale()

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: currentLocale,
  fallbackLocale: 'en-US',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export const elementLocale = currentLocale === 'zh-CN' ? zhCnElement : enElement

export const t = (key, values) => i18n.global.t(key, values)
export const te = (key) => i18n.global.te(key)
export const tm = (key) => i18n.global.tm(key)
