const KEY = "consultoria_site_state";

export function salvarState(obj) {
  try {
    localStorage.setItem(KEY, JSON.stringify(obj));
  } catch (e) {
    // ignore
  }
}

export function carregarState() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch (e) {
    return {};
  }
}

export function limparState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // ...
  }
}
