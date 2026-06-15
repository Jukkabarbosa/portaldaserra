export const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export const km = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n) + " km";

export const onlyDigits = (s: string) => (s ?? "").replace(/\D/g, "");

export function whatsappLink(phone: string, message: string) {
  const num = onlyDigits(phone);
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
