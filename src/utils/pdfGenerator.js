import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function gerarPdfPedido({ cliente, carrinho, total }) {
  if (!cliente || !carrinho) {
    console.error("Cliente ou carrinho não definidos");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margem = 40;
  let y = 50;
  const alturaPagina = doc.internal.pageSize.getHeight() - 80;

  const pedidoId =
    Math.random().toString(36).substring(2, 7).toUpperCase() +
    "-" +
    Math.floor(Math.random() * 9000 + 1000);

  const dataHora = new Date().toLocaleString("pt-BR");

  // Garantindo que total seja um número
  const totalPedido = Number(total || 0);

  const mensagem = encodeURIComponent(
    `Pedido ${pedidoId}\nTotal: R$ ${totalPedido.toFixed(2)}`
  );

  const telefone = cliente.telefone ? cliente.telefone.replace(/\D/g, "") : "";
  const linkWhats = `https://wa.me/${telefone}?text=${mensagem}`;

  const qrImage = await QRCode.toDataURL(linkWhats, { width: 180 });

  // Título
  doc.setFontSize(18);
  doc.text("Resumo do Pedido", margem, y);
  y += 20;

  doc.setFontSize(11);
  doc.text(`Pedido: ${pedidoId}`, margem, y);
  doc.text(`Data: ${dataHora}`, margem + 300, y);
  y += 20;

  doc.setLineWidth(0.5);
  doc.line(margem, y, 550, y);
  y += 18;

  // Dados do cliente
  doc.text(`Nome: ${cliente.nome || ""}`, margem, y);
  y += 14;
  doc.text(`Email: ${cliente.email || ""}`, margem, y);
  y += 14;
  doc.text(`Telefone: ${cliente.telefone || ""}`, margem, y);
  y += 14;
  doc.text(`Endereço: ${cliente.endereco || ""}`, margem, y);
  y += 20;

  // Itens
  doc.setFontSize(13);
  doc.text("Itens:", margem, y);
  y += 18;
  doc.setFontSize(11);

  carrinho.forEach((item, index) => {
    const titulo = item?.servico?.titulo || "Sem título";
    const quantidade = Number(item?.quantidade || 0);
    const preco = Number(item?.servico?.preco || 0);

    if (y > alturaPagina) {
      doc.addPage();
      y = 50;
    }

    doc.text(`${index + 1}. ${titulo}`, margem, y);
    doc.text(`Qtd: ${quantidade}`, margem + 300, y);
    doc.text(`R$ ${preco.toFixed(2)}`, margem + 420, y);
    y += 16;
  });

  y += 12;
  doc.line(margem, y, 550, y);
  y += 18;

  doc.setFontSize(13);
  doc.text(`Total: R$ ${totalPedido.toFixed(2)}`, margem, y);

  // QR Code (posição fixa)
  doc.addImage(qrImage, "PNG", 420, 300, 120, 120);

  doc.save(`pedido-${pedidoId}.pdf`);
}
