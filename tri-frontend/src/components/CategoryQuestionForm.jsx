import PainScale from './PainScale'
import DurationOptions from './DurationOptions'
import ChoiceButtons from './ChoiceButtons'
import BooleanToggle from './BooleanToggle'
import MultiSelect from './MultiSelect'

export default function CategoryQuestionForm({ category, answers, onChange }) {
  function setAnswer(id, value) {
    onChange({ ...answers, [id]: value })
  }

  function isAnswered(q) {
    const v = answers[q.id]
    if (q.type === 'multi') return true // opcional, pode ficar vazio
    return v !== undefined && v !== '' && v !== null
  }

  const allRequiredAnswered = category.questions
    .filter((q) => q.type !== 'multi')
    .every((q) => isAnswered(q))

  return (
    <div>
      {category.questions.map((q) => (
        <div className="field" key={q.id}>
          <label>{q.label}</label>
          {q.type === 'number' && (
            <input
              type="number"
              min={q.min}
              max={q.max}
              step={q.step || 1}
              placeholder={q.placeholder}
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          )}
          {q.type === 'duration' && (
            <DurationOptions value={answers[q.id] ?? ''} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === 'scale' && (
            <PainScale value={answers[q.id] ?? null} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === 'choice' && (
            <ChoiceButtons options={q.options} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === 'boolean' && (
            <BooleanToggle value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
          )}
          {q.type === 'multi' && (
            <MultiSelect options={q.options} value={answers[q.id] ?? []} onChange={(v) => setAnswer(q.id, v)} />
          )}
        </div>
      ))}
      <input type="hidden" data-complete={allRequiredAnswered ? 'true' : 'false'} />
    </div>
  )
}

export function isCategoryComplete(category, answers) {
  return category.questions
    .filter((q) => q.type !== 'multi')
    .every((q) => {
      const v = answers[q.id]
      return v !== undefined && v !== '' && v !== null
    })
}
