package middleware

import (
	"net/http"
	"strings"

	"tri-backend/utils"

	"github.com/gin-gonic/gin"
)

// AuthRequired protege rotas exigindo um Bearer token JWT válido.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token de autenticação ausente"})
			return
		}

		tokenString := strings.TrimPrefix(header, "Bearer ")
		claims, err := utils.ParseJWT(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token inválido ou expirado"})
			return
		}

		c.Set("userID", claims.UserID)
		c.Next()
	}
}
