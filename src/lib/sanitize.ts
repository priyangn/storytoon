/** Escape user text before prompts / UI. Never treat as instructions. */
export function sanitizeText(input: string, maxLen = 80): string {
  return input
    .replace(/[<>{}[\]\\`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function isSafeDedication(text: string): boolean {
  const blocked =
    /\b(kill|hate|sex|nude|weapon|blood|suicide|violence)\b/i;
  return !blocked.test(text);
}
