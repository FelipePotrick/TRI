const OPTIONS = [
  { value: '0-3', label: '0 a 3 dias' },
  { value: '3-6', label: '3 a 6 dias' },
  { value: '7+', label: 'Mais de 7 dias' },
]

export default function DurationOptions({ value, onChange }) {
  return (
    <div className="duration-options" role="radiogroup" aria-label="Há quantos dias os sintomas começaram">
      {OPTIONS.map((opt) => (
        <button
          type="button"
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          className={`duration-btn ${value === opt.value ? 'selected' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
