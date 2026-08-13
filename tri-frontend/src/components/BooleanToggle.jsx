export default function BooleanToggle({ value, onChange }) {
  return (
    <div className="choice-buttons">
      <button
        type="button"
        className={`choice-btn ${value === true ? 'selected' : ''}`}
        onClick={() => onChange(true)}
      >
        Sim
      </button>
      <button
        type="button"
        className={`choice-btn ${value === false ? 'selected' : ''}`}
        onClick={() => onChange(false)}
      >
        Não
      </button>
    </div>
  )
}
