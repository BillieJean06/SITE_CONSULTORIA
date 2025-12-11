export function validarEmail(email) {
  if (!email) return "O e-mail é obrigatório.";
  const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return r.test(email) ? null : "Digite um e-mail válido.";
}

export function validarNome(nome) {
  if (!nome) return "O nome é obrigatório.";
  return nome.length >= 3 ? null : "O nome deve ter ao menos 3 caracteres.";
}

export function validarTelefone(tel) {
  if (!tel) return "O telefone é obrigatório.";
  const r = /^\(\d{2}\) \d{4,5}-?\d{4}$/;
  return r.test(tel) ? null : "Formato inválido. Use (12) 12345-6789.";
}

export function validarCep(cep) {
  if (!cep) return "O CEP é obrigatório.";
  const r = /^\d{5}-\d{3}$/;
  return r.test(cep) ? null : "CEP inválido. Use 000.00-000.";
}
