// Cliente da API do site.
export class ApiErro extends Error { constructor(status, msg, body) { super(msg); this.status = status; this.body = body; } }

async function req(method, url, body) {
  const r = await fetch(url, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: { 'X-ODL': '1', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null; try { data = await r.json(); } catch { /* sem corpo */ }
  if (!r.ok) throw new ApiErro(r.status, (data && data.error) || 'Falha de conexão. Tente novamente.', data);
  return data;
}

export const api = {
  conteudo: (fresh) => req('GET', '/api/content' + (fresh ? '?fresh=' + Date.now() : '')),
  salvar: (content, baseVersion, force) => req('PUT', '/api/content', { content, baseVersion, force }),
  sessao: () => req('GET', '/api/session'),
  entrar: (senha, lembrar) => req('POST', '/api/login', { senha, lembrar }),
  sair: (todos) => req('POST', '/api/logout', todos ? { todos: true } : {}),
  trocarSenha: (atual, nova) => req('POST', '/api/password', { atual, nova }),
  enviarFoto: (dataUrl) => req('POST', '/api/upload', { dataUrl }),
  historico: () => req('GET', '/api/history'),
  restaurarVersao: (id) => req('POST', '/api/history', { id }),
  limparFotos: (historico) => req('POST', '/api/limpar-fotos', { historico: !!historico }),
  publicar: () => req('POST', '/api/publicar', {}),
};
