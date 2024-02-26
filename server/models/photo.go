package models

type Photo struct {
	Model
	Path   string `json:"path"`
	UserId uint   `json:"user_id"`
	TaskId uint   `json:"task_id"`
}

func (f *Photo) Create() error {
	return db.Create(f).Error
}

func (f *Photo) Update(n *Photo) {
	db.Model(&Photo{}).Where("id = ?", f.ID).Updates(n)
	db.Model(&Photo{}).First(f, f.ID)
}

func (f *Photo) Delete() error {
	return db.Delete(f).Error
}
