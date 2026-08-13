import HighlightSamu from './HighlightSamu'

const TEXT =
  'o TRI é uma ferramenta de apoio e não substitui uma consulta, diagnóstico ou atendimento médico profissional. Em caso de emergência, ligue para o SAMU (192) ou dirija-se ao pronto-socorro mais próximo imediatamente.'

export default function Disclaimer() {
  return (
    <div className="disclaimer" role="note">
      <strong>Atenção: </strong>
      <HighlightSamu text={TEXT} />
    </div>
  )
}
