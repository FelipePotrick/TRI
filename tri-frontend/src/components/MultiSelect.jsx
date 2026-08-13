export default function MultiSelect({ options, value = [], onChange }) {
  function toggle(opt) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
  }

  return (
    <div className="choice-buttons">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`choice-btn ${value.includes(opt) ? 'selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
