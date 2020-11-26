package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jt6677/ffdtimer/models"
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
	NameOrCellphone string `json:"usernameorcellphone"`
	Password        string `json:"password"`
}

type ResponseJSON struct {
	Token    string `json:"token"`
	ErrorMSG string `json:"errormsg"`
}

func (u *Users) SignUp(w http.ResponseWriter, r *http.Request) {

	var signupJson SignupJSON
	if err := json.NewDecoder(r.Body).Decode(&signupJson); err != nil {
		log.Println(err)
		resp := &ResponseJSON{Token: "", ErrorMSG: "Failed to Decode SignupJson"}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			log.Println(err)
		}
	}
	// newuser := models.User{
	// 	Name:      signupJson.Name,
	// 	Password:  signupJson.Password,
	// 	Cellphone: signupJson.Cellphone,
	// }
	// if err := u.us.Create(&newuser); err != nil {
	// 	log.Println(err)
	// 	resp := &ResponseJSON{Token: "", ErrorMSG: "Failed to Create New Account"}
	// 	err = json.NewEncoder(w).Encode(resp)
	// 	if err != nil {
	// 		log.Println(err)
	// 	}
	// }
	//SignIn func which needs to return a Token
	fmt.Println("About to Sigup User")
	respondJSON("TokenSignup", "", w)
}

func (u *Users) Login(w http.ResponseWriter, r *http.Request) {

	signinJSON := SigninJSON{}
	if err := json.NewDecoder(r.Body).Decode(&signinJSON); err != nil {
		log.Println(err)
		resp := &ResponseJSON{Token: "", ErrorMSG: "Failed to Decode signinJSON"}
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			log.Println(err)
		}
	}
	fmt.Println("About to Sigin User")
	respondJSON("TokenLogin", "", w)
	// founduser, err := u.us.Authenticate(signinform.Name, signinform.Password)
	// if err != nil {
	// 	log.Println(err)

	// }
	// ResponseJSON

}

func respondJSON(token string, errorMSG string, w http.ResponseWriter) {

	resp := &ResponseJSON{Token: token, ErrorMSG: errorMSG}
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Println(err)
	}
}

// signIn is used to sign the given user by giving a Token
// func (u *Users) signIn(w http.ResponseWriter, user *models.User) error {
// 	if user.Remember == "" {
// 		token, err := rand.RememberToken()
// 		if err != nil {
// 			return err
// 		}
// 		user.Remember = token
// 		err = u.us.Update(user)
// 		if err != nil {
// 			return err
// 		}
// 	}

// }

// POST /logout
// func (u *Users) Logout(w http.ResponseWriter, r *http.Request) {

// 	user := context.User(r.Context())
// 	token, _ := rand.RememberToken()
// 	user.Remember = token
// 	u.us.Update(user)
// 	http.Redirect(w, r, "/", http.StatusFound)
// }
