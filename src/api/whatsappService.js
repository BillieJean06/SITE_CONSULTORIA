// util para montar link de WhatsApp
export function montarLinkWhats(numero, mensagem) {
  const num = String(numero).replace(/\D/g, "");
  const text = encodeURIComponent(mensagem);
  return `https://wa.me/${num}?text=${text}`;
}
