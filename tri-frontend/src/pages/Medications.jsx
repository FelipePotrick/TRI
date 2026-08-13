import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MedicationForm from '../components/MedicationForm'
import MedicationCalendar from '../components/MedicationCalendar'
import {
  getMedications,
  addMedication,
  removeMedication,
  buildScheduleMap,
  colorHex,
} from '../utils/medications'

const WEEKDAY_DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

export default function Medications() {
  const navigate = useNavigate()
  const [medications, setMedications] = useState(getMedications())
  const [showForm, setShowForm] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDose, setSelectedDose] = useState(null)

  const scheduleMap = useMemo(() => buildScheduleMap(medications), [medications])

  function handleSave(newMed) {
    const updated = addMedication(newMed)
    setMedications(updated)
    setShowForm(false)
  }

  function handleRemove(id) {
    const updated = removeMedication(id)
    setMedications(updated)
  }

  return (
    <div className="tri-shell tri-shell--wide">
      <h1>Medicamentos</h1>
      <p>Cadastre seus medicamentos e acompanhe os horários no calendário.</p>

      {!showForm && (
        <button className="btn btn-primary" style={{ maxWidth: 260 }} onClick={() => setShowForm(true)}>
          Adicionar Medicamento
        </button>
      )}

      {showForm && <MedicationForm onSave={handleSave} onCancel={() => setShowForm(false)} />}

      <div style={{ marginTop: 28 }}>
        <MedicationCalendar
          currentMonth={currentMonth}
          onChangeMonth={setCurrentMonth}
          scheduleMap={scheduleMap}
          onSelectDose={setSelectedDose}
        />
      </div>

      {medications.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 16 }}>Seus medicamentos</h2>
          <div className="med-list">
            {medications.map((med) => (
              <div className="med-list-item" key={med.id}>
                <span className="med-list-color" style={{ background: colorHex(med.color) }} />
                <div className="med-list-info">
                  <strong>{med.name}</strong>
                  <span>
                    A cada {med.frequencyHours}h, por {med.durationDays} dia(s) — desde{' '}
                    {med.firstDoseDate.split('-').reverse().join('/')} às {med.firstDoseTime}
                  </span>
                </div>
                <button className="med-list-remove" onClick={() => handleRemove(med.id)} aria-label="Remover medicamento">
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn-secondary" style={{ marginTop: 28, maxWidth: 260 }} onClick={() => navigate('/')}>
        Voltar ao início
      </button>

      {selectedDose && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedDose(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="med-list-color" style={{ background: colorHex(selectedDose.color) }} />
              <h2 style={{ margin: 0 }}>{selectedDose.name}</h2>
            </div>
            <p style={{ marginTop: 10, textTransform: 'capitalize' }}>
              {WEEKDAY_DATE_FORMAT.format(selectedDose.date)}
            </p>
            <p style={{ marginTop: 4 }}>
              <strong>Horários:</strong> {selectedDose.times.join(' · ')}
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setSelectedDose(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
