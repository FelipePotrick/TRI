package utils

import "tri-backend/models"

// symptomOrder define a ordem fixa de exibição dos sintomas no app.
// É mantida separada do map (que não garante ordem em Go) para que a lista
// nunca mude de posição entre uma triagem e outra.
var symptomOrder = []string{
	"dor_peito",
	"falta_ar",
	"desmaio",
	"sangramento",
	"convulsao",
	"engasgo",
	"confusao_mental",
	"queimadura_grave",
	"dor_cabeca_forte",
	"febre_alta",
	"dor_abdominal",
	"vomito_persist",
	"diarreia",
	"fratura_suspeita",
	"tontura",
	"febre_baixa",
	"dor_leve",
	"tosse",
	"nausea",
	"mal_estar",
}

// SymptomCatalog é o catálogo fixo de sintomas reconhecidos pelo app, com peso de gravidade (1-10).
// Em uma versão futura isso pode virar uma coleção no banco, mantida por profissionais de saúde.
var SymptomCatalog = map[string]models.Symptom{
	"dor_peito":        {Code: "dor_peito", Label: "Dor ou aperto no peito", Weight: 10},
	"falta_ar":         {Code: "falta_ar", Label: "Falta de ar intensa", Weight: 10},
	"desmaio":          {Code: "desmaio", Label: "Desmaio ou perda de consciência", Weight: 10},
	"sangramento":      {Code: "sangramento", Label: "Sangramento intenso", Weight: 9},
	"convulsao":        {Code: "convulsao", Label: "Convulsão", Weight: 10},
	"engasgo":          {Code: "engasgo", Label: "Engasgo / dificuldade grave para respirar", Weight: 10},
	"queimadura_grave": {Code: "queimadura_grave", Label: "Queimadura grave", Weight: 9},
	"confusao_mental":  {Code: "confusao_mental", Label: "Confusão mental / fala alterada", Weight: 9},
	"febre_alta":       {Code: "febre_alta", Label: "Febre alta (acima de 39°C)", Weight: 6},
	"dor_abdominal":    {Code: "dor_abdominal", Label: "Dor abdominal intensa", Weight: 6},
	"vomito_persist":   {Code: "vomito_persist", Label: "Vômitos persistentes", Weight: 5},
	"diarreia":         {Code: "diarreia", Label: "Diarreia", Weight: 4},
	"dor_cabeca_forte": {Code: "dor_cabeca_forte", Label: "Dor de cabeça muito forte e súbita", Weight: 7},
	"fratura_suspeita": {Code: "fratura_suspeita", Label: "Suspeita de fratura", Weight: 6},
	"tontura":          {Code: "tontura", Label: "Tontura", Weight: 3},
	"nausea":           {Code: "nausea", Label: "Náusea", Weight: 2},
	"dor_leve":         {Code: "dor_leve", Label: "Dor leve e localizada", Weight: 2},
	"tosse":            {Code: "tosse", Label: "Tosse", Weight: 2},
	"febre_baixa":      {Code: "febre_baixa", Label: "Febre baixa (até 38°C)", Weight: 3},
	"mal_estar":        {Code: "mal_estar", Label: "Mal-estar geral", Weight: 2},
}

// OrderedSymptoms retorna o catálogo de sintomas sempre na mesma ordem (ver symptomOrder),
// para que o formulário de triagem seja consistente entre sessões.
func OrderedSymptoms() []models.Symptom {
	list := make([]models.Symptom, 0, len(symptomOrder))
	for _, code := range symptomOrder {
		if s, ok := SymptomCatalog[code]; ok {
			list = append(list, s)
		}
	}
	return list
}

// ClassifyTriage aplica uma pontuação simples de risco a partir dos sintomas, dor e tempo de evolução.
// durationRange espera um dos valores: "0-3", "3-6", "7+" (dias desde o início dos sintomas).
// Não substitui avaliação clínica; serve para direcionar o usuário ao fluxo de atendimento correto.
func ClassifyTriage(symptomCodes []string, painLevel int, durationRange string) (symptoms []models.Symptom, score int, level models.RiskLevel, recommendation string) {
	for _, code := range symptomCodes {
		if s, ok := SymptomCatalog[code]; ok {
			symptoms = append(symptoms, s)
			score += s.Weight
		}
	}

	// Dor (0-10) contribui diretamente ao score.
	score += painLevel

	// Sintomas muito recentes (0 a 3 dias) e já intensos pesam mais.
	if durationRange == "0-3" && score >= 8 {
		score += 3
	}

	switch {
	case score >= 20:
		level = models.RiskEmergencia
		recommendation = "Procure atendimento de emergência imediatamente ou ligue para o SAMU (192)."
	case score >= 13:
		level = models.RiskUrgente
		recommendation = "Procure um pronto-socorro o quanto antes. Atendimento prioritário recomendado."
	case score >= 6:
		level = models.RiskPoucoUrgente
		recommendation = "Procure uma UPA ou unidade de saúde nas próximas horas."
	default:
		level = models.RiskNaoUrgente
		recommendation = "Seus sintomas indicam baixa urgência. Considere agendar consulta com atenção básica/clínico geral."
	}

	return symptoms, score, level, recommendation
}
