// Divide um texto e destaca qualquer menção a "SAMU" (e o número 192, quando junto)
// em vermelho e negrito, mantendo o restante do texto normal.
const SAMU_SPLIT = /(SAMU(?:\s*\(?\s*192\s*\)?)?|\b192\b)/gi
const SAMU_TEST = /^(SAMU(?:\s*\(?\s*192\s*\)?)?|\b192\b)$/i

export default function HighlightSamu({ text }) {
  const parts = text.split(SAMU_SPLIT)

  return (
    <>
      {parts.map((part, i) =>
        SAMU_TEST.test(part) ? (
          <strong key={i} style={{ color: 'var(--tri-red)' }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
