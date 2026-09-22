import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        color: 'var(--color-text-muted, #64748b)',
      }}
    >
      <Loader2 size={36} className="animate-spin" color="var(--color-accent, #c5a96f)" />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Carregando dados do banco de dados...
      </span>
    </div>
  );
}
