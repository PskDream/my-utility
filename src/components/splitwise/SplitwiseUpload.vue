<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'

const emit = defineEmits<{ load: [file: File] }>()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function pick(files: FileList | null | undefined) {
  const file = files?.[0]
  if (file) emit('load', file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  pick(e.dataTransfer?.files)
}
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors"
    :class="
      dragging
        ? 'border-[var(--p-primary-color)] bg-[var(--p-content-hover-background)]'
        : 'border-[var(--p-content-border-color)]'
    "
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <span class="pi pi-file-import text-3xl text-[var(--p-text-muted-color)]" />
    <p class="font-medium">เลือกไฟล์ CSV ที่ export จาก Splitwise</p>
    <p class="max-w-md text-[0.85rem] text-[var(--p-text-muted-color)]">
      ลากไฟล์มาวางที่นี่ หรือกดปุ่มด้านล่าง ไฟล์ถูกประมวลผลในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการอัปโหลดไปที่ไหน
    </p>
    <Button label="เลือกไฟล์" icon="pi pi-upload" @click="input?.click()" />
    <input
      ref="input"
      type="file"
      accept=".csv,text/csv"
      class="hidden"
      @change="pick(($event.target as HTMLInputElement).files)"
    />
  </div>
</template>
