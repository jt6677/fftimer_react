package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jt6677/ffdtimer/models"
	"github.com/jt6677/ffdtimer/rand"
)

type Users struct {
	us models.UserService
}

func NewUsers(us models.UserService) *Users {
	return &Users{
		us: us,
	}
}

type SignupJSON struct {
	Name      string `json:"username"`
	Cellphone string `json:"cellphone"`
	Password  string `json:"password"`
}
type SigninJSON struct {
	Name     string `json:"username"`
	Password string `json:"password"`
}

func (u *Users) SignUp(w http.ResponseWriter, r *http.Request) {

	var signupJson SignupJSON
	if err := json.NewDecoder(r.Body).Decode(&signupJson); err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
	}
	newuser := models.User{
		Name:      signupJson.Name,
		Password:  signupJson.Password,
		Cellphone: signupJson.Cellphone,
	}
	if err := u.us.Create(&newuser); err != nil {
		log.Println(err)

		respondJSON("TokenSignup", fmt.Sprint(err), w)
		return
	}
	//SignIn func which needs to return a Token
	fmt.Println("About to Sigup User")
	founduser, err := u.us.Authenticate(signupJson.Name, signupJson.Password)
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
		log.Println(err)
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

// func (u *Users) Cookie(w http.ResponseWriter, r *http.Request) {

// 	var ss SS
// 	if err := json.NewDecoder(r.Body).Decode(&ss); err != nil {
// 		log.Println(err)
// 	}
// 	fmt.Println("ss", ss)

// 	json.NewEncoder(w).Encode("aa")
// }

// signIn is used to sign the given user by giving a Token
func (u *Users) signIn(w http.ResponseWriter, user *models.User) {
	if user.Remember == "" {
		token, err := rand.RememberToken()
		if err != nil {
			return
		}
		user.Remember = token
		err = u.us.Update(user)
		if err != nil {
			return
		}
	}
	respondJSON(user.Remember, "", w)
}

// POST /logout
// func (u *Users) Logout(w http.ResponseWriter, r *http.Request) {

// 	user := context.User(r.Context())
// 	token, _ := rand.RememberToken()
// 	user.Remember = token
// 	u.us.Update(user)
// 	http.Redirect(w, r, "/", http.StatusFound)
// }
