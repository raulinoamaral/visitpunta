/** Photo credit as shown over the image: "© Posto 5" (adds the sign when missing) */
export function formatCredit(credit?: string | null): string {
  if (!credit) return ''
  return credit.startsWith('©') ? credit : `© ${credit}`
}
