package handlers

import (
	"context"
	"net/http"
	"time"

	"tri-backend/config"
	"tri-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetHistory retorna todas as triagens já feitas pelo usuário autenticado, mais recentes primeiro.
func GetHistory(c *gin.Context) {
	userIDStr := c.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário inválido"})
		return
	}

	col := config.GetCollection("triage_records")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := col.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar histórico"})
		return
	}
	defer cursor.Close(ctx)

	records := []models.TriageRecord{}
	if err := cursor.All(ctx, &records); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao ler histórico"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"history": records})
}
