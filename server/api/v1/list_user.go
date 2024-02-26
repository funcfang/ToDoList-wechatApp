package v1

import (
	"ToDoList_Go/api"
	"ToDoList_Go/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ListUser struct {
	ListId uint   `json:"list_id" binding:"required"`
	UserId uint   `json:"user_id" binding:"required"`
	IsJoin bool   `json:"is_join" binding:"required"`
	name   string `json:"name"`
}

// GetAllCreateList 获取当前用户创建的所有清单
func GetAllCreateList(c *gin.Context) {
	user := api.CurrentUser(c)
	data := models.GetAllCreateList(user.ID)
	c.JSON(http.StatusOK, data)
}

// GetAllJoinList 获取当前用户加入的所有清单
func GetAllJoinList(c *gin.Context) {
	user := api.CurrentUser(c)
	data := models.GetAllJoinList(user.ID)
	c.JSON(http.StatusOK, data)
}

// AddJoinList 用户加入清单
func AddJoinList(c *gin.Context) {
	var json ListUser
	if !api.BindAndValid(c, &json) {
		return
	}

	list, _ := models.GetListById(json.ListId)
	if list.ID != json.ListId || list.UserId != json.UserId {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "小组信息有误，请重新检查",
		})
		return
	}
	//这里很明显就写了一个bug
	if json.name != "" {
		if list.Name != json.name {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "小组信息有误，请重新检查",
			})
			return
		}
	}
	user := api.CurrentUser(c)
	if user.ID == list.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "你已在自己小组内",
		})
		return
	}

	f := models.ListUser{
		UserId: json.UserId,
		ListId: json.ListId,
		IsJoin: true,
	}
	if err := f.Create(); err != nil {
		api.ErrHandler(c, err)
		return
	}
	c.JSON(http.StatusOK, f)
}

// GetListUserByListId 获取该清单下的所有关联，主要用于获取成员列表
func GetListUserByListId(c *gin.Context) {
	//if c.Query("list_id") == "" {
	//	c.JSON(http.StatusBadRequest, gin.H{
	//		"messgae": "list_id不能为空",
	//	})
	//}
	data := models.GetListUserByListId(c.Param("list_id"))
	c.JSON(http.StatusOK, data)
}
