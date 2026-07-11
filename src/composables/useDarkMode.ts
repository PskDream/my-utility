import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'my-utility:dark-mode'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const stored = localStorage.getItem(STORAGE_KEY)
const isDark = ref(stored ? stored === 'true' : prefersDark)

watchEffect(() => {
  document.documentElement.classList.toggle('my-app-dark', isDark.value)
  localStorage.setItem(STORAGE_KEY, String(isDark.value))
})

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
