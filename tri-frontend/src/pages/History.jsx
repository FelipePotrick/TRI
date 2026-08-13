import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const RISK_LABELS = {
  EMERGENCIA: 'Emergência',
  URGENTE: 'Urgente',
  POUCO_URGENTE: 'Pouco urgente',
  NAO_URGENTE: 'Não urgente',
}

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getHistory()
      .then((data) => setHistory(data.history || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="tri-shell">
      <h1>Histórico</h1>
      <p>Suas triagens anteriores, mais recentes primeiro.</p>

      {loading && <p>Carregando…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && history.length === 0 && (
        <div className="card">
          <p style={{ margin: 0 }}>Você ainda não fez nenhuma triagem.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {history.map((record) => (
          <div className="card" key={record.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`risk-badge risk-${record.risk_level}`}>
                {RISK_LABELS[record.risk_level]}
              </span>
              <span style={{ fontSize: 12, color: 'var(--tri-ink-soft)' }}>
                {new Date(record.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
            <p style={{ marginTop: 10, marginBottom: 4 }}>
              {record.symptoms?.map((s) => s.label).join(', ')}
            </p>
            <p style={{ fontSize: 13 }}>{record.recommendation}</p>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => navigate('/')}>
        Voltar ao início
      </button>
    </div>
  )
}
