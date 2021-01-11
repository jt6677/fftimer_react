package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jt6677/ffdtimer/jwtAuth"
	"github.com/jt6677/ffdtimer/models"
)

type Users struct {
	us  models.UserService
	jwt jwtAuth.JwtService
}

func NewUsers(us models.UserService, jwt jwtAuth.JwtService) *Users {
	return &Users{
		us:  us,
		jwt: jwt,
	}
}

type SignupJSON struct {
	Name      string `json:"username"`
	Password  string `json:"password"`
	Cellphone string `json:"cellphone"`
}
type SigninJSON struct {
	Name     string `json:"username"`
	Password string `json:"password"`
}

func (u *Users) SignUp(w http.ResponseWriter, r *http.Request) {

	var signupForm SignupJSON
	if err := json.NewDecoder(r.Body).Decode(&signupForm); err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
	}

	newuser := models.User{
		Name:      signupForm.Name,
		Password:  signupForm.Password,
		Cellphone: signupForm.Cellphone,
	}
	if err := u.us.Create(&newuser); err != nil {
		log.Println(err)

		respondJSON("TokenSignup", fmt.Sprint(err), w)
		return
	}
	//SignIn func which needs to return a Token

	founduser, err := u.us.Authenticate(signupForm.Name, signupForm.Password)
	if err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
		return
	}
	u.signIn(w, founduser)
}

func (u *Users) Login(w http.ResponseWriter, r *http.Request) {

	signinJSON := SigninJSON{}
	if err := json.NewDecoder(r.Body).Decode(&signinJSON); err != nil {
		log.Println("JSON:", err)
		respondJSON("", fmt.Sprint(err), w)
	}

	founduser, err := u.us.Authenticate(signinJSON.Name, signinJSON.Password)
	if err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
		return
	}
	u.signIn(w, founduser)

}

// signIn is used to sign the given user by giving a Token
func (u *Users) signIn(w http.ResponseWriter, user *models.User) {
	signedtoken, err := u.jwt.GenerateToken(user.Name)
	if err != nil {
		fmt.Println(err)
		return
	}

	respondJSON(signedtoken, "", w)
}
