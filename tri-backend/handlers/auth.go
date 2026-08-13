package handlers

import (
	"context"
	"net/http"
	"time"

	"tri-backend/config"
	"tri-backend/models"
	"tri-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Register cadastra um novo usuário (nome de usuário, e-mail e senha).
func Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos", "details": err.Error()})
		return
	}

	col := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	hash, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao processar senha"})
		return
	}

	user := models.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: hash,
		CreatedAt:    time.Now(),
	}

	res, err := col.InsertOne(ctx, user)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "e-mail ou nome de usuário já cadastrado"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao criar usuário"})
		return
	}

	userID := res.InsertedID.(interface{ Hex() string }).Hex()
	token, err := utils.GenerateJWT(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao gerar token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user": models.UserResponse{
			ID:       userID,
			Username: user.Username,
			Email:    user.Email,
		},
	})
}

// Login autentica um usuário existente por e-mail e senha.
func Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos", "details": err.Error()})
		return
	}

	col := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := col.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "e-mail ou senha inválidos"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "e-mail ou senha inválidos"})
		return
	}

	token, err := utils.GenerateJWT(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": models.UserResponse{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
		},
	})
}

// ChangePassword permite que o usuário autenticado troque sua senha, exigindo a senha atual.
func ChangePassword(c *gin.Context) {
	userIDStr := c.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário inválido"})
		return
	}

	var input models.ChangePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos", "details": err.Error()})
		return
	}

	col := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	if err := col.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usuário não encontrado"})
		return
	}

	if !utils.CheckPasswordHash(input.CurrentPassword, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "senha atual incorreta"})
		return
	}

	newHash, err := utils.HashPassword(input.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao processar nova senha"})
		return
	}

	_, err = col.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": bson.M{"password_hash": newHash}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao atualizar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "senha atualizada com sucesso"})
}
