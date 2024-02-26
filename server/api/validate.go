package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/locales/zh"
	ut "github.com/go-playground/universal-translator"
	val "github.com/go-playground/validator/v10"
	zhTranslations "github.com/go-playground/validator/v10/translations/zh"
	"log"
	"net/http"
	"regexp"
	"strings"
)

type ValidError struct {
	Key     string
	Message string
}

type JsonSnakeCase struct {
	Value interface{}
}

func (c JsonSnakeCase) MarshalJSON() ([]byte, error) {
	// Regexp definitions
	var keyMatchRegex = regexp.MustCompile(`\"(\w+)\":`)
	var wordBarrierRegex = regexp.MustCompile(`(\w)([A-Z])`)
	marshalled, err := json.Marshal(c.Value)
	converted := keyMatchRegex.ReplaceAllFunc(
		marshalled,
		func(match []byte) []byte {
			return bytes.ToLower(wordBarrierRegex.ReplaceAll(
				match,
				[]byte(`${1}_${2}`),
			))
		},
	)
	return converted, err
}

func bindAndValid(c *gin.Context, v interface{}) bool {
	errs := make(map[string]string)
	err := c.ShouldBindJSON(v)
	if err != nil {
		log.Println(err)
		uni := ut.New(zh.New())
		trans, _ := uni.GetTranslator("zh")
		v, ok := binding.Validator.Engine().(*val.Validate)

		if ok {
			_ = zhTranslations.RegisterDefaultTranslations(v, trans)
		}

		verrs, ok := err.(val.ValidationErrors)
		if !ok {
			log.Println(verrs)
			c.JSON(http.StatusNotAcceptable, gin.H{
				"message": "请求参数错误",
				"code":    http.StatusNotAcceptable,
			})
			return false
		}

		for key, value := range verrs.Translate(trans) {
			fmt.Println(key, value)
			errs[key[strings.Index(key, ".")+1:]] = value
		}

		c.JSON(http.StatusNotAcceptable, gin.H{
			"errors":  JsonSnakeCase{errs},
			"message": "请求参数错误",
			"code":    http.StatusNotAcceptable,
		})

		return false
	}

	return true
}
