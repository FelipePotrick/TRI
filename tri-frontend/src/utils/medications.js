import { getSession } from '../services/api'

// 5 opções de cor para o marcador — 3 são as cores padrão do site.
export const MEDICATION_COLORS = [
  { key: 'verde', label: 'Verde', hex: '#009245' },
  { key: 'vermelho', label: 'Vermelho', hex: '#ff3131' },
  { key: 'amarelo', label: 'Amarelo', hex: '#fbb710' },
  { key: 'azul', label: 'Azul', hex: '#2f6fed' },
  { key: 'roxo', label: 'Roxo', hex: '#8b5cf6' },
]

const STORAGE_PREFIX = 'tri_medications_'

function storageKeyForCurrentUser() {
  const session = getSession()
  const userId = session?.user?.id
  return userId ? `${STORAGE_PREFIX}${userId}` : null
}

export function getMedications() {
  const key = storageKeyForCurrentUser()
  if (!key) return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveMedications(list) {
  const key = storageKeyForCurrentUser()
  if (!key) return
  localStorage.setItem(key, JSON.stringify(list))
}

export function addMedication(med) {
  const list = getMedications()
  const withId = { ...med, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
  const updated = [...list, withId]
  saveMedications(updated)
  return updated
}

export function removeMedication(id) {
  const updated = getMedications().filter((m) => m.id !== id)
  saveMedications(updated)
  return updated
}

// --- Cálculo do cronograma de doses ---

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

// Gera todos os horários de dose de um medicamento, a partir da primeira dose,
// repetindo a cada X horas, durante N dias.
export function generateDoseSchedule(med) {
  const start = new Date(`${med.firstDoseDate}T${med.firstDoseTime}`)
  if (isNaN(start.getTime())) return []

  const frequencyHours = Number(med.frequencyHours) || 24
  const totalHours = (Number(med.durationDays) || 1) * 24

  const doses = []
  let elapsed = 0
  while (elapsed < totalHours) {
    doses.push(new Date(start.getTime() + elapsed * 60 * 60 * 1000))
    elapsed += frequencyHours
  }
  return doses
}

// Agrupa as doses de todos os medicamentos por dia (YYYY-MM-DD), com um
// item por medicamento contendo a lista de horários daquele dia.
export function buildScheduleMap(medications) {
  const map = {}
  medications.forEach((med) => {
    const doses = generateDoseSchedule(med)
    doses.forEach((doseDate) => {
      const key = toDateKey(doseDate)
      if (!map[key]) map[key] = {}
      if (!map[key][med.id]) {
        map[key][med.id] = { id: med.id, name: med.name, color: med.color, times: [] }
      }
      map[key][med.id].times.push(formatTime(doseDate))
    })
  })
  return map
}

export function dateKey(date) {
  return toDateKey(date)
}

export function colorHex(colorKey) {
  return MEDICATION_COLORS.find((c) => c.key === colorKey)?.hex || '#999999'
}
