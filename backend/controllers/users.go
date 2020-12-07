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
	Password  string `json:"password"`
	Cellphone string `json:"cellphone"`
}
type SigninJSON struct {
	Name     string `json:"username"`
	Password string `json:"password"`
}

func (u *Users) SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var signupForm SignupJSON
	if err := json.NewDecoder(r.Body).Decode(&signupForm); err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
	}
	fmt.Println(signupForm)
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
	fmt.Println("About to Sigup User")
	founduser, err := u.us.Authenticate(signupForm.Name, signupForm.Password)
	if err != nil {
		log.Println(err)
		respondJSON("", fmt.Sprint(err), w)
		return
	}
	u.signIn(w, founduser)
}

func (u *Users) Login(w http.ResponseWriter, r *http.Request) {
	// w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	signinJSON := SigninJSON{}
	if err := json.NewDecoder(r.Body).Decode(&signinJSON); err != nil {
		log.Println("JSON:", err)
		respondJSON("", fmt.Sprint(err), w)
	}
	fmt.Println("name:", signinJSON.Name)
	fmt.Println(signinJSON.Password)
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
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
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
