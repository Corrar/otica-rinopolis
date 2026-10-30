import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { aviso } from '../lib/toast.js';
import { lerImagem, num2 } from '../lib/util.js';
import { PADRAO } from '../content/defaults.js';
import { problemaNasListas } from '../lib/validar.js';
import { useContent } from '../state/content.jsx';

const card = 'adm-card';
const tituloCard = { font: "500 16px 'Outfit',sans-serif" };
const textoCard = { font: "400 14px/1.6 'DM Sans',sans-serif", color: 'var(--muted)' };
const fmtQuando = (iso) => { const d = new Date(iso); return isNaN(d) ? iso : `${num2(d.getDate())}/${num2(d.getMonth() + 1)}/${d.getFullYear()} às ${num2(d.getHours())}:${num2(d.getMinutes())}`; };

// Data do último backup exportado neste aparelho (só uma lembrança local).
const CHAVE_BACKUP = 'odl-ultimo-backup';
const lerUltimoBackup = () => { try { return localStorage.getItem(CHAVE_BACKUP) || ''; } catch { return ''; } };
const gravarUltimoBackup = (iso) => { try { localStorage.setItem(CHAVE_BACKUP, iso); } catch { /* modo privado */ } };

// "data:image/...;base64,..." → Blob (sem fetch, que a política de segurança do site bloqueia para data:).
function dataUrlParaBlob(u) {
  const [cab, dados] = u.split(',');
  const tipo = (/^data:([^;,]+)/.exec(cab) || [])[1] || 'image/jpeg';
  const bin = atob(dados || ''); const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: tipo });
}

// Backups do protótipo guardavam fotos embutidas (data:...). Reduz cada uma como no botão de foto, envia e troca pela URL.
async function enviarFotosEmbutidas(obj, progresso) {
  const achados = [];
  const andar = (o) => { if (Array.isArray(o)) o.forEach((v, i) => (typeof v === 'string' && v.startsWith('data:image/') ? achados.push([o, i]) : andar(v))); else if (o && typeof o === 'object') Object.keys(o).forEach(k => (typeof o[k] === 'string' && o[k].startsWith('data:image/') ? achados.push([o, k]) : andar(o[k]))); };
  andar(obj);
  for (let n = 0; n < achados.length; n++) {
    const [o, k] = achados[n]; progresso(`enviando fotos do backup (${n + 1} de ${achados.length})…`);
    o[k] = (await api.enviarFoto(await lerImagem(dataUrlParaBlob(o[k])))).url;
  }
}

// Troca de senha: usada em configurações e na tela obrigatória do primeiro acesso.
export function FormSenha({ inicial, onOk, rotuloBotao = 'salvar senha' }) {
  const [senhas, setSenhas] = useState({ atual: '', nova: '', conf: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const mudar = (k) => (e) => { setSenhas({ ...senhas, [k]: e.target.value }); setErro(''); };

  const salvar = async (e) => {
    e.preventDefault();
    if (senhas.nova.trim().length < 10) return setErro('A nova senha precisa de pelo menos 10 caracteres.');
    if (senhas.nova !== senhas.conf) return setErro('A confirmação não confere com a nova senha.');
    setEnviando(true);
    try { await api.trocarSenha(senhas.atual, senhas.nova); setSenhas({ atual: '', nova: '', conf: '' }); onOk(); }
    catch (x) { setErro(x.message); } finally { setEnviando(false); }
  };

  return (
    <form onSubmit={salvar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: inicial ? 'minmax(0,1fr)' : 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 12, alignItems: 'end' }}>
        <label className="adm-label">{inicial ? 'senha inicial (a que você usou para entrar)' : 'senha atual'}<input className="adm-in" type="password" autoComplete="current-password" value={senhas.atual} onChange={mudar('atual')} required /></label>
        <label className="adm-label">nova senha (mín. 10 caracteres)<input className="adm-in" type="password" autoComplete="new-password" minLength={10} maxLength={200} value={senhas.nova} onChange={mudar('nova')} required /></label>
        <label className="adm-label">confirmar nova senha<input className="adm-in" type="password" autoComplete="new-password" minLength={10} maxLength={200} value={senhas.conf} onChange={mudar('conf')} required /></label>
      </div>
      {erro && <div role="alert" style={{ font: "400 13px 'DM Sans',sans-serif", color: '#b3261e' }}>{erro}</div>}
      <button type="submit" disabled={enviando} className="adm-btn adm-btn--dark" style={{ padding: '12px 20px', fontSize: 14, minHeight: 44, width: inicial ? '100%' : 'max-content' }}>{enviando ? 'salvando…' : rotuloBotao}</button>
    </form>
  );
}

export function Configuracoes({ setSessao }) {
  const { cms, substituir, aplicarVersao, salvar } = useContent();
  const [ocupado, setOcupado] = useState('');
  const [versoes, setVersoes] = useState(null);
  const [ultimoBackup, setUltimoBackup] = useState(lerUltimoBackup);
  const salvando = salvar.status === 'pendente' || salvar.status === 'salvando';

  const carregarVersoes = () => api.historico().then(r => setVersoes(r.versions)).catch(() => setVersoes([]));
  useEffect(() => { carregarVersoes(); }, []);

  const exportar = () => {
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `digital-look-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    const agora = new Date().toISOString(); gravarUltimoBackup(agora); setUltimoBackup(agora);
  };

  const importar = (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      let dados; try { dados = JSON.parse(r.result); } catch { return aviso('Arquivo inválido.'); }
      if (!dados || typeof dados !== 'object' || Array.isArray(dados) || !dados.info || typeof dados.info !== 'object') return aviso('Esse arquivo não parece um backup do site.');
      // Itens soltos ou nulos nas listas, ou artigo sem título, deixariam páginas em branco: o backup é recusado.
      const problema = problemaNasListas(dados);
      if (problema) return aviso('Backup não importado: ' + problema);
      if (!confirm('Importar este backup substitui o conteúdo atual do site. Continuar?')) return;
      setOcupado('importar');
      try { await enviarFotosEmbutidas(dados, setOcupado); substituir(dados); aviso('Backup importado.'); }
      catch (x) { aviso('Falha ao importar: ' + x.message); } finally { setOcupado(''); }
    };
    r.readAsText(f);
  };

  const restaurarPadrao = () => { if (confirm('Isso troca todo o conteúdo pelo conteúdo padrão do site (o que você preencheu e as fotos enviadas deixam de aparecer). Você pode voltar pelo histórico de versões. Continuar?')) { substituir(PADRAO()); aviso('Conteúdo padrão restaurado.'); } };

  const restaurarVersao = async (v) => {
    if (!confirm(`Voltar o site para a versão de ${fmtQuando(v.at)}? A versão atual continua no histórico.`)) return;
    setOcupado('versao');
    try { const r = await api.restaurarVersao(v.id); aplicarVersao(r.content, r.version); aviso('Versão restaurada.'); carregarVersoes(); }
    catch (x) { aviso(x.message); } finally { setOcupado(''); }
  };

  const limpar = async (historico) => {
    if (historico && !confirm('Apagar todas as versões antigas do histórico (fica só a atual) e as fotos que não aparecem mais no site? Não dá para desfazer.')) return;
    setOcupado('limpar');
    try {
      const r = await api.limparFotos(historico);
      const partes = [r.fotosApagadas === 1 ? '1 foto apagada' : `${r.fotosApagadas} fotos apagadas`];
      if (historico) partes.push(r.versoesApagadas === 1 ? '1 versão antiga apagada' : `${r.versoesApagadas} versões antigas apagadas`);
      aviso(partes.join(' · ') + '.');
      if (historico) carregarVersoes();
    } catch (x) { aviso(x.message); } finally { setOcupado(''); }
  };

  const sairDeTodos = async () => {
    if (!confirm('Encerrar a sessão em todos os aparelhos, inclusive neste? Será preciso entrar de novo com a senha.')) return;
    try { await api.sair(true); setSessao({ logado: false }); aviso('Sessões encerradas em todos os aparelhos.'); }
    catch (x) { aviso(x.message); }
  };

  const diasBackup = ultimoBackup ? Math.floor((Date.now() - new Date(ultimoBackup).getTime()) / 864e5) : null;
  const backupAtrasado = diasBackup === null || diasBackup > 30;
  const adminUrl = location.origin + '/admin';
  return <>
    <div className={card}>
      <div style={tituloCard}>trocar senha</div>
      <div style={textoCard}>Trocar a senha encerra a sessão nos outros aparelhos.</div>
      <FormSenha onOk={() => aviso('Senha atualizada. Outros aparelhos conectados precisarão entrar de novo.')} />
    </div>

    <div className={card}>
      <div style={tituloCard}>histórico de versões</div>
      <div style={textoCard}>Cada salvamento gera uma versão. Guardamos as 300 mais recentes e todas as dos últimos 30 dias — restaure uma se algo der errado.</div>
      {versoes === null ? <span className="spinner" style={{ width: 18, height: 18 }} />
        : versoes.length === 0 ? <div style={textoCard}>Nenhuma versão salva ainda — o site está usando o conteúdo padrão.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 320, overflow: 'auto' }}>
            {versoes.map((v, i) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid rgba(0,0,0,.08)', padding: '10px 0', font: "400 14px 'DM Sans',sans-serif" }}>
                <span>{fmtQuando(v.at)} {i === 0 && <span style={{ font: "500 11px 'DM Sans',sans-serif", background: 'var(--sand)', borderRadius: 999, padding: '3px 8px', marginLeft: 6 }}>atual</span>}</span>
                {i > 0 && <button className="adm-btn" disabled={!!ocupado} onClick={() => restaurarVersao(v)}>restaurar</button>}
              </div>
            ))}
          </div>}
    </div>

    <div className={card}>
      <div style={tituloCard}>backup dos dados</div>
      <div style={textoCard}>O conteúdo fica salvo no servidor e aparece para todos os visitantes. Exporte um arquivo uma vez por mês e guarde em um lugar seu (computador, pen drive ou nuvem). Backups do site antigo (com fotos embutidas) também podem ser importados.</div>
      <div style={{ ...textoCard, fontSize: 13, color: backupAtrasado ? '#7a4b00' : 'var(--muted)' }}>
        {diasBackup === null ? 'Nenhum backup exportado neste aparelho ainda.' : `Último backup exportado neste aparelho: ${diasBackup === 0 ? 'hoje' : diasBackup === 1 ? 'ontem' : `há ${diasBackup} dias`}.`}
        {backupAtrasado && diasBackup !== null ? ' Hora de exportar um novo.' : ''}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="adm-btn" style={{ borderColor: 'var(--ink)', fontSize: 14, padding: '11px 18px' }} onClick={exportar}>exportar backup</button>
        <label className="file-btn" style={{ fontSize: 14, padding: '11px 18px' }}>importar backup<input type="file" accept="application/json,.json" onChange={importar} disabled={!!ocupado} className="sr-only" /></label>
        <button className="adm-btn adm-btn--danger" style={{ fontSize: 14, padding: '11px 12px' }} onClick={restaurarPadrao}>restaurar padrão</button>
      </div>
      {ocupado && !['versao', 'limpar'].includes(ocupado) && <div style={{ ...textoCard, fontSize: 13 }}>{ocupado === 'importar' ? 'importando…' : ocupado}</div>}
    </div>

    <div className={card}>
      <div style={tituloCard}>privacidade e limpeza</div>
      <div style={textoCard}>Fotos e itens removidos somem do site, mas continuam guardados enquanto alguma versão do histórico os usar. Quando alguém sair da equipe ou pedir para retirar um depoimento ou uma foto, remova o item e depois apague o histórico antigo para eliminar de vez.</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="adm-btn" style={{ fontSize: 14, padding: '11px 18px' }} disabled={!!ocupado || salvando} onClick={() => limpar(false)}>limpar fotos não usadas</button>
        <button className="adm-btn adm-btn--danger" style={{ fontSize: 14, padding: '11px 12px' }} disabled={!!ocupado || salvando} onClick={() => limpar(true)}>apagar histórico e fotos antigas</button>
      </div>
      <div style={{ ...textoCard, fontSize: 13 }}>{ocupado === 'limpar' ? 'limpando…' : salvando ? 'Aguarde o salvamento terminar.' : 'Fotos enviadas na última hora são mantidas.'}</div>
    </div>

    <div className={card} style={{ gap: 10 }}>
      <div style={tituloCard}>como acessar</div>
      <div style={textoCard}>Entre pelo link "área do proprietário" no rodapé do site ou pelo endereço <strong style={{ color: 'var(--ink)' }}>{adminUrl}</strong>. Dica: salve nos favoritos do celular. Marque "manter conectado" para não precisar digitar a senha por 14 dias naquele aparelho.</div>
      <div style={textoCard}>Perdeu um aparelho ou entrou em um computador que não é seu? Encerre todas as sessões abertas.</div>
      <button className="adm-btn" style={{ fontSize: 14, padding: '11px 18px', width: 'max-content' }} onClick={sairDeTodos}>sair de todos os aparelhos</button>
    </div>
  </>;
}
