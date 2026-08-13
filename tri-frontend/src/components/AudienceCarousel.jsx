import { useEffect, useRef, useState } from 'react'
import personaVoce from '../assets/persona-voce.png'
import personaPais from '../assets/persona-pais.png'
import personaFamilia from '../assets/persona-familia.png'

const SLIDES = [
  {
    title: 'Você',
    image: personaVoce,
    items: [
      '5 níveis de recomendação de cuidado',
      'Linguagem simples e nomes comuns',
      'Artigos educacionais',
    ],
  },
  {
    title: 'Pais',
    image: personaPais,
    items: [
      'Condições de saúde pediátricas',
      'Análise de pares de sintomas',
      'Mapas corporais em diferentes faixas etárias',
    ],
  },
  {
    title: 'Membros da família',
    image: personaFamilia,
    items: ['Modo em terceira pessoa', 'Instruções e explicações'],
  },
]

const AUTO_ADVANCE_MS = 5000

export default function AudienceCarousel() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1))
    }, AUTO_ADVANCE_MS)
  }

  useEffect(() => {
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  function goTo(i) {
    setIndex(i)
    resetTimer()
  }

  function prev() {
    goTo(index === 0 ? SLIDES.length - 1 : index - 1)
  }

  function next() {
    goTo(index === SLIDES.length - 1 ? 0 : index + 1)
  }

  const slide = SLIDES[index]

  return (
    <div className="carousel">
      <div className="carousel-row">
        <button className="carousel-arrow" onClick={prev} aria-label="Anterior">
          ‹
        </button>

        <div className="carousel-track">
          <div className="carousel-slide">
            <img src={slide.image} alt={slide.title} className="carousel-image" />
            <div className="carousel-text">
              <h3>{slide.title}</h3>
              <ul>
                {slide.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <button className="carousel-arrow" onClick={next} aria-label="Próximo">
          ›
        </button>
      </div>

      <div className="carousel-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir para ${s.title}`}
          />
        ))}
      </div>
    </div>
  )
}
