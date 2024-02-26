package models

type File struct {
	Model
	Path   string `json:"path"`
	UserId uint   `json:"user_id"`
	TaskId uint   `json:"task_id"`
}

func (f *File) Create() error {
	return db.Create(f).Error
}

func (f *File) Update(n *File) {
	db.Model(&File{}).Where("id = ?", f.ID).Updates(n)
	db.Model(&File{}).First(f, f.ID)
}

func (f *File) Delete() error {
	return db.Delete(f).Error
}
