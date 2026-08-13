import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession } from '../services/api'
import Disclaimer from '../components/Disclaimer'
import AudienceCarousel from '../components/AudienceCarousel'
import StartTriageModal from '../components/StartTriageModal'
import StepIcon from '../components/StepIcon'
import araucaria from '../assets/araucaria.png'

const FLOW_STEPS = [
  {
    icon: 'symptoms',
    title: 'Conte seus sintomas',
    text: 'Selecione o que você está sentindo, o nível de dor e há quantos dias começou.',
  },
  {
    icon: 'classify',
    title: 'Classificação automática',
    text: 'O TRI calcula um nível de prioridade com base nas respostas, como no Protocolo de Manchester.',
  },
  {
    icon: 'referral',
    title: 'Encaminhamento',
    text: 'Você recebe uma recomendação: emergência, pronto-socorro, UPA ou atenção básica.',
  },
  {
    icon: 'history',
    title: 'Registro automático',
    text: 'O resultado fica salvo no seu histórico, disponível para consulta e para profissionais de saúde.',
  },
]

export default function Hub() {
  const navigate = useNavigate()
  const session = getSession()
  const [showModal, setShowModal] = useState(false)

  function handleStartTriage() {
    setShowModal(true)
  }

  function handleConfirmModal() {
    setShowModal(false)
    navigate('/triagem')
  }

  return (
    <div className="hub-page">
      <img src={araucaria} alt="" className="hub-bg-image" aria-hidden="true" />

      <div className="tri-shell tri-shell--wide">
        <h1>Olá, {session?.user?.username}</h1>
        <p>O que você precisa hoje?</p>

        <div className="hub-grid" style={{ marginTop: 24 }}>
          <div>
            <h2 style={{ fontSize: 18 }}>Como funciona a triagem</h2>
            <div className="steps-grid">
              {FLOW_STEPS.map((step, i) => (
                <div className="step-card" key={step.title}>
                  <StepIcon type={step.icon} />
                  <span className="topic-number">{String(i + 1).padStart(2, '0')}</span>
                  <strong style={{ color: 'var(--tri-green-dark)' }}>{step.title}</strong>
                  <p style={{ margin: '4px 0 0' }}>{step.text}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 18, marginTop: 32 }}>Para quem?</h2>
            <AudienceCarousel />
          </div>

          <div className="hub-actions">
            <button className="btn btn-primary" onClick={handleStartTriage}>
              Iniciar triagem
            </button>
            <Disclaimer />
          </div>
        </div>
      </div>

      {showModal && (
        <StartTriageModal onConfirm={handleConfirmModal} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
