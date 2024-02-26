package models

import (
	"ToDoList_Go/pkg/setting"
	"ToDoList_Go/pkg/util"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/spf13/cast"
	"log"
	"time"
)

var db *gorm.DB

type Model struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	CreatedAt TimeNormal `gorm:"column:created_at;default:null" json:"created_at"`
	UpdateAt  TimeNormal `gorm:"column:updated_at;default:null" json:"updated_at"`
}

func init() {
	var (
		err                                  error
		dbType, dbName, user, password, host string
	)

	sec, err := setting.Cfg.GetSection("database")
	if err != nil {
		log.Fatal(2, "Fail to get section 'database': %v", err)
	}

	dbType = sec.Key("TYPE").String()
	dbName = sec.Key("NAME").String()
	user = sec.Key("USER").String()
	password = sec.Key("PASSWORD").String()
	host = sec.Key("HOST").String()
	//tablePrefix = sec.Key("TABLE_PREFIX").String()

	db, err = gorm.Open(dbType, fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user,
		password,
		host,
		dbName))

	if err != nil {
		log.Println(err)
	}

	// 默认表前缀
	//gorm.DefaultTableNameHandler = func (db *gorm.DB, defaultTableName string) string  {
	//	return tablePrefix + defaultTableName;
	//}
	//db.SingularTable(true)

	db.LogMode(true)
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(100)

	//自动迁移表
	db.AutoMigrate(&User{})
	db.AutoMigrate(&List{})
	db.AutoMigrate(&Task{})
	db.AutoMigrate(&File{})
	db.AutoMigrate(&Photo{})
	db.AutoMigrate(&ListUser{})

}

type Pagination struct {
	Total       int64 `json:"total"`
	PerPage     int   `json:"pageSize"`
	CurrentPage int   `json:"current"`
	TotalPages  int64 `json:"total_pages"`
}

type DataList struct {
	Data       interface{} `json:"data"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

func orderAndPaginate(c *gin.Context) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		sort := c.DefaultQuery("sort", "asc")
		order := c.DefaultQuery("order_by", "id") +
			" " + sort

		page := cast.ToInt(c.Query("page"))
		if page == 0 {
			page = 1
		}
		pageSize := setting.PageSize
		offset := (page - 1) * setting.PageSize

		return db.Order(order).Offset(offset).Limit(pageSize)
	}
}

func GetListWithPagination(models interface{},
	c *gin.Context, totalRecords int64) (result *DataList) {

	page := cast.ToInt(c.Query("page"))
	if page == 0 {
		page = 1
	}

	result = &DataList{}

	result.Data = models
	result.Pagination = &Pagination{
		Total:       totalRecords,
		PerPage:     setting.PageSize,
		CurrentPage: page,
		TotalPages:  util.TotalPage(totalRecords),
	}
	return
}

func CurrentUser(c *gin.Context) (user User, err error) {
	uid, err := CurrentUserId(c)
	if err != nil {
		return user, err
	}
	userId := cast.ToUint(uid)
	// 根据 ID 查找用户
	result := db.First(&user, userId)
	if result.Error != nil {
		return user, err
	}
	return
}

func CurrentUserId(c *gin.Context) (userId string, err error) {
	var token string
	// 先验证 token 是否合法
	if len(c.Request.Header["Token"]) == 0 {
		if c.Query("token") == "" {
			return "", errors.New("no token")
		}
		token = c.Query("token")
	} else {
		token = c.Request.Header["Token"][0]
	}

	claims, err := util.ParseToken(token)
	if err != nil {
		return "", errors.New("unauthorized")
	} else if time.Now().Unix() > claims.ExpiresAt {
		return "", errors.New("token time out")
	}
	userId = cast.ToString(claims.UserID)
	return
}

func CloseDB() {
	defer db.Close()
}
