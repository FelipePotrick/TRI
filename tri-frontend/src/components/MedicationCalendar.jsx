import { dateKey, colorHex } from '../utils/medications'

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function buildCalendarWeeks(year, month) {
  const firstDay = new Date(year, month, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    const next = new Date(last)
    next.setDate(next.getDate() + 1)
    cells.push({ date: next, inMonth: false })
  }

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function isToday(date) {
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export default function MedicationCalendar({ currentMonth, onChangeMonth, scheduleMap, onSelectDose }) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const weeks = buildCalendarWeeks(year, month)

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => onChangeMonth(new Date(year, month - 1, 1))}
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <strong>
          {MONTH_LABELS[month]} de {year}
        </strong>
        <button
          type="button"
          className="carousel-arrow"
          onClick={() => onChangeMonth(new Date(year, month + 1, 1))}
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {WEEKDAY_LABELS.map((w) => (
          <div className="calendar-weekday" key={w}>
            {w}
          </div>
        ))}

        {weeks.flat().map(({ date, inMonth }) => {
          const key = dateKey(date)
          const dosesForDay = Object.values(scheduleMap[key] || {})
          return (
            <div className={`calendar-day ${inMonth ? '' : 'outside'} ${isToday(date) ? 'today' : ''}`} key={key}>
              <span className="calendar-day-number">{date.getDate()}</span>
              {dosesForDay.length > 0 && (
                <div className="calendar-dots">
                  {dosesForDay.map((med) => (
                    <button
                      type="button"
                      key={med.id}
                      className="calendar-dot"
                      style={{ background: colorHex(med.color) }}
                      onClick={() => onSelectDose({ ...med, date })}
                      aria-label={`${med.name}, ${med.times.join(', ')}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
