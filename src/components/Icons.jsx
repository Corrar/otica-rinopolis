// Sprite de ícones (mesmos símbolos do design) + atalho <Ic>.
export function IconSprite() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        <symbol id="ic-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></symbol>
        <symbol id="ic-tel" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></symbol>
        <symbol id="ic-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" /></symbol>
        <symbol id="ic-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z" /><circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="10" r="2.5" /></symbol>
        <symbol id="ic-ig" viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="3" width="18" height="18" rx="5" /><circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="4" /><circle fill="currentColor" cx="17.5" cy="6.5" r="1.2" /></symbol>
        <symbol id="ic-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></symbol>
        <symbol id="ic-cal" viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="5" width="18" height="16" rx="3" /><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 3v4M16 3v4M3 10h18" /></symbol>
        <symbol id="ic-lock" viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="4" y="10" width="16" height="11" rx="2" /><path fill="none" stroke="currentColor" strokeWidth="2" d="M8 10V7a4 4 0 0 1 8 0v3" /></symbol>
        <symbol id="ic-trash" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></symbol>
        <symbol id="ic-mail" viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="5" width="18" height="14" rx="3" /><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" /></symbol>
        <symbol id="ic-img" viewBox="0 0 24 24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="4" width="18" height="16" rx="3" /><circle fill="currentColor" cx="9" cy="10" r="1.6" /><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M21 16l-5-5-9 9" /></symbol>
      </defs>
    </svg>
  );
}

export function Ic({ n, s = 18, style, className }) {
  return <svg width={s} height={s} style={style} className={className} aria-hidden="true"><use href={'#ic-' + n} /></svg>;
}
