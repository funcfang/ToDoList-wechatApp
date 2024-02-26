package models

type User struct {
	Model
	Username             string `json:"username"`
	Openid               string `json:"-" gorm:"uniqueIndex"`
	Avatar               string `json:"avatar"`
	IsClickHeavy         bool   `json:"is_click_heavy" gorm:"default:true"`
	IsClickSound         bool   `json:"is_click_sound" gorm:"default:true"`
	CreateListAmount     int    `json:"create_list_amount" gorm:"default:'0'"`
	UnfinishedTaskAmount int    `json:"unfinished_task_amount" gorm:"default:'0'"`
	FinishedTaskAmount   int    `json:"finished_task_amount" gorm:"default:'0'"`
}

func GetUserById(id interface{}) (n User, err error) {
	err = db.First(&n, id).Error
	return
}

func GetUserTaskStatus(userId interface{}) (status User) {
	db.Select("create_list_amount").Select("unfinished_task_amount").Select("finished_task_amount").First(&status, userId)
	return
}

func GetUserByOpenId(openId string) (n User, err error) {
	result := db.Where("openid=?", openId).First(&n)
	if result.RowsAffected == 0 {
		n = User{
			Username:             "",
			Avatar:               "",
			Openid:               openId,
			IsClickHeavy:         true,
			IsClickSound:         true,
			CreateListAmount:     0,
			UnfinishedTaskAmount: 0,
			FinishedTaskAmount:   0,
		}
		err = n.Create()
	}
	return
}

func (f *User) Create() error {
	return db.Create(f).Error
}

func (f *User) Update(n *User) {
	db.Model(&User{}).Where("id = ?", f.ID).Updates(n)
	db.Model(&User{}).First(f, f.ID)
}

func (f *User) Delete() error {
	return db.Delete(f).Error
}

// 主要用于0值的情况
func (f *User) UpdateTaskState(n *User) {
	db.Model(&User{}).Where("id = ?", f.ID).Update("unfinished_task_amount", n.UnfinishedTaskAmount).Update("finished_task_amount", n.FinishedTaskAmount)
	db.Model(&User{}).First(f, f.ID)
}
