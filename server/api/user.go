package api

import (
	"ToDoList_Go/models"
	"ToDoList_Go/pkg/e"
	"ToDoList_Go/pkg/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"os"
	"path"
)

type User struct {
	Username     string `json:"username" binding:"required"`
	Avatar       string `json:"avatar"`
	IsClickHeavy bool   `json:"is_click_heavy" "`
	IsClickSound bool   `json:"is_click_sound" "`
}

func Login(c *gin.Context) {

	var json struct {
		Code string `json:"code" binding:"required,min=6"`
	}

	if !BindAndValid(c, &json) {
		return
	}

	ok, openid := GetOpenId(c, json.Code)
	if !ok {
		return
	}
	fmt.Println(openid)
	user, err := models.GetUserByOpenId(openid)
	if err != nil {
		ErrHandler(c, err)
		return
	}
	data := make(map[string]interface{})
	code := e.INVALID_PARAMS

	token, err := util.GenerateToken(user.ID, user.Username)
	if err != nil {
		code = e.ERROR_AUTH_TOKEN
	} else {
		data["token"] = token
		code = e.SUCCESS
	}

	c.JSON(http.StatusOK, gin.H{
		"code": code,
		"msg":  e.GetMsg(code),
		"data": data,
		"user": user,
	})

}

func GetUserInfo(c *gin.Context) {
	user := CurrentUser(c)
	c.JSON(http.StatusOK, user)
}

func UploadUserAvatar(c *gin.Context) {

	user := CurrentUser(c)

	name := uuid.New().String()
	dst, err := UploadSingleFile(c, path.Join("avatar", name))
	fmt.Println("dst", dst)
	if err != nil {
		ErrHandler(c, err)
		return
	}

	// 删除旧照片
	if user.Avatar != "" {
		if _, err = os.Stat(user.Avatar); err == nil {
			_ = os.Remove(user.Avatar)
		}
	}

	n := models.User{
		Avatar: dst,
	}
	user.Update(&n)

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"url":     dst,
		"data":    user,
	})
}

func UpdateUser(c *gin.Context) {
	var json User
	if !BindAndValid(c, &json) {
		return
	}

	user := CurrentUser(c)

	n := models.User{
		Username:     json.Username,
		IsClickHeavy: json.IsClickHeavy,
		IsClickSound: json.IsClickSound,
	}
	user.Update(&n)
	c.JSON(http.StatusOK, user)
}

// GetUserTaskStatus 这里写的不好，太sb了，所以最好还是一开始后台初始化用户信息比较好
func GetUserTaskStatus(c *gin.Context) {
	user := CurrentUser(c)
	var data struct {
		CreateListAmount     int `json:"create_list_amount" `
		UnfinishedTaskAmount int `json:"unfinished_task_amount" `
		FinishedTaskAmount   int `json:"finished_task_amount" `
	}
	data.FinishedTaskAmount = user.FinishedTaskAmount
	data.UnfinishedTaskAmount = user.UnfinishedTaskAmount
	data.CreateListAmount = user.CreateListAmount
	c.JSON(http.StatusOK, data)
}
