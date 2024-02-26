package models

// ListUser 清单id跟用户id的对应表
type ListUser struct {
	Model
	ListId uint  `json:"list_id"`
	List   *List `json:"list"`
	UserId uint  `json:"user_id"`
	User   *User `json:"user,omitempty"`
	IsJoin bool  `json:"is_join" gorm:"default:'0'"`
}

// GetAllCreateList 获取用户所有创建的清单
func GetAllCreateList(UserID uint) (list []ListUser) {

	result := db.Model(&List{}).Where("user_id = ? AND is_join = ? ", UserID, false).Preload("List") //Preload的话的跟结构体的一致哇，驼峰

	result.Find(&list)
	return
}

func GetAllCreateListWithTasks(UserID uint) (list []ListUser) {

	result := db.Model(&List{}).Where("user_id = ? AND is_join = ? ", UserID, false).Preload("List") //Preload的话的跟结构体的一致哇，驼峰

	result.Find(&list)
	return
}

// GetAllJoinList 获取用户加入的所有清单
func GetAllJoinList(UserID uint) (list []ListUser) {

	result := db.Model(&List{}).Where("user_id = ? AND is_join = ? ", UserID, true).Preload("List")

	result.Find(&list)
	return
}

// GetListUserById 获取指定记录，主要用于删除记录
func GetListUserById(ListId interface{}, UserId interface{}) (n ListUser, err error) {
	err = db.Where("list_id = ?", "user_id=?", ListId, UserId).First(&n).Error
	return
}

// GetListUserByListId 获取指定清单，主要用于成员列表的获取
func GetListUserByListId(ListId interface{}) (list []ListUser) {
	result := db.Model(&List{}).Where("list_id = ?", ListId).Preload("User").Omit("List") //Preload的话的跟结构体的一致哇，驼峰
	result.Find(&list)
	return
}

func (f *ListUser) Create() error {
	return db.Create(f).Error
}

func (f *ListUser) Delete() error {
	return db.Delete(f).Error
}
