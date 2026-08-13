package main

import (
	"log"
	"os"

	"tri-backend/config"
	"tri-backend/handlers"
	"tri-backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("aviso: arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	config.ConnectDB()

	router := gin.Default()

	allowedOrigins := []string{"http://localhost:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		triage := api.Group("/triage")
		{
			triage.GET("/symptoms", handlers.GetSymptomCatalog) // catálogo é público (usado no formulário)
			triage.POST("", middleware.AuthRequired(), handlers.RunTriage)
		}

		history := api.Group("/history")
		history.Use(middleware.AuthRequired())
		{
			history.GET("", handlers.GetHistory)
		}

		user := api.Group("/user")
		user.Use(middleware.AuthRequired())
		{
			user.PUT("/password", handlers.ChangePassword)
		}
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("servidor TRI rodando na porta %s", port)
	router.Run(":" + port)
}
