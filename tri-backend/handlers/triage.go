package handlers

import (
	"context"
	"net/http"
	"time"

	"tri-backend/config"
	"tri-backend/models"
	"tri-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GetSymptomCatalog retorna a lista de sintomas que o app reconhece, para montar o formulário de triagem.
func GetSymptomCatalog(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"symptoms": utils.OrderedSymptoms()})
}

// RunTriage executa a triagem, calcula o nível de risco e salva automaticamente no histórico do usuário.
func RunTriage(c *gin.Context) {
	userIDStr := c.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário inválido"})
		return
	}

	var input models.TriageInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos", "details": err.Error()})
		return
	}

	symptoms, score, level, recommendation := utils.ClassifyTriage(input.SymptomCodes, input.PainLevel, input.DurationRange)

	record := models.TriageRecord{
		UserID:          userID,
		Symptoms:        symptoms,
		PainLevel:       input.PainLevel,
		DurationRange:   input.DurationRange,
		AdditionalNotes: input.AdditionalNotes,
		RiskLevel:       level,
		RiskScore:       score,
		Recommendation:  recommendation,
		CreatedAt:       time.Now(),
	}

	col := config.GetCollection("triage_records")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := col.InsertOne(ctx, record)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao salvar triagem"})
		return
	}
	record.ID = res.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, record)
}
