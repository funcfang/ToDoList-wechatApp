package util

import (
	"ToDoList_Go/pkg/setting"
	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
)

func TotalPage(total int64) int64 {
	n := total / int64(setting.PageSize)
	if total%int64(setting.PageSize) > 0 {
		n++
	}
	return n
}

func GetPage(c *gin.Context) int {
	result := 0
	page := cast.ToInt(c.Query("page"))
	if page > 0 {
		result = (page - 1) * setting.PageSize
	}

	return result
}
