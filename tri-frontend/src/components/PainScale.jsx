const LEVELS = Array.from({ length: 11 }, (_, i) => i)

export default function PainScale({ value, onChange }) {
  return (
    <div className="pain-scale" role="radiogroup" aria-label="Nível de dor de 0 a 10">
      {LEVELS.map((level) => (
        <button
          type="button"
          key={level}
          role="radio"
          aria-checked={value === level}
          className={`pain-btn ${value === level ? 'selected' : ''}`}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  )
}
