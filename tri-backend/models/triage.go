package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// RiskLevel representa o nível de prioridade da triagem (baseado no Protocolo de Manchester).
type RiskLevel string

const (
	RiskEmergencia   RiskLevel = "EMERGENCIA"    // vermelho - atendimento imediato
	RiskUrgente      RiskLevel = "URGENTE"       // laranja - até 10 min
	RiskPoucoUrgente RiskLevel = "POUCO_URGENTE" // amarelo - até 60 min
	RiskNaoUrgente   RiskLevel = "NAO_URGENTE"   // verde - até 120 min
)

// Symptom é um sintoma marcado pelo usuário, com um peso pré-definido.
type Symptom struct {
	Code   string `bson:"code" json:"code"`
	Label  string `bson:"label" json:"label"`
	Weight int    `bson:"weight" json:"weight"`
}

// TriageRecord é o resultado de uma sessão de triagem, salvo no histórico do paciente.
type TriageRecord struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID          primitive.ObjectID `bson:"user_id" json:"user_id"`
	Symptoms        []Symptom          `bson:"symptoms" json:"symptoms"`
	PainLevel       int                `bson:"pain_level" json:"pain_level"`         // 0-10
	DurationRange   string             `bson:"duration_range" json:"duration_range"` // "0-3", "3-6" ou "7+" dias
	AdditionalNotes string             `bson:"additional_notes" json:"additional_notes"`
	RiskLevel       RiskLevel          `bson:"risk_level" json:"risk_level"`
	RiskScore       int                `bson:"risk_score" json:"risk_score"`
	Recommendation  string             `bson:"recommendation" json:"recommendation"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
}

type TriageInput struct {
	SymptomCodes    []string `json:"symptom_codes" binding:"required,min=1"`
	PainLevel       int      `json:"pain_level" binding:"min=0,max=10"`
	DurationRange   string   `json:"duration_range" binding:"required,oneof=0-3 3-6 7+"`
	AdditionalNotes string   `json:"additional_notes"`
}
