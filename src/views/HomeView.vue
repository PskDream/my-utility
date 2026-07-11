<script setup lang="ts">
import Card from 'primevue/card'
import { tools } from '@/tools'
</script>

<template>
  <div
    class="grid grid-cols-1 gap-3 min-[480px]:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] min-[480px]:gap-4"
  >
    <router-link
      v-for="tool in tools"
      :key="tool.id"
      :to="tool.route"
      class="text-inherit no-underline"
    >
      <Card>
        <template #title>
          <span :class="tool.icon" class="mr-2" />
          {{ tool.name }}
        </template>
        <template #content>
          <p>{{ tool.description }}</p>
        </template>
      </Card>
    </router-link>
  </div>
</template>
