<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import type { MenuItem } from 'primevue/menuitem'
import Menu from 'primevue/menu'
import { useDarkMode } from '@/composables/useDarkMode'
import { tools } from '@/tools'

const route = useRoute()
const { isDark, toggle } = useDarkMode()

const sidebarOpen = ref(false)

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)

const menuItems = computed<MenuItem[]>(() => [
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
  },
  ...tools.map((tool) => ({
    label: tool.name,
    icon: tool.icon,
    route: tool.route,
  })),
])

function isActive(item: MenuItem) {
  return item.route === route.path
}
</script>

<template>
  <div class="flex min-h-full">
    <aside
      class="fixed inset-y-0 left-0 z-30 flex w-[260px] max-w-[80vw] flex-shrink-0 -translate-x-full flex-col overflow-y-auto border-r border-[var(--p-content-border-color)] bg-[var(--p-content-background)] transition-transform duration-200 md:sticky md:top-0 md:h-screen md:w-[220px] md:max-w-none md:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
    >
      <div class="p-4 text-[1.1rem] font-semibold">My Utility</div>
      <Menu :model="menuItems" class="w-full border-none bg-transparent">
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            :to="item.route"
            v-bind="props.action"
            class="flex w-full items-center gap-2.5 px-4 py-3 text-inherit no-underline"
            :class="isActive(item) ? 'font-semibold text-[var(--p-primary-color)]' : ''"
          >
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </template>
      </Menu>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 md:hidden"
      @click="sidebarOpen = false"
    />

    <div class="flex w-full min-w-0 flex-grow flex-col">
      <header
        class="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--p-content-border-color)] bg-[var(--p-content-background)] px-3 py-2 md:justify-end md:px-4"
      >
        <Button
          icon="pi pi-bars"
          text
          rounded
          class="flex-shrink-0 md:hidden"
          aria-label="Toggle menu"
          @click="sidebarOpen = !sidebarOpen"
        />
        <span class="flex-grow font-semibold md:hidden">My Utility</span>
        <Button
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          text
          rounded
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        />
      </header>

      <main class="min-w-0 flex-grow p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
