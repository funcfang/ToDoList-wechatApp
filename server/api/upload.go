package api

import (
	"ToDoList_Go/pkg/util"
	"fmt"
	"github.com/gin-gonic/gin"
	"path"
)

// UploadSingleFile 通用文件上传函数，请勿直接在路由中调用
func UploadSingleFile(c *gin.Context, filePath string) (dst string, err error) {
	file, err := c.FormFile("file")
	if err != nil {
		ErrHandler(c, err)
		return
	}
	// file.Filename SHOULD NOT be trusted.
	fmt.Println(file.Filename)
	//ext := filepath.Ext(file.Filename)
	dst = path.Join("upload", filePath+"-"+file.Filename)
	util.ExistsOrCreate(path.Dir(dst))
	// save file to specific dst
	err = c.SaveUploadedFile(file, dst)
	if err != nil {
		ErrHandler(c, err)
		return
	}

	return
}
