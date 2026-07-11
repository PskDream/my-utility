<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink
    to="/"
    class="mb-3 inline-flex items-center gap-1.5 text-[0.9rem] text-inherit no-underline md:hidden"
  >
    <span class="pi pi-arrow-left" />
    <span>กลับหน้าหลัก</span>
  </RouterLink>
</template>
