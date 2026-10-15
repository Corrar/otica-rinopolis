import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { aviso } from '../lib/toast.js';
import { num2 } from '../lib/util.js';
import { PADRAO } from '../content/defaults.js';
import { useContent } from '../state/content.jsx';

const card = 'adm-card';
const tituloCard = { font: "500 16px 'Outfit',sans-serif" };
const textoCard = { font: "400 14px/1.6 'DM Sans',sans-serif", color: 'var(--muted)' };
const fmtQuando = (iso) => { const d = new Date(iso); return isNaN(d) ? iso : `${num2(d.getDate())}/${num2(d.getMonth() + 1)}/${d.getFullYear()} às ${num2(d.getHours())}:${num2(d.getMinutes())}`; };

// Backups do protótipo guardavam fotos embutidas (data:...). Envia cada uma ao servidor e troca pela URL.
async function enviarFotosEmbutidas(obj, progresso) {
  const achados = [];
  const andar = (o) => { if (Array.isArray(o)) o.forEach((v, i) => (typeof v === 'string' && v.startsWith('data:image/') ? achados.push([o, i]) : andar(v))); else if (o && typeof o === 'object') Object.keys(o).forEach(k => (typeof o[k] === 'string' && o[k].startsWith('data:image/') ? achados.push([o, k]) : andar(o[k]))); };
  andar(obj);
  for (let n = 0; n < achados.length; n++) {
    const [o, k] = achados[n]; progresso(`enviando fotos do backup (${n + 1} de ${achados.length})…`);
    o[k] = (await api.enviarFoto(o[k])).url;
  }
}

export function Configuracoes({ sessao, setSessao }) {
  const { cms, substituir, aplicarVersao } = useContent();
  const [senhas, setSenhas] = useState({ atual: '', nova: '', conf: '' });
  const [ocupado, setOcupado] = useState('');
  const [versoes, setVersoes] = useState(null);

  const carregarVersoes = () => api.historico().then(r => setVersoes(r.versions)).catch(() => setVersoes([]));
  useEffect(() => { carregarVersoes(); }, []);

  const salvarSenha = async (e) => {
    e.preventDefault();
    if (senhas.nova !== senhas.conf) return aviso('A confirmação não confere com a nova senha.');
    setOcupado('senha');
    try { await api.trocarSenha(senhas.atual, senhas.nova); setSenhas({ atual: '', nova: '', conf: '' }); setSessao(s => ({ ...s, senhaInicial: false })); aviso('Senha atualizada. Outros aparelhos conectados precisarão entrar de novo.'); }
    catch (x) { aviso(x.message); } finally { setOcupado(''); }
  };

  const exportar = () => {
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `digital-look-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const importar = (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      let dados; try { dados = JSON.parse(r.result); } catch { return aviso('Arquivo inválido.'); }
      if (!dados || typeof dados !== 'object' || !dados.info) return aviso('Esse arquivo não parece um backup do site.');
      if (!confirm('Importar este backup substitui o conteúdo atual do site. Continuar?')) return;
      setOcupado('importar');
      try { await enviarFotosEmbutidas(dados, setOcupado); substituir(dados); aviso('Backup importado.'); }
      catch (x) { aviso('Falha ao importar: ' + x.message); } finally { setOcupado(''); }
    };
    r.readAsText(f);
  };

  const restaurarPadrao = () => { if (confirm('Isso troca todo o conteúdo pelo padrão de exemplo (fotos enviadas deixam de aparecer). Você pode voltar pelo histórico de versões. Continuar?')) { substituir(PADRAO()); aviso('Conteúdo padrão restaurado.'); } };

  const restaurarVersao = async (v) => {
    if (!confirm(`Voltar o site para a versão de ${fmtQuando(v.at)}? A versão atual continua no histórico.`)) return;
    setOcupado('versao');
    try { const r = await api.restaurarVersao(v.id); aplicarVersao(r.content, r.version); aviso('Versão restaurada.'); carregarVersoes(); }
    catch (x) { aviso(x.message); } finally { setOcupado(''); }
  };

  const adminUrl = location.origin + '/admin';
  return <>
    <form className={card} onSubmit={salvarSenha}>
      <div style={tituloCard}>trocar senha</div>
      {sessao.senhaInicial && <div style={{ ...textoCard, color: '#7a4b00' }}>Você ainda usa a senha inicial — troque por uma só sua.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 12, alignItems: 'end' }}>
        <label className="adm-label">senha atual<input className="adm-in" type="password" autoComplete="current-password" value={senhas.atual} onChange={e => setSenhas({ ...senhas, atual: e.target.value })} required /></label>
        <label className="adm-label">nova senha (mín. 6)<input className="adm-in" type="password" autoComplete="new-password" minLength={6} value={senhas.nova} onChange={e => setSenhas({ ...senhas, nova: e.target.value })} required /></label>
        <label className="adm-label">confirmar nova senha<input className="adm-in" type="password" autoComplete="new-password" minLength={6} value={senhas.conf} onChange={e => setSenhas({ ...senhas, conf: e.target.value })} required /></label>
        <button type="submit" disabled={ocupado === 'senha'} className="adm-btn adm-btn--dark" style={{ padding: '12px 20px', fontSize: 14, minHeight: 44, width: 'max-content' }}>{ocupado === 'senha' ? 'salvando…' : 'salvar senha'}</button>
      </div>
    </form>

    <div className={card}>
      <div style={tituloCard}>histórico de versões</div>
      <div style={textoCard}>Cada salvamento gera uma versão. Guardamos as 40 mais recentes — restaure uma se algo der errado.</div>
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
      <div style={textoCard}>O conteúdo fica salvo no servidor e aparece para todos os visitantes. Exporte um arquivo de vez em quando para ter uma cópia sua. Backups do site antigo (com fotos embutidas) também podem ser importados.</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="adm-btn" style={{ borderColor: 'var(--ink)', fontSize: 14, padding: '11px 18px' }} onClick={exportar}>exportar backup</button>
        <label className="file-btn" style={{ fontSize: 14, padding: '11px 18px' }}>importar backup<input type="file" accept="application/json,.json" onChange={importar} disabled={!!ocupado} className="sr-only" /></label>
        <button className="adm-btn adm-btn--danger" style={{ fontSize: 14, padding: '11px 12px' }} onClick={restaurarPadrao}>restaurar padrão</button>
      </div>
      {ocupado && ocupado !== 'senha' && ocupado !== 'versao' && <div style={{ ...textoCard, fontSize: 13 }}>{ocupado === 'importar' ? 'importando…' : ocupado}</div>}
    </div>

    <div className={card} style={{ gap: 10 }}>
      <div style={tituloCard}>como acessar</div>
      <div style={textoCard}>Entre pelo link "área do proprietário" no rodapé do site ou pelo endereço <strong style={{ color: 'var(--ink)' }}>{adminUrl}</strong>. Dica: salve nos favoritos do celular. Marque "manter conectado" para não precisar digitar a senha por 30 dias naquele aparelho.</div>
    </div>
  </>;
}
