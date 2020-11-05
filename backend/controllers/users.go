package controllers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/jt6677/htmlTimer/timerGit/context"
	"github.com/jt6677/htmlTimer/timerGit/models"
	"github.com/jt6677/htmlTimer/timerGit/rand"
	"github.com/jt6677/htmlTimer/timerGit/views"
)

type Users struct {
	NewView   *views.View
	NewinView *views.View
	NewupView *views.View
	us        models.UserService
}

func NewUsers(us models.UserService) *Users {
	return &Users{
		NewView:   views.NewView("signinsignup", "users/signinsignup"),
		NewinView: views.NewView("signin", "users/signin"),
		NewupView: views.NewView("signup", "users/signup"),
		us:        us,
	}
}

type SignupForm struct {
	Name      string `schema:"name"`
	Cellphone string `schema:"cellphone"`
	Password  string `schema:"password"`
}
type SigninForm struct {
	Name      string `schema:"name"`
	Cellphone string `schema:"cellphone"`
	Password  string `schema:"password"`
}

// GET /signup
func (u *Users) New(w http.ResponseWriter, r *http.Request) {
	u.NewView.Render(w, r, nil)
}
func (u *Users) Newup(w http.ResponseWriter, r *http.Request) {
	u.NewupView.Render(w, r, nil)
}
func (u *Users) Newin(w http.ResponseWriter, r *http.Request) {
	u.NewinView.Render(w, r, nil)
}
func (u *Users) Create(w http.ResponseWriter, r *http.Request) {
	var vd views.Data
	var signupform SignupForm
	if err := parseForm(r, &signupform); err != nil {
		log.Println(err)
		vd.Alert = &views.Alert{
			Level:     views.AlertLvlError,
			Message:   views.AlertMsgGeneric,
			StrongMsg: "Sorry! ",
		}
		u.NewupView.Render(w, r, vd)
		return
	}
	newuser := models.User{
		Name:      signupform.Name,
		Password:  signupform.Password,
		Cellphone: signupform.Cellphone,
	}
	if err := u.us.Create(&newuser); err != nil {
		log.Println(err)
		vd.Alert = &views.Alert{
			Level:     views.AlertLvlError,
			Message:   fmt.Sprint(err),
			StrongMsg: "Sorry! ",
		}
		u.NewupView.Render(w, r, vd)
		return
	}
	u.signIn(w, &newuser)
	http.Redirect(w, r, "/", http.StatusFound)

}
func (u *Users) Signin(w http.ResponseWriter, r *http.Request) {
	var vd views.Data
	signinform := SignupForm{}
	if err := parseForm(r, &signinform); err != nil {
		log.Println(err)
		vd.Alert = &views.Alert{
			Level:     views.AlertLvlError,
			Message:   views.AlertMsgGeneric,
			StrongMsg: "Sorry! ",
		}
		u.NewinView.Render(w, r, vd)
		return
	}

	founduser, err := u.us.Authenticate(signinform.Name, signinform.Password)
	if err != nil {
		log.Println(err)
		vd.Alert = &views.Alert{
			Level:     views.AlertLvlError,
			Message:   fmt.Sprint(err),
			StrongMsg: "Sorry! ",
		}
		u.NewinView.Render(w, r, vd)
		return
	}
	u.signIn(w, founduser)
	http.Redirect(w, r, "/", http.StatusFound)
}

// signIn is used to sign the given user in via cookies
func (u *Users) signIn(w http.ResponseWriter, user *models.User) error {
	if user.Remember == "" {
		token, err := rand.RememberToken()
		if err != nil {
			return err
		}
		user.Remember = token
		err = u.us.Update(user)
		if err != nil {
			return err
		}
	}

	cookie := http.Cookie{
		Name:     "remember_token",
		Value:    user.Remember,
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)
	return nil
}

// POST /logout
func (u *Users) Logout(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{
		Name:     "remember_token",
		Value:    "",
		Expires:  time.Now(),
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)

	user := context.User(r.Context())
	token, _ := rand.RememberToken()
	user.Remember = token
	u.us.Update(user)
	http.Redirect(w, r, "/", http.StatusFound)
}
