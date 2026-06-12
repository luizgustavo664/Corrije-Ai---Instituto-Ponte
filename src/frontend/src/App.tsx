import { useState } from 'react'
import './App.css'
import { AlunoModule } from './modules/AlunoModule'
import { CoordenadorProfessorModule } from './modules/CoordenadorProfessorModule'

type Portal = 'hub' | 'aluno' | 'coordenador-professor'

const portalCards = [
  {
    id: 'aluno' as const,
    eyebrow: 'Fluxo do aluno',
    title: 'Aplicacao de prova',
    description:
      'Acesso, instrucoes, prova, revisao e confirmacao em uma experiencia mobile-first.',
  },
  {
    id: 'coordenador-professor' as const,
    eyebrow: 'Fluxo interno',
    title: 'Coordenacao e professor',
    description:
      'Login, cadastro, painel, provas, banco de questoes, correcao e liberacao de notas.',
  },
]

function PortalShell({
  title,
  onBack,
  children,
}: {
  title: string
  onBack: () => void
  children: React.ReactNode
}) {
  return (
    <div className="portal-shell">
      <button type="button" className="portal-back" onClick={onBack}>
        Voltar ao seletor
      </button>
      <span className="portal-label">{title}</span>
      {children}
    </div>
  )
}

export default function App() {
  const [portal, setPortal] = useState<Portal>('hub')

  if (portal === 'aluno') {
    return (
      <PortalShell title="Area do aluno" onBack={() => setPortal('hub')}>
        <AlunoModule />
      </PortalShell>
    )
  }

  if (portal === 'coordenador-professor') {
    return (
      <PortalShell
        title="Area de coordenacao e professor"
        onBack={() => setPortal('hub')}
      >
        <CoordenadorProfessorModule />
      </PortalShell>
    )
  }

  return (
    <main className="hub-page">
      <section className="hub-hero">
        <p className="hub-kicker">Corrije Ai</p>
        <h1>Escolha qual experiencia abrir no frontend</h1>
        <p className="hub-copy">
          As duas pastas novas agora entram pelo app principal, sem manter o
          template padrao do Vite.
        </p>
      </section>

      <section className="hub-grid" aria-label="Portais disponiveis">
        {portalCards.map((card) => (
          <article key={card.id} className="hub-card">
            <p className="hub-card-eyebrow">{card.eyebrow}</p>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <button type="button" onClick={() => setPortal(card.id)}>
              Abrir portal
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}
