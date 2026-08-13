import HighlightSamu from './HighlightSamu'

const TEXT =
  'A TRI é uma ferramenta de apoio e não substitui uma consulta, diagnóstico ou atendimento médico profissional. Em caso de emergência, ligue para o SAMU (192) ou dirija-se ao pronto-socorro mais próximo imediatamente.'

export default function StartTriageModal({ onConfirm, onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h2>Atenção</h2>
        <p>
          <HighlightSamu text={TEXT} />
        </p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
