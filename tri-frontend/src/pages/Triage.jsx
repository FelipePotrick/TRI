import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import CategoryQuestionForm, { isCategoryComplete } from '../components/CategoryQuestionForm'
import HighlightSamu from '../components/HighlightSamu'
import {
  EMERGENCY_SYMPTOMS,
  SYMPTOM_CATEGORIES,
  mapCategoriesToPayload,
  getCareTips,
} from '../utils/triageData'
import bonecoSozinho from '../assets/boneco-sozinho.png'
import bonecoDuplo from '../assets/boneco-duplo.png'

const RISK_LABELS = {
  EMERGENCIA: 'Emergência',
  URGENTE: 'Urgente',
  POUCO_URGENTE: 'Pouco urgente',
  NAO_URGENTE: 'Não urgente',
}

export default function Triage() {
  const navigate = useNavigate()

  const [stage, setStage] = useState('audience') // audience | severe | categories | category-questions | confirm-more | result
  const [audience, setAudience] = useState(null) // 'self' | 'other'
  const [answeredCategories, setAnsweredCategories] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [draftAnswers, setDraftAnswers] = useState({})
  const [emergencyTip, setEmergencyTip] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function chooseAudience(type) {
    setAudience(type)
    setStage(type === 'other' ? 'severe' : 'categories')
  }

  async function handleEmergencySymptom(symptom) {
    setError('')
    setLoading(true)
    try {
      const data = await api.runTriage({
        symptom_codes: [symptom.code],
        pain_level: 10,
        duration_range: '0-3',
        additional_notes: `Emergência informada por terceiros: ${symptom.label}.`,
      })
      setEmergencyTip(symptom.tip)
      setResult(data)
      setStage('result')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function openCategory(code) {
    setActiveCategory(code)
    setDraftAnswers(answeredCategories[code] || {})
    setStage('category-questions')
  }

  function saveCategory() {
    setAnsweredCategories((prev) => ({ ...prev, [activeCategory]: draftAnswers }))
    setStage('confirm-more')
  }

  async function finishAndSubmit() {
    setError('')
    setLoading(true)
    try {
      const payload = mapCategoriesToPayload(answeredCategories)
      const data = await api.runTriage(payload)
      setEmergencyTip(null)
      setResult(data)
      setStage('result')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function goBack() {
    if (stage === 'severe') setStage('audience')
    else if (stage === 'categories') setStage(audience === 'other' ? 'severe' : 'audience')
    else if (stage === 'category-questions') setStage('categories')
    else if (stage === 'confirm-more') setStage('category-questions')
  }

  const category = SYMPTOM_CATEGORIES.find((c) => c.code === activeCategory)
  const hasAnyCategoryAnswered = Object.keys(answeredCategories).length > 0

  // --- Resultado ---
  if (stage === 'result' && result) {
    const careTips = emergencyTip ? null : getCareTips(answeredCategories)
    return (
      <div className="tri-shell triage-result-shell">
        <h1>Resultado da triagem</h1>
        <div className="card">
          <span className={`risk-badge risk-${result.risk_level}`}>{RISK_LABELS[result.risk_level]}</span>
          <p style={{ marginTop: 14 }}>
            <HighlightSamu text={result.recommendation} />
          </p>
        </div>

        {emergencyTip && (
          <div className="first-aid-box" style={{ marginTop: 16 }}>
            <strong>Enquanto o socorro não chega:</strong>
            <p style={{ margin: '6px 0 0', color: 'var(--tri-ink)' }}>{emergencyTip}</p>
          </div>
        )}

        {careTips && (
          <div className="card" style={{ marginTop: 16 }}>
            <strong style={{ color: 'var(--tri-green-dark)' }}>Cuidados gerais</strong>
            <ul className="tip-list">
              {careTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="med-disclaimer" style={{ marginTop: 16 }}>
          <strong>Sobre medicamentos:</strong> o TRI não recomenda medicamentos específicos ou
          doses. Para qualquer dúvida sobre remédios, procure um farmacêutico ou profissional de
          saúde.
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <button className="btn btn-primary" onClick={() => navigate('/historico')}>
            Ver no histórico
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="tri-shell tri-shell--wide triage-shell">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {stage !== 'audience' && (
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 18px' }} onClick={goBack}>
            ‹ Voltar
          </button>
        )}
        <h1 style={{ margin: 0 }}>Triagem</h1>
      </div>

      {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

      {/* --- Para quem é a triagem --- */}
      {stage === 'audience' && (
        <div style={{ marginTop: 20 }}>
          <p>Para quem é a triagem?</p>
          <div className="option-grid">
            <button className="option-block audience-block" onClick={() => chooseAudience('self')}>
              <img src={bonecoSozinho} alt="Para mim" />
              <strong>Para mim</strong>
              <span>Vou responder sobre os meus próprios sintomas</span>
            </button>
            <button className="option-block audience-block" onClick={() => chooseAudience('other')}>
              <img src={bonecoDuplo} alt="Outra pessoa" />
              <strong>Outra pessoa</strong>
              <span>Vou responder por alguém que precisa de ajuda</span>
            </button>
          </div>
        </div>
      )}

      {/* --- Sintomas graves (apenas fluxo "outra pessoa") --- */}
      {stage === 'severe' && (
        <div style={{ marginTop: 20 }}>
          <p>A pessoa apresenta algum destes sintomas graves agora?</p>
          <div className="option-grid">
            {EMERGENCY_SYMPTOMS.map((s) => (
              <button
                key={s.code}
                className="option-block severe-block"
                onClick={() => handleEmergencySymptom(s)}
                disabled={loading}
              >
                <strong>{s.label}</strong>
              </button>
            ))}
          </div>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 20, maxWidth: 320 }}
            onClick={() => setStage('categories')}
          >
            Nenhum desses — continuar
          </button>
        </div>
      )}

      {/* --- Lista de categorias de sintomas comuns --- */}
      {stage === 'categories' && (
        <div style={{ marginTop: 20 }}>
          <p>{audience === 'other' ? 'O que a pessoa está sentindo?' : 'O que você está sentindo?'}</p>
          <div className="option-grid">
            {SYMPTOM_CATEGORIES.map((cat) => {
              const done = Boolean(answeredCategories[cat.code])
              return (
                <button
                  key={cat.code}
                  className={`option-block ${done ? 'done' : ''}`}
                  onClick={() => openCategory(cat.code)}
                >
                  <strong>{cat.label}</strong>
                  <span>{cat.sublabel}</span>
                  {done && <span className="option-check">✓ registrado</span>}
                </button>
              )
            })}
          </div>

          {hasAnyCategoryAnswered && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 24, maxWidth: 320 }}
              onClick={finishAndSubmit}
              disabled={loading}
            >
              {loading ? 'Processando…' : 'Concluir triagem e ver resultado'}
            </button>
          )}
        </div>
      )}

      {/* --- Perguntas detalhadas da categoria escolhida --- */}
      {stage === 'category-questions' && category && (
        <div className="card" style={{ marginTop: 20, maxWidth: 560 }}>
          <h2 style={{ fontSize: 16 }}>{category.label}</h2>
          <CategoryQuestionForm category={category} answers={draftAnswers} onChange={setDraftAnswers} />
          <button
            className="btn btn-primary"
            disabled={!isCategoryComplete(category, draftAnswers)}
            onClick={saveCategory}
          >
            Concluir sintoma
          </button>
        </div>
      )}

      {/* --- Confirmação: adicionar mais algum sintoma? --- */}
      {stage === 'confirm-more' && (
        <div className="card" style={{ marginTop: 20, maxWidth: 460 }}>
          <p style={{ margin: 0 }}>
            Sintoma registrado. Gostaria de acrescentar mais algum sintoma que{' '}
            {audience === 'other' ? 'a pessoa está sentindo' : 'você está sentindo'}?
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => setStage('categories')}>
              Adicionar outro
            </button>
            <button className="btn btn-primary" onClick={finishAndSubmit} disabled={loading}>
              {loading ? 'Processando…' : 'Ver resultado'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
