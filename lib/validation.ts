export const validText = (value: string, min = 2, max = 120) =>
  value.trim().length >= min && value.trim().length <= max;
export function validPhone(value: string) {
  const normalized = value.trim().replace(/[\s()-]/g, '');
  if (!/^\+?\d+$/.test(normalized)) return false;
  const digits = normalized.replace(/^\+/, '').replace(/^00/, '');
  return digits.length >= 7 && digits.length <= 15 && !/^0+$/.test(digits);
}
export function contactErrors(contact: {
  name: string;
  phone: string;
  email: string;
}) {
  const errors: Record<string, string> = {};
  if (!validText(contact.name))
    errors.name = '2–120 karakterlik bir ad soyad girin.';
  if (!validPhone(contact.phone))
    errors.phone =
      'Ülke koduyla birlikte 7–15 rakam içeren geçerli bir telefon girin.';
  if (
    contact.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
  )
    errors.email = 'Geçerli bir e-posta girin.';
  return errors;
}
export function focusInvalid(form: HTMLFormElement) {
  requestAnimationFrame(() =>
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
  );
}
