package models

type List struct {
	Model
	Name   string `json:"name" gorm:"not null"`
	UserId uint   `json:"user_id" gorm:"not null,index"`
	//TotalTask int    `json:"total_task" gorm:"not null,default:'0'"`   //算啦，该功能先不加，本来想记录该清单有多少任务的，多少完成，多少未完成
	User *User `json:"user,omitempty" `
}

func GetAllList(UserID uint) (list []List) {

	result := db.Model(&List{}).Where("user_id = ?", UserID).Omit("User")

	result.Find(&list)
	return
}

func GetListById(id interface{}) (n List, err error) {
	err = db.First(&n, id).Error
	return
}

func (f *List) Create() error {
	return db.Create(f).Error
}

func (f *List) Update(n *List) {
	db.Model(&List{}).Where("id = ?", f.ID).Updates(n)
	db.Model(&List{}).Omit("User").First(f, f.ID)
}

func (f *List) Delete() error {
	return db.Delete(f).Error
}
