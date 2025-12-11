// service simples para enviar pedido ao backend (localhost)
export async function enviarPedido(payload) {
  const res = await fetch("http://localhost:3000/api/enviar-pedido", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Erro ao enviar pedido");
  }
  return res.json();
}
