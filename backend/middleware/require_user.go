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
		fmt.Println(path)
		if strings.HasPrefix(path, "/api/signup") ||
			strings.HasPrefix(path, "/api/signin") ||
			strings.HasPrefix(path, "/api/logout") ||
			strings.HasPrefix(path, "/api/csrf") ||
			strings.HasPrefix(path, "/favicon.ico") ||
			strings.HasPrefix(path, "/mockServiceWorker") {
			next(w, r)
			return
		}
		fmt.Println("link visited: ", path)
		//Get session from  cookie
		sessionuser, err := mw.UserController.IsLogin(w, r)
		if err != nil {
			// fmt.Println(err)
			return
		}
		user, err := mw.UserService.ByName(sessionuser.Username)
		if err != nil {
			// fmt.Println(err)
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
