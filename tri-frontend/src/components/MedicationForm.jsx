import { useState } from 'react'
import { MEDICATION_COLORS } from '../utils/medications'

const today = new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  name: '',
  firstDoseDate: today,
  firstDoseTime: '',
  frequencyHours: '',
  durationDays: '',
  color: MEDICATION_COLORS[0].key,
}

export default function MedicationForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isComplete =
    form.name.trim() &&
    form.firstDoseDate &&
    form.firstDoseTime &&
    Number(form.frequencyHours) > 0 &&
    Number(form.durationDays) > 0

  function handleSubmit(e) {
    e.preventDefault()
    if (!isComplete) return
    onSave({
      ...form,
      frequencyHours: Number(form.frequencyHours),
      durationDays: Number(form.durationDays),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginTop: 16 }}>
      <div className="field">
        <label htmlFor="med-name">Nome do medicamento</label>
        <input
          id="med-name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Ex: Amoxicilina"
        />
      </div>

      <div className="field">
        <label htmlFor="med-date">Data da primeira dose</label>
        <input
          id="med-date"
          type="date"
          value={form.firstDoseDate}
          onChange={(e) => setField('firstDoseDate', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="med-time">Horário da primeira dose</label>
        <input
          id="med-time"
          type="time"
          value={form.firstDoseTime}
          onChange={(e) => setField('firstDoseTime', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="med-frequency">A cada quantas horas deve tomar?</label>
        <input
          id="med-frequency"
          type="number"
          min={1}
          max={48}
          value={form.frequencyHours}
          onChange={(e) => setField('frequencyHours', e.target.value)}
          placeholder="Ex: 8"
        />
      </div>

      <div className="field">
        <label htmlFor="med-duration">Por quantos dias deve tomar?</label>
        <input
          id="med-duration"
          type="number"
          min={1}
          max={90}
          value={form.durationDays}
          onChange={(e) => setField('durationDays', e.target.value)}
          placeholder="Ex: 7"
        />
      </div>

      <div className="field">
        <label>Cor do marcador no calendário</label>
        <div className="color-swatches">
          {MEDICATION_COLORS.map((c) => (
            <button
              type="button"
              key={c.key}
              className={`color-swatch ${form.color === c.key ? 'selected' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setField('color', c.key)}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!isComplete}>
          Salvar medicamento
        </button>
      </div>
    </form>
  )
}
