// Conteúdo do site: carregado da API, compartilhado pelo site e pelo painel do proprietário.
// O painel edita o mesmo estado (o site reflete na hora) e salva no servidor com debounce.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { mesclar } from '../content/defaults.js';
import { api } from '../lib/api.js';
import { agoraBrasilia, statusLoja, telefone, whatsapp, fmtH, lista } from '../lib/util.js';

const CACHE_KEY = 'odl-cache-v1';
const Ctx = createContext(null);

const lerCache = () => { try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return c && c.content ? c : null; } catch { return null; } };
export const temCacheLocal = () => !!lerCache();
const gravarCache = (content, version) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ content, version })); } catch { /* sem espaço / modo privado */ } };

// inicial: conteúdo já buscado antes de montar ({ content, version }) — usado quando a página veio pronta do build.
export function ContentProvider({ inicial, children }) {
  const cache = useMemo(() => inicial || lerCache(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [cms, setCms] = useState(() => (cache ? mesclar(cache.content) : null));
  const [now, setNow] = useState(Date.now());
  const [salvar, setSalvar] = useState({ status: 'ocioso', erro: '' }); // ocioso | pendente | salvando | salvo | erro | conflito | sessao
  const [undoN, setUndoN] = useState(0);
  const versao = useRef(cache ? cache.version : null);
  const atual = useRef(cms); atual.current = cms;
  const undo = useRef([]), ultimaEdicao = useRef({ chave: null, t: 0 });
  const timer = useRef(null), salvando = useRef(false), sujo = useRef(false);

  const carregar = useCallback(async (fresh) => {
    const r = await api.conteudo(fresh);
    const c = mesclar(r.content);
    versao.current = r.version; setCms(c); gravarCache(r.content, r.version);
    return c;
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    if (inicial) { gravarCache(inicial.content, inicial.version); return () => clearInterval(tick); }
    // Sem resposta em 5s (ou erro), mostra o conteúdo padrão para o visitante não ficar esperando.
    const t = setTimeout(() => setCms(c => c || mesclar(null)), 5000);
    carregar(false).catch(() => setCms(c => c || mesclar(null))).finally(() => clearTimeout(t));
    return () => { clearTimeout(t); clearInterval(tick); };
  }, [carregar]);

  const enviar = useCallback(async (force = false) => {
    if (salvando.current) return;
    salvando.current = true; sujo.current = false;
    setSalvar({ status: 'salvando', erro: '' });
    const conteudo = atual.current;
    let parar = false;
    try {
      const r = await api.salvar(conteudo, versao.current, force);
      versao.current = r.version; gravarCache(conteudo, r.version);
      setSalvar({ status: sujo.current ? 'pendente' : 'salvo', erro: '' });
    } catch (e) {
      sujo.current = true;
      // Recusa do servidor (4xx: dado inválido, conflito, sessão): não insiste sozinho; espera nova edição ou "tentar de novo".
      parar = e.status >= 400 && e.status < 500;
      setSalvar({ status: e.status === 409 ? 'conflito' : e.status === 401 ? 'sessao' : 'erro', erro: e.message });
    } finally {
      salvando.current = false;
      if (sujo.current && !parar && !['conflito', 'sessao'].includes(salvarRef.current)) agendar();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const salvarRef = useRef('ocioso'); salvarRef.current = salvar.status;
  const agendar = useCallback((ms = 2500) => { clearTimeout(timer.current); timer.current = setTimeout(() => enviar(false), ms); }, [enviar]);

  // Aplica uma alteração: fn recebe um rascunho (cópia) e pode mutá-lo.
  // Edições seguidas no mesmo campo viram um único passo de "desfazer".
  const editar = useCallback((fn, chave) => {
    const antes = atual.current;
    const rasc = structuredClone(antes);
    fn(rasc);
    rasc.meta = { ...(rasc.meta || {}), atualizadoEm: new Date().toISOString() };
    const agora = Date.now();
    if (!(chave && ultimaEdicao.current.chave === chave && agora - ultimaEdicao.current.t < 1500)) {
      undo.current = [...undo.current, antes].slice(-40); setUndoN(undo.current.length);
    }
    ultimaEdicao.current = { chave, t: agora };
    atual.current = rasc; setCms(rasc);
    sujo.current = true; setSalvar(s => (s.status === 'conflito' || s.status === 'sessao' ? s : { status: 'pendente', erro: '' }));
    if (salvarRef.current !== 'conflito' && salvarRef.current !== 'sessao') agendar();
  }, [agendar]);

  const desfazer = useCallback(() => {
    const prev = undo.current.pop(); if (!prev) return false;
    setUndoN(undo.current.length); ultimaEdicao.current = { chave: null, t: 0 };
    atual.current = prev; setCms(prev); sujo.current = true; setSalvar({ status: 'pendente', erro: '' }); agendar(200);
    return true;
  }, [agendar]);

  // Substitui todo o conteúdo (importar backup, restaurar padrão).
  const substituir = useCallback((novo) => editar(d => { Object.keys(d).forEach(k => delete d[k]); Object.assign(d, mesclar(novo)); }), [editar]);

  // Após restaurar uma versão no servidor.
  const aplicarVersao = useCallback((content, version) => {
    const c = mesclar(content); versao.current = version; atual.current = c; setCms(c); gravarCache(content, version);
    undo.current = []; setUndoN(0); sujo.current = false; setSalvar({ status: 'salvo', erro: '' });
  }, []);

  const recarregar = useCallback(async () => {
    clearTimeout(timer.current); sujo.current = false; undo.current = []; setUndoN(0);
    await carregar(true); setSalvar({ status: 'ocioso', erro: '' });
  }, [carregar]);

  const sobrescrever = useCallback(() => enviar(true), [enviar]);
  const tentarDeNovo = useCallback(() => { setSalvar({ status: 'pendente', erro: '' }); salvarRef.current = 'pendente'; agendar(0); }, [agendar]);

  // Avisa antes de fechar a aba com alterações ainda não salvas.
  useEffect(() => {
    const f = (e) => { if (sujo.current || salvando.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', f);
    return () => window.removeEventListener('beforeunload', f);
  }, []);

  const valor = useMemo(() => ({ cms, now, editar, desfazer, podeDesfazer: undoN > 0, substituir, aplicarVersao, recarregar, sobrescrever, tentarDeNovo, salvar }), [cms, now, editar, desfazer, undoN, substituir, aplicarVersao, recarregar, sobrescrever, tentarDeNovo, salvar]);
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);

// Valores derivados usados em várias páginas.
export function useSite() {
  const { cms, now } = useContent();
  return useMemo(() => {
    const info = cms.info;
    const wa = whatsapp(info);
    const end = `${info.endereco}, ${info.bairroCidade}, ${info.cep}`;
    // No HTML gerado no build, "aberto agora" ficaria congelado: mostra só o horário.
    const st = typeof window === 'undefined'
      ? { aberto: false, texto: `seg a sex ${fmtH(info.abreSemana)}–${fmtH(info.fechaSemana)} · sáb ${fmtH(info.abreSabado)}–${fmtH(info.fechaSabado)}`, cor: '#c9c6c1', hojeIso: agoraBrasilia(now).iso }
      : statusLoja(info, cms.fechamentos, now);
    return {
      cms, info, wa, tel: telefone(info), status: st, hojeIso: st.hojeIso,
      horarioSemana: `${fmtH(info.abreSemana)} às ${fmtH(info.fechaSemana)}`,
      horarioSabado: `${fmtH(info.abreSabado)} às ${fmtH(info.fechaSabado)}`,
      mapaLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(end),
      mapaEmbed: 'https://www.google.com/maps?q=' + encodeURIComponent(end) + '&output=embed',
      googleLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Ótica Digital Look ' + info.bairroCidade),
      igLink: 'https://www.instagram.com/' + String(info.instagram || '').replace(/^@/, '') + '/',
      selos: lista(info.selos),
      animar: info.animacoes !== false,
    };
  }, [cms, now]);
}
