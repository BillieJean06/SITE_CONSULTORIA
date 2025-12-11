// consulta CEP via ViaCEP
export async function buscarCep(cepRaw) {
  const cep = String(cepRaw).replace(/\D/g, "");
  if (!cep || cep.length !== 8) throw new Error("CEP inválido");
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado");
  return {
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    localidade: data.localidade || "",
    uf: data.uf || "",
    raw: data,
  };
}
