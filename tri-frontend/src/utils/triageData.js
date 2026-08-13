// Sintomas graves — quando a triagem é para "outra pessoa", estes aparecem primeiro.
// Selecionar qualquer um deles pula o resto do protocolo e vai direto para o resultado
// como emergência, com uma orientação de primeiros socorros específica.
export const EMERGENCY_SYMPTOMS = [
  {
    code: 'sangramento',
    label: 'Sangramento intenso',
    tip: 'Enquanto aguarda o socorro, deite a pessoa, coloque luvas se possível e aplique pressão direta sobre o ferimento usando um pano limpo, gaze ou atadura, mantendo a compressão contínua por pelo menos 10 minutos.',
  },
  {
    code: 'convulsao',
    label: 'Convulsão',
    tip: 'Afaste objetos que possam machucar a pessoa, não segure seus movimentos nem coloque nada em sua boca, proteja a cabeça com algo macio e, assim que a convulsão terminar, vire-a de lado para ajudar a respiração.',
  },
  {
    code: 'desmaio',
    label: 'Desmaio ou perda de consciência',
    tip: 'Verifique se a pessoa está respirando, deite-a de lado (posição de recuperação), afrouxe roupas apertadas e não ofereça água ou comida enquanto ela estiver inconsciente.',
  },
  {
    code: 'engasgo',
    label: 'Engasgo / dificuldade grave para respirar',
    tip: 'Se a pessoa não conseguir tossir, falar ou respirar, aplique compressões abdominais (manobra de Heimlich) até a chegada do socorro ou a desobstrução das vias aéreas.',
  },
  {
    code: 'dor_peito',
    label: 'Dor forte no peito',
    tip: 'Mantenha a pessoa sentada ou em posição confortável, com roupas afrouxadas, calma e imóvel enquanto aguarda o socorro.',
  },
  {
    code: 'queimadura_grave',
    label: 'Queimadura grave',
    tip: 'Resfrie a área queimada com água corrente limpa e fria por cerca de 10 a 20 minutos, não estoure bolhas nem aplique pomadas, cremes ou gelo diretamente na queimadura, e cubra com um pano limpo e não aderente.',
  },
]

// Categorias de sintomas comuns (fluxo "Para mim" e continuação do fluxo "Outra pessoa"
// quando nenhum sintoma grave é selecionado).
export const SYMPTOM_CATEGORIES = [
  {
    code: 'febre',
    label: 'Febre',
    sublabel: 'Temperatura',
    questions: [
      { id: 'temperatura', type: 'number', label: 'Qual a temperatura aproximada (°C)?', min: 35, max: 42, step: 0.1, placeholder: 'Ex: 38.5' },
      { id: 'duracao', type: 'duration', label: 'Há quantos dias está com febre?' },
      {
        id: 'sinais_dengue',
        type: 'multi',
        label: 'Sente algum desses sintomas junto?',
        options: ['Dor atrás dos olhos', 'Manchas vermelhas na pele', 'Dor articular intensa', 'Dor no corpo'],
      },
    ],
  },
  {
    code: 'respiratorio',
    label: 'Falta de ar',
    sublabel: 'Respiratório',
    questions: [
      { id: 'intensidade', type: 'choice', label: 'Como está a falta de ar?', options: ['Leve', 'Moderada', 'Grave'] },
      { id: 'quando', type: 'choice', label: 'Acontece em repouso ou só em esforço?', options: ['Em repouso', 'Só ao esforço'] },
      { id: 'chiado', type: 'boolean', label: 'Sente chiado no peito?' },
    ],
  },
  {
    code: 'dor_cabeca',
    label: 'Dor de cabeça',
    sublabel: 'Neurológico',
    questions: [
      { id: 'intensidade', type: 'scale', label: 'Qual a intensidade da dor (0 a 10)?' },
      { id: 'inicio_subito', type: 'boolean', label: 'A dor começou de forma súbita e muito forte?' },
      { id: 'duracao', type: 'duration', label: 'Há quantos dias está com essa dor?' },
    ],
  },
  {
    code: 'dor_abdominal',
    label: 'Dor abdominal',
    sublabel: 'Digestivo',
    questions: [
      { id: 'intensidade', type: 'scale', label: 'Qual a intensidade da dor (0 a 10)?' },
      { id: 'nausea', type: 'boolean', label: 'Sente náusea ou vômito junto?' },
      { id: 'duracao', type: 'duration', label: 'Há quantos dias está com essa dor?' },
    ],
  },
  {
    code: 'tosse',
    label: 'Tosse / Gripe',
    sublabel: 'Respiratório',
    questions: [
      { id: 'duracao', type: 'duration', label: 'Há quantos dias está com tosse ou gripe?' },
      { id: 'febre_junto', type: 'boolean', label: 'Está com febre junto?' },
    ],
  },
  {
    code: 'dor_peito_comum',
    label: 'Dor no peito',
    sublabel: 'Cardiovascular',
    questions: [
      { id: 'intensidade', type: 'scale', label: 'Qual a intensidade da dor (0 a 10)?' },
      { id: 'tipo', type: 'choice', label: 'Como é a dor?', options: ['Aperto / pressão', 'Pontada / fisgada', 'Queimação'] },
      { id: 'piora_respirar', type: 'boolean', label: 'A dor piora ao respirar fundo ou se mover?' },
      { id: 'duracao', type: 'duration', label: 'Há quantos dias sente essa dor?' },
    ],
  },
  {
    code: 'lesao',
    label: 'Corte, queda ou lesão',
    sublabel: 'Trauma',
    questions: [
      { id: 'tipo', type: 'choice', label: 'O que aconteceu?', options: ['Corte / ferimento', 'Queda', 'Pancada / lesão'] },
      { id: 'sangramento', type: 'boolean', label: 'Há sangramento?' },
      { id: 'suspeita_fratura', type: 'boolean', label: 'Suspeita de fratura ou alguma deformidade visível?' },
      { id: 'intensidade', type: 'scale', label: 'Qual a intensidade da dor no local (0 a 10)?' },
    ],
  },
  {
    code: 'gastro',
    label: 'Diarreia ou vômito',
    sublabel: 'Digestivo',
    questions: [
      { id: 'duracao', type: 'duration', label: 'Há quantos dias está com diarreia ou vômito?' },
      { id: 'frequencia', type: 'choice', label: 'Com que frequência isso acontece?', options: ['Poucas vezes ao dia', 'Muitas vezes ao dia'] },
      {
        id: 'sinais_desidratacao',
        type: 'multi',
        label: 'Sente algum desses sinais?',
        options: ['Boca seca', 'Tontura', 'Pouca urina', 'Fraqueza intensa'],
      },
    ],
  },
]

const DURATION_ORDER = ['0-3', '3-6', '7+']

// Converte as respostas coletadas nas categorias em um payload compatível com o back-end
// (symptom_codes, pain_level, duration_range) além de um texto legível para additional_notes.
export function mapCategoriesToPayload(answeredCategories) {
  const symptomCodes = new Set()
  let painLevel = 0
  let bestDurationIndex = null
  const noteLines = []

  const bumpPain = (value) => {
    painLevel = Math.max(painLevel, value)
  }
  const considerDuration = (range) => {
    const idx = DURATION_ORDER.indexOf(range)
    if (idx !== -1 && (bestDurationIndex === null || idx < bestDurationIndex)) {
      bestDurationIndex = idx
    }
  }
  const durationLabel = (range) =>
    ({ '0-3': '0 a 3 dias', '3-6': '3 a 6 dias', '7+': 'mais de 7 dias' }[range] || range)

  Object.entries(answeredCategories).forEach(([code, answers]) => {
    if (code === 'febre') {
      const temp = parseFloat(answers.temperatura) || 0
      if (temp >= 39) {
        symptomCodes.add('febre_alta')
        bumpPain(6)
      } else if (temp >= 37.8) {
        symptomCodes.add('febre_baixa')
        bumpPain(4)
      } else {
        bumpPain(2)
      }
      if (answers.duracao) considerDuration(answers.duracao)
      let line = `Febre: ${temp || '?'}°C`
      if (answers.duracao) line += `, há ${durationLabel(answers.duracao)}`
      if (answers.sinais_dengue?.length >= 2) {
        line += `. Possíveis sinais de dengue (${answers.sinais_dengue.join(', ').toLowerCase()}) — recomenda-se atenção médica.`
        bumpPain(painLevel + 3)
      } else {
        line += '.'
      }
      noteLines.push(line)
    }

    if (code === 'respiratorio') {
      if (answers.intensidade === 'Grave') {
        symptomCodes.add('falta_ar')
        bumpPain(8)
      } else if (answers.intensidade === 'Moderada') {
        bumpPain(5)
      } else {
        bumpPain(3)
      }
      noteLines.push(
        `Falta de ar: intensidade ${answers.intensidade || '?'}, ${answers.quando === 'Em repouso' ? 'em repouso' : 'ao esforço'}${answers.chiado ? ', com chiado no peito' : ''}.`
      )
    }

    if (code === 'dor_cabeca') {
      const intensidade = Number(answers.intensidade) || 0
      if (intensidade >= 7 || answers.inicio_subito) {
        symptomCodes.add('dor_cabeca_forte')
      }
      bumpPain(intensidade)
      if (answers.duracao) considerDuration(answers.duracao)
      noteLines.push(
        `Dor de cabeça: intensidade ${intensidade}/10${answers.inicio_subito ? ', início súbito e forte' : ''}${answers.duracao ? `, há ${durationLabel(answers.duracao)}` : ''}.`
      )
    }

    if (code === 'dor_abdominal') {
      const intensidade = Number(answers.intensidade) || 0
      if (intensidade >= 5) {
        symptomCodes.add('dor_abdominal')
      }
      bumpPain(intensidade)
      if (answers.duracao) considerDuration(answers.duracao)
      noteLines.push(
        `Dor abdominal: intensidade ${intensidade}/10${answers.nausea ? ', com náusea/vômito' : ''}${answers.duracao ? `, há ${durationLabel(answers.duracao)}` : ''}.`
      )
    }

    if (code === 'tosse') {
      symptomCodes.add('tosse')
      bumpPain(2)
      if (answers.duracao) considerDuration(answers.duracao)
      noteLines.push(
        `Tosse/gripe${answers.duracao ? `, há ${durationLabel(answers.duracao)}` : ''}${answers.febre_junto ? ', com febre junto' : ''}.`
      )
    }

    if (code === 'dor_peito_comum') {
      const intensidade = Number(answers.intensidade) || 0
      if (intensidade >= 7 || answers.tipo === 'Aperto / pressão') {
        symptomCodes.add('dor_peito')
      }
      bumpPain(intensidade)
      if (answers.duracao) considerDuration(answers.duracao)
      noteLines.push(
        `Dor no peito: intensidade ${intensidade}/10, tipo ${answers.tipo || '?'}${answers.piora_respirar ? ', piora ao respirar/mover' : ''}${answers.duracao ? `, há ${durationLabel(answers.duracao)}` : ''}.`
      )
    }

    if (code === 'lesao') {
      const intensidade = Number(answers.intensidade) || 0
      if (answers.sangramento) symptomCodes.add('sangramento')
      if (answers.suspeita_fratura) symptomCodes.add('fratura_suspeita')
      bumpPain(intensidade)
      considerDuration('0-3')
      noteLines.push(
        `${answers.tipo || 'Lesão'}: intensidade da dor ${intensidade}/10${answers.sangramento ? ', com sangramento' : ''}${answers.suspeita_fratura ? ', com suspeita de fratura' : ''}.`
      )
    }

    if (code === 'gastro') {
      symptomCodes.add('diarreia')
      if (answers.frequencia === 'Muitas vezes ao dia') {
        symptomCodes.add('vomito_persist')
        bumpPain(6)
      } else {
        bumpPain(3)
      }
      if (answers.duracao) considerDuration(answers.duracao)
      let line = `Diarreia/vômito: ${answers.frequencia || '?'}`
      if (answers.duracao) line += `, há ${durationLabel(answers.duracao)}`
      if (answers.sinais_desidratacao?.length >= 2) {
        line += `. Possíveis sinais de desidratação (${answers.sinais_desidratacao.join(', ').toLowerCase()}) — recomenda-se hidratação e atenção médica.`
        bumpPain(painLevel + 4)
      } else {
        line += '.'
      }
      noteLines.push(line)
    }
  })

  if (symptomCodes.size === 0) {
    symptomCodes.add('mal_estar')
  }

  return {
    symptom_codes: Array.from(symptomCodes),
    pain_level: Math.min(10, Math.round(painLevel)),
    duration_range: DURATION_ORDER[bestDurationIndex ?? 0],
    additional_notes: noteLines.join('\n'),
  }
}

// Dicas gerais de cuidado exibidas no resultado, de acordo com as categorias respondidas.
export function getCareTips(answeredCategories) {
  const tips = new Set(['Beba bastante água e mantenha-se hidratado.', 'Priorize repouso e evite esforços intensos.'])

  const codes = Object.keys(answeredCategories)
  if (codes.includes('febre')) {
    tips.add('Monitore a temperatura regularmente e use roupas leves.')
  }
  if (codes.includes('respiratorio') || codes.includes('tosse')) {
    tips.add('Evite ambientes com fumaça ou poeira e mantenha-se em local ventilado.')
  }
  if (codes.includes('dor_cabeca')) {
    tips.add('Evite telas e ambientes com muita luz ou barulho.')
  }
  if (codes.includes('dor_abdominal')) {
    tips.add('Prefira alimentos leves e evite frituras ou bebidas alcoólicas.')
  }
  if (codes.includes('dor_peito_comum')) {
    tips.add('Evite esforço físico e fique atento ao surgimento de novos sintomas.')
  }
  if (codes.includes('lesao')) {
    tips.add('Mantenha o local machucado limpo e, se possível, elevado e imobilizado.')
  }
  if (codes.includes('gastro')) {
    tips.add('Beba líquidos com frequência, em pequenos goles, para evitar desidratação.')
    tips.add('Prefira alimentos leves como arroz, banana e torradas.')
  }

  return Array.from(tips)
}
