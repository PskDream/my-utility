import generatePayload from 'promptpay-qr'

/**
 * Accepts PromptPay IDs typed with spaces/dashes (e.g. "081-234-5678")
 * since generatePayload expects digits only.
 */
export function normalizePromptPayId(rawId: string): string {
  return rawId.replace(/[\s-]/g, '')
}

export function isValidPromptPayId(rawId: string): boolean {
  const id = normalizePromptPayId(rawId)
  return /^\d{10}$/.test(id) || /^\d{13}$/.test(id) || /^\d{15}$/.test(id)
}

export function buildPromptPayPayload(rawId: string, amount?: number): string {
  const id = normalizePromptPayId(rawId)
  return generatePayload(id, amount ? { amount } : {})
}
