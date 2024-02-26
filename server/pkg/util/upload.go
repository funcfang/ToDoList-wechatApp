package util

import (
	"log"
	"os"
)

func ExistsOrCreate(path string) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err = os.Mkdir(path, os.ModePerm)
		if err != nil {
			log.Fatal("[ExistsOrCreate] fail to create ", path)
		}
	}
}
