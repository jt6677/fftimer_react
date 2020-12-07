package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jt6677/ffdtimer/context"
	"github.com/jt6677/ffdtimer/models"
)

type User struct {
	models.UserService
}
type UserToken struct {
	UserRemember string `json:"usertoken"`
}

func (mw *User) Apply(next http.Handler) http.HandlerFunc {
	return mw.ApplyFn(next.ServeHTTP)
}

func (mw *User) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		//remeber_token from cookie
		// cookie, err := r.Cookie("remember_token")
		// if err != nil {
		// 	fmt.Println(err)
		// 	next(w, r)
		// 	return
		// }

		//remeber_token from JSON
		var ur UserToken
		if err := json.NewDecoder(r.Body).Decode(&ur); err != nil {

			next(w, r)
			return
		}

		user, err := mw.UserService.ByRemember(ur.UserRemember)
		if err != nil {
			next(w, r)
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
		// if user == nil {
		// 	http.Redirect(w, r, "/signin", http.StatusFound)
		// 	return
		// }
		if user == nil {
			fmt.Println("Cannot Find User")
			return
		}

		next(w, r)
	})
}
