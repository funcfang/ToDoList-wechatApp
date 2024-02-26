package v1

import (
	"ToDoList_Go/api"
	"ToDoList_Go/models"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"path"
)

type Task struct {
	Name         string            `json:"name" binding:"required"`
	CreateUserId uint              `json:"create_user_id"`
	ListId       uint              `json:"list_id" binding:"required"`
	IsFinished   bool              `json:"is_finished"`
	EndDate      models.TimeNormal `json:"end_date"`
	FinishedDate models.TimeNormal `json:"finished_date"`
	Description  string            `json:"description"`
	Week         int               `json:"week"`
}

func GetTaskList(c *gin.Context) {
	user := api.CurrentUser(c)
	data := models.GetTaskList(c, user.ID)
	c.JSON(http.StatusOK, data)
}

func GetAllTask(c *gin.Context) {
	user := api.CurrentUser(c)
	data := models.GetAllTask(user.ID, c.Query("id"))
	c.JSON(http.StatusOK, data)
}

func AddTask(c *gin.Context) {
	var json Task
	if !api.BindAndValid(c, &json) {
		return
	}
	user := api.CurrentUser(c)

	f := models.Task{
		Name:         json.Name,
		UserId:       user.ID,
		ListId:       json.ListId,
		EndDate:      json.EndDate,
		Week:         json.Week,
		FinishedDate: json.FinishedDate,
		Description:  json.Description,
		IsFinished:   false,
	}

	if err := f.Create(); err != nil {
		api.ErrHandler(c, err)
		return
	}
	n := models.User{
		UnfinishedTaskAmount: user.UnfinishedTaskAmount + 1,
		FinishedTaskAmount:   user.FinishedTaskAmount,
	}
	user.UpdateTaskState(&n)
	c.JSON(http.StatusOK, f)
}

func UpdateTask(c *gin.Context) {
	var json Task
	if !api.BindAndValid(c, &json) {
		return
	}

	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}
	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法修改非自己创建的任务",
		})
		return
	}
	n := models.Task{
		Name:        json.Name,
		EndDate:     json.EndDate,
		Description: json.Description,
		Week:        json.Week,
	}
	f.Update(&n)
	c.JSON(http.StatusOK, f)
}

func DeleteTask(c *gin.Context) {
	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}
	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法删除非自己创建的任务",
		})
		return
	}

	//删除任务后用户的任务数量也得减
	var n models.User
	if f.IsFinished {
		n = models.User{
			FinishedTaskAmount: user.FinishedTaskAmount - 1,
		}
	} else {
		n = models.User{
			UnfinishedTaskAmount: user.UnfinishedTaskAmount - 1,
		}
	}
	user.Update(&n)

	if err = f.Delete(); err != nil {
		api.ErrHandler(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "ok",
	})
}

func FinishTask(c *gin.Context) {
	var json struct { //其实这里应该后端处理，而不是前台发送，可惜目前我对go不是很熟悉，对时间的格式不了解
		FinishedDate models.TimeNormal `json:"finished_date" binding:"required"`
	}
	if !api.BindAndValid(c, &json) {
		return
	}

	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}
	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法完成非自己创建的任务",
		})
		return
	}

	//完成任务后用户的任务数量也得减
	var n models.User
	n = models.User{
		UnfinishedTaskAmount: user.UnfinishedTaskAmount - 1,
		FinishedTaskAmount:   user.FinishedTaskAmount + 1,
	}
	user.UpdateTaskState(&n)

	if user.UnfinishedTaskAmount == 0 {

	}

	fn := models.Task{
		IsFinished:   true,
		FinishedDate: json.FinishedDate,
	}
	f.Update(&fn)
	c.JSON(http.StatusOK, gin.H{
		"msg": "ok",
	})
}

func CancelTask(c *gin.Context) {

	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}
	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法取消非自己创建的任务",
		})
		return
	}

	//取消任务后用户的任务数量也得减
	var n models.User
	n = models.User{
		UnfinishedTaskAmount: user.UnfinishedTaskAmount + 1,
		FinishedTaskAmount:   user.FinishedTaskAmount - 1,
	}
	user.UpdateTaskState(&n)

	f.CancelFinish()

	c.JSON(http.StatusOK, gin.H{
		"msg": "ok",
	})
}

func UploadTaskFile(c *gin.Context) {

	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}

	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法编辑非自己创建的任务",
		})
		return
	}

	name := uuid.New().String()
	dst, err := api.UploadSingleFile(c, path.Join("file", name))
	fmt.Println("dst", dst)
	if err != nil {
		api.ErrHandler(c, err)
		return
	}

	file := models.File{
		Path:   dst,
		UserId: user.ID,
		TaskId: f.ID,
	}

	if err := file.Create(); err != nil {
		api.ErrHandler(c, err)
		return
	}

	// 删除旧照片
	//if sponsor.Logo != "" {
	//	if _, err = os.Stat(sponsor.Logo); err == nil {
	//		_ = os.Remove(sponsor.Logo)
	//	}
	//}

	files := append(f.Files, file)
	n := models.Task{
		Files: files,
	}

	f.Update(&n)

	c.JSON(http.StatusOK, f)
}

func UploadTaskPhoto(c *gin.Context) {

	f, err := models.GetTaskById(c.Param("id"))
	if err != nil {
		api.ErrHandler(c, err)
		return
	}

	user := api.CurrentUser(c)
	if f.UserId != user.ID {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无法编辑非自己创建的图片",
		})
		return
	}

	name := uuid.New().String()
	dst, err := api.UploadSingleFile(c, path.Join("photo", name))
	fmt.Println("dst", dst)
	if err != nil {
		api.ErrHandler(c, err)
		return
	}

	file := models.Photo{
		Path:   dst,
		UserId: user.ID,
		TaskId: f.ID,
	}

	if err := file.Create(); err != nil {
		api.ErrHandler(c, err)
		return
	}

	files := append(f.Photos, file)
	n := models.Task{
		Photos: files,
	}

	f.Update(&n)

	c.JSON(http.StatusOK, f)
}

func GetQRCode(c *gin.Context) {

	ok, tokenData := api.GetAccessToken(c)
	if !ok {
		return
	}
	ok, bufferData := api.GetQRCode(c, tokenData["access_token"].(string))
	if !ok {
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": bufferData,
	})
}
