package jwt

import (
	"ToDoList_Go/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func UserRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := models.CurrentUser(c)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
				"error":   err.Error(),
			})
			c.Abort()
			return
		}

		c.Set("user", &user)
		c.Next()
	}
}
