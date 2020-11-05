package main

import (
	"fmt"
	"html/template"

	"golang.org/x/crypto/bcrypt"
)

var tpl *template.Template

type Stuff struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func main() {
	xx, err := bcryptPassword("qweqweqwe")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(xx)

}
func bcryptPassword(password string) (string, error) {

	pwBytes := []byte(password + "secret-random-string")
	hashedBytes, err := bcrypt.GenerateFromPassword(pwBytes, bcrypt.DefaultCost)
	if err != nil {
		fmt.Print(err)
		return "", nil
	}
	xx := string(hashedBytes)
	return xx, nil

}
