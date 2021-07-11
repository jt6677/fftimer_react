package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/jt6677/ffdtimer/context"
	"github.com/jt6677/ffdtimer/models"
)

type Users struct {
	us           models.UserService
	storeSession *sessions.CookieStore
}

func NewUserService(us models.UserService, ss *sessions.CookieStore) *Users {
	return &Users{
		us:           us,
		storeSession: ss,
	}
}

type SessionUser struct {
	Username string `json:"name" `
}

type SignupJSON struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Email    string `json:"email"`
}
type SigninJSON struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func (u *Users) SignUp(w http.ResponseWriter, r *http.Request) {

	var signupForm SignupJSON
	if err := json.NewDecoder(r.Body).Decode(&signupForm); err != nil {
		log.Println(err)
		responseErrorJSON(fmt.Sprint(err), w)
	}

	newuser := models.User{
		Name:     signupForm.Name,
		Password: signupForm.Password,
		Email:    signupForm.Email,
	}
	if err := u.us.Create(&newuser); err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	//SignIn func which needs to return a Token

	founduser, err := u.us.Authenticate(signupForm.Name, signupForm.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	u.signIn(w, r, founduser)
}

func (u *Users) Signin(w http.ResponseWriter, r *http.Request) {

	signinJSON := SigninJSON{}
	if err := json.NewDecoder(r.Body).Decode(&signinJSON); err != nil {

		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	founduser, err := u.us.Authenticate(signinJSON.Name, signinJSON.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	u.signIn(w, r, founduser)

}

// signIn is used to sign the given user by giving a Token
func (u *Users) signIn(w http.ResponseWriter, r *http.Request, user *models.User) {
	session, _ := u.storeSession.Get(r, "session")
	sessionResponse := &SessionUser{

		Username: user.Name,
	}

	session.Values["activeUser"] = sessionResponse
	err := session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = json.NewEncoder(w).Encode(sessionResponse)
	if err != nil {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}

}

func (u *Users) IsLogin(w http.ResponseWriter, r *http.Request) (*SessionUser, error) {

	session, err := u.storeSession.Get(r, "session")
	if err != nil {
		// fmt.Println(err)
		return nil, err
	}
	if session.IsNew {
		return nil, errors.New("user is not logged in")
	}
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}
	err = session.Save(r, w)
	if err != nil {
		// fmt.Println(err)
		return nil, err
	}
	// Retrieve our struct and type-assert it
	val := session.Values["activeUser"]
	var user = &SessionUser{}
	user, ok := val.(*SessionUser)
	if !ok {
		return nil, errors.New("type assertion failed")
	}
	return user, err
}

func (u *Users) Logout(w http.ResponseWriter, r *http.Request) {
	session, _ := u.storeSession.Get(r, "session")
	session.Options.MaxAge = -1
	err := session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{Name: "session", MaxAge: -1})
	// http.SetCookie(w, &http.Cookie{Name: "_gorilla_csrf", MaxAge: -1})
	w.Write([]byte("Logout Successful"))
}

func (u *Users) Me(w http.ResponseWriter, r *http.Request) {

	user := context.User(r.Context())
	u.signIn(w, r, user)
}
