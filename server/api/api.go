package api

import (
	"ToDoList_Go/models"
	"ToDoList_Go/pkg/setting"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/spf13/cast"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"
)

func BindAndValid(c *gin.Context, v interface{}) bool {
	return bindAndValid(c, v)
}

func ErrHandler(c *gin.Context, err error) {
	log.Println(err.Error())
	if err == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{
		"message": err.Error(),
	})
}

func CurrentUser(c *gin.Context) *models.User {
	return c.MustGet("user").(*models.User)
}

// CurrentAccessToken 后面再优化这里
func CurrentAccessToken(c *gin.Context) map[string]interface{} {
	return c.MustGet("accesss_token").(map[string]interface{})
}

func GetOpenId(c *gin.Context, code string) (bool, string) {
	params := url.Values{}
	Url, _ := url.Parse("https://api.weixin.qq.com/sns/jscode2session")
	APPID := setting.APPID
	AppSecret := setting.AppSecret
	params.Set("appid", APPID)
	params.Set("secret", AppSecret)
	params.Set("js_code", code)
	params.Set("grant_type", "authorization_code")
	//如果参数中有中文参数,这个方法会进行URLEncode
	Url.RawQuery = params.Encode()
	urlPath := Url.String()
	//fmt.Println(urlPath) //等同于https://www.xxx.com?age=23&name=zhaofan
	resp, _ := http.Get(urlPath)
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	resMap := make(map[string]interface{})
	if err := json.Unmarshal(body, &resMap); err != nil {
		fmt.Printf("Unmarshal err, %v\n", err)
		ErrHandler(c, err)
		return false, ""
	}
	fmt.Println(resMap)
	if resMap["openid"] == nil {
		fmt.Println("error", resMap)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":  "error",
			"data": resMap,
		})
		return false, ""
	} else {
		return true, resMap["openid"].(string)
	}

}

func GetAccessToken(c *gin.Context) (bool, map[string]interface{}) {
	params := url.Values{}
	Url, _ := url.Parse("https://api.weixin.qq.com/cgi-bin/token")
	APPID := setting.APPID
	AppSecret := setting.AppSecret
	params.Set("appid", APPID)
	params.Set("secret", AppSecret)
	params.Set("grant_type", "client_credential")
	//如果参数中有中文参数,这个方法会进行URLEncode
	Url.RawQuery = params.Encode()
	urlPath := Url.String()
	resp, _ := http.Get(urlPath)
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	resMap := make(map[string]interface{})
	if err := json.Unmarshal(body, &resMap); err != nil {
		fmt.Printf("Unmarshal err, %v\n", err)
		ErrHandler(c, err)
		return false, nil
	}
	log.Println(resMap)
	if resMap["access_token"] == nil {
		fmt.Println("error", resMap)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":  "error",
			"data": resMap,
		})
		return false, nil
	} else {
		resMap["end_date"] = time.Now().Add(time.Duration(cast.ToInt(resMap["expires_in"])) * time.Second)
		c.Set("access_token", resMap)
		return true, resMap
	}
}

func GetQRCode(c *gin.Context, access_token string) (bool, map[string]interface{}) {
	params := url.Values{}
	Url, _ := url.Parse("https://api.weixin.qq.com/wxa/getwxacode")
	params.Set("access_token", access_token)

	//如果参数中有中文参数,这个方法会进行URLEncode
	Url.RawQuery = params.Encode()
	urlPath := Url.String()

	//postform 写法
	//data := url.Values{}
	//data.Add("page", "pages/taskList/taskList")
	//data.Add("scene", "from_user_id=1&list_id=1")

	//json写法
	data := make(map[string]interface{})
	data["path"] = "pages/list/listDetail/listDetail?list_id=1"
	//data["scene"] = "list_id=1"
	//data["env_version"] = "trial"
	bytesData, err := json.Marshal(data)
	if err != nil {
		ErrHandler(c, err)
		return false, nil
	}
	reader := bytes.NewReader(bytesData)
	resp, _ := http.Post(urlPath, "application/json", reader)

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	resMap := make(map[string]interface{})
	if err := json.Unmarshal(body, &resMap); err != nil {
		fmt.Printf("Unmarshal err, %v\n", err)
		ErrHandler(c, err)
		return false, nil
	}
	log.Println(resMap)
	if resMap["Buffer"] == nil {
		fmt.Println("error", resMap)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg":  "error",
			"data": resMap,
		})
		return false, nil
	} else {
		return true, resMap
	}
}
