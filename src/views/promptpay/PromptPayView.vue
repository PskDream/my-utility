<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BackHomeLink from '@/components/BackHomeLink.vue'
import PromptPayForm from '@/components/promptpay/PromptPayForm.vue'
import PromptPayQrCode from '@/components/promptpay/PromptPayQrCode.vue'
import { buildPromptPayPayload, isValidPromptPayId } from '@/utils/promptpay'

const STORAGE_KEY = 'my-utility:promptpay-id'

const promptPayId = ref(localStorage.getItem(STORAGE_KEY) ?? '')
const amount = ref<number | null>(null)

watch(promptPayId, (value) => {
  if (isValidPromptPayId(value)) {
    localStorage.setItem(STORAGE_KEY, value)
  } else if (!value) {
    localStorage.removeItem(STORAGE_KEY)
  }
})

const PLACEHOLDER_PAYLOAD = buildPromptPayPayload('0000000000')

const payload = computed(() => {
  if (!isValidPromptPayId(promptPayId.value)) return ''
  return buildPromptPayPayload(promptPayId.value, amount.value ?? undefined)
})

const isPlaceholder = computed(() => !payload.value)
const displayPayload = computed(() => payload.value || PLACEHOLDER_PAYLOAD)
</script>

<template>
  <div>
    <BackHomeLink />
    <h1 class="mb-4 text-2xl font-bold">PromptPay QR Generator</h1>
    <div class="flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:gap-8">
      <PromptPayForm v-model:prompt-pay-id="promptPayId" v-model:amount="amount" />
      <PromptPayQrCode
        class="order-first sm:order-none"
        :payload="displayPayload"
        :is-placeholder="isPlaceholder"
      />
    </div>
  </div>
</template>
