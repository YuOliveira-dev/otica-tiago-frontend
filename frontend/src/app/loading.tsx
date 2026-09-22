import { Loader2 } from 'lucide-react';

export default function Loading() {
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
      <Loader2 size={40} className="animate-spin" color="var(--color-accent, #c5a96f)" />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        Carregando...
      </span>
    </div>
  );
}
