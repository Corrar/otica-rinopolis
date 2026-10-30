// Conteúdo do site: carregado da API, compartilhado pelo site e pelo painel do proprietário.
// O painel edita o mesmo estado (o site reflete na hora) e salva no servidor com debounce.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { mesclar } from '../content/defaults.js';
import { api } from '../lib/api.js';
import { googleValido } from '../lib/validar.js';
import { agoraBrasilia, empresa, statusLoja, telefone, whatsapp, horarios, lista } from '../lib/util.js';
import { parteDe } from '../lib/versoes.js';

const CACHE_KEY = 'odl-cache-v1';
const Ctx = createContext(null);

const lerCache = () => { try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return c && c.content ? c : null; } catch { return null; } };
const gravarCache = (content, version) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ content, version })); } catch { /* sem espaço / modo privado */ } };
// Usado pela rede de segurança (ErroGeral e main.jsx): uma cópia local com dados ruins não pode travar as próximas visitas.
export const limparCache = () => { try { localStorage.removeItem(CACHE_KEY); } catch { /* modo privado */ } };

// inicial: conteúdo com que a página foi gerada no build ({ content, version }, embutido no HTML em #odl-inicial).
// Ele tem prioridade sobre a cópia local antiga; a versão atual é conferida em segundo plano.
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
  // Partes do site editadas desde o último salvamento (resumo da versão no histórico).
  const partes = useRef(new Set());

  const carregar = useCallback(async (fresh) => {
    const r = await api.conteudo(fresh);
    const c = mesclar(r.content);
    versao.current = r.version; setCms(c); gravarCache(r.content, r.version);
    return c;
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60000);
    if (inicial) {
      gravarCache(inicial.content, inicial.version);
      // Conteúdo salvo no painel depois do build: troca só se a versão mudou e ninguém começou a editar nesta aba.
      // Resposta sem versão (armazenamento indisponível) não troca o conteúdo do build pelo padrão.
      let ativo = true;
      api.conteudo(false).then(r => {
        if (!ativo || !r || !r.version || r.version === inicial.version || versao.current !== inicial.version || sujo.current || undo.current.length) return;
        const c = mesclar(r.content);
        versao.current = r.version; atual.current = c; setCms(c); gravarCache(r.content, r.version);
      }, () => { /* sem conexão: fica o conteúdo do build */ });
      return () => { ativo = false; clearInterval(tick); };
    }
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
    const enviadas = [...partes.current]; partes.current = new Set();
    let parar = false;
    try {
      const r = await api.salvar(conteudo, versao.current, force, enviadas);
      versao.current = r.version; gravarCache(conteudo, r.version);
      setSalvar({ status: sujo.current ? 'pendente' : 'salvo', erro: '' });
    } catch (e) {
      sujo.current = true; enviadas.forEach(p => partes.current.add(p));
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
  // Edições seguidas no mesmo campo (chave) viram um único passo de "desfazer".
  // parte: parte do site para o resumo da versão (sem ela, vem da chave; sem as duas, "conteúdo todo").
  const editar = useCallback((fn, chave, parte) => {
    const antes = atual.current;
    partes.current.add(parte || (chave ? parteDe(chave) : 'tudo'));
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
    setUndoN(undo.current.length); ultimaEdicao.current = { chave: null, t: 0 }; partes.current.add('desfeito');
    atual.current = prev; setCms(prev); sujo.current = true; setSalvar({ status: 'pendente', erro: '' }); agendar(200);
    return true;
  }, [agendar]);

  // Substitui todo o conteúdo (importar backup, restaurar padrão).
  const substituir = useCallback((novo) => editar(d => { Object.keys(d).forEach(k => delete d[k]); Object.assign(d, mesclar(novo)); }), [editar]);

  // Após restaurar uma versão no servidor.
  const aplicarVersao = useCallback((content, version) => {
    const c = mesclar(content); versao.current = version; atual.current = c; setCms(c); gravarCache(content, version);
    undo.current = []; setUndoN(0); sujo.current = false; partes.current = new Set(); setSalvar({ status: 'salvo', erro: '' });
  }, []);

  // Depois de apagar fotos e versões antigas no servidor: um "desfazer" voltaria a apontar para fotos que não existem mais.
  const limparDesfazer = useCallback(() => { undo.current = []; setUndoN(0); ultimaEdicao.current = { chave: null, t: 0 }; }, []);

  const recarregar = useCallback(async () => {
    clearTimeout(timer.current); sujo.current = false; undo.current = []; setUndoN(0); partes.current = new Set();
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

  const valor = useMemo(() => ({ cms, now, editar, desfazer, podeDesfazer: undoN > 0, limparDesfazer, substituir, aplicarVersao, recarregar, sobrescrever, tentarDeNovo, salvar }), [cms, now, editar, desfazer, undoN, limparDesfazer, substituir, aplicarVersao, recarregar, sobrescrever, tentarDeNovo, salvar]);
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
    const h = horarios(info);
    // No HTML gerado no build, "aberto agora" ficaria congelado: mostra só o horário (null sem horário confirmado).
    const st = typeof window === 'undefined'
      ? (h.semana ? { aberto: false, texto: `seg a sex ${h.semana.replace(' às ', '–')} · sáb ${h.sabado ? h.sabado.replace(' às ', '–') : 'fechado'}`, cor: '#c9c6c1' } : null)
      : statusLoja(info, cms.fechamentos, now);
    // Link das avaliações: só o do Perfil da Empresa informado no painel (uma busca genérica pode cair em outra ótica).
    const google = String(info.googleAvaliacoes || '').trim();
    return {
      cms, info, wa, tel: telefone(info), emp: empresa(info), status: st, hojeIso: agoraBrasilia(now).iso,
      horarioSemana: h.semana, horarioSabado: h.sabado,
      mapaLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(end),
      mapaEmbed: 'https://www.google.com/maps?q=' + encodeURIComponent(end) + '&output=embed',
      googleAvaliacoes: google && googleValido(google) ? google : '',
      igLink: 'https://www.instagram.com/' + String(info.instagram || '').replace(/^@/, '') + '/',
      selos: lista(info.selos),
      animar: info.animacoes !== false,
    };
  }, [cms, now]);
}
