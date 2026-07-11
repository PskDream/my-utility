<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { isValidPromptPayId } from '@/utils/promptpay'

const promptPayId = defineModel<string>('promptPayId', { required: true })
const amount = defineModel<number | null>('amount', { required: true })

function idError() {
  if (!promptPayId.value) return ''
  return isValidPromptPayId(promptPayId.value)
    ? ''
    : 'ระบุเบอร์โทร (10 หลัก), เลขบัตรประชาชน/ภาษี (13 หลัก) หรือ e-Wallet ID (15 หลัก)'
}
</script>

<template>
  <div class="flex w-full flex-col gap-4 sm:max-w-[320px]">
    <div class="flex flex-col gap-1.5">
      <label for="promptpay-id">หมายเลขพร้อมเพย์</label>
      <InputText
        id="promptpay-id"
        v-model="promptPayId"
        placeholder="เช่น 081-234-5678"
        :invalid="!!idError()"
        inputmode="numeric"
        pattern="[0-9-\s]*"
        fluid
      />
      <small v-if="idError()" class="text-[var(--p-red-500,#e24c4c)]">{{ idError() }}</small>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="amount">จำนวนเงิน (บาท)</label>
      <InputNumber
        id="amount"
        v-model="amount"
        mode="currency"
        currency="THB"
        locale="th-TH"
        :min="0"
        placeholder="ไม่ระบุ = ให้ผู้จ่ายกรอกเอง"
        fluid
      />
    </div>
  </div>
</template>
