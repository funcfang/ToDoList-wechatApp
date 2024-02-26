package util

//func PasswordHash(password string) string {
//	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
//	return cast.ToString(bytes)
//}

//func PasswordVerify(hashedPassword, password string) error {
//	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
//}

func PasswordVerify(hashedPassword, password string) bool {
	if hashedPassword == password {
		return true
	}
	return false
}
