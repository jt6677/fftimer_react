package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/jt6677/ffdtimer/context"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/models"
)

type User struct {
	UserService    models.UserService
	UserController controllers.Users
}

func (mw *User) Apply(next http.Handler) http.HandlerFunc {
	return mw.ApplyFn(next.ServeHTTP)
}

func (mw *User) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//check if url needs authentication
		path := r.URL.Path
		if strings.HasSuffix(path, "/signup") ||
			strings.HasSuffix(path, "/signin") ||
			strings.HasSuffix(path, "/logout") ||
			strings.HasSuffix(path, "/csrf") ||
			strings.HasSuffix(path, "/favicon.ico") ||
			strings.HasSuffix(path, "/mockServiceWorker") {
			next(w, r)
			return
		}
		//Get session from  cookie
		sessionuser, err := mw.UserController.IsLogin(w, r)
		if err != nil {
			return
		}
		user, err := mw.UserService.ByName(sessionuser.Username)
		if err != nil {
			return
		}
		ctx := r.Context()
		ctx = context.WithUser(ctx, user)
		r = r.WithContext(ctx)
		next(w, r)
	})
}

type RequireUser struct {
	User
}

func (mw *RequireUser) Apply(next http.Handler) http.HandlerFunc {
	return mw.ApplyFn(next.ServeHTTP)
	//ServeHTTP is the HandlerFunc
}

func (mw *RequireUser) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := context.User(r.Context())

		if user == nil {
			fmt.Println("Cannot Find User")
			return
		}

		next(w, r)
	})
}
