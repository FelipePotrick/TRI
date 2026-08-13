export default function ChoiceButtons({ options, value, onChange }) {
  return (
    <div className="choice-buttons">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`choice-btn ${value === opt ? 'selected' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
