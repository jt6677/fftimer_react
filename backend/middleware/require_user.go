package middleware

import (
	"net/http"

	"github.com/jt6677/htmlTimer/timerGit/context"
	"github.com/jt6677/htmlTimer/timerGit/models"
)

type User struct {
	models.UserService
}

func (mw *User) Apply(next http.Handler) http.HandlerFunc {
	return mw.ApplyFn(next.ServeHTTP)
}

func (mw *User) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("remember_token")
		if err != nil {
			next(w, r)
			return
		}
		user, err := mw.UserService.ByRemember(cookie.Value)
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
		if user == nil {
			http.Redirect(w, r, "/signin", http.StatusFound)
			return
		}
		next(w, r)
	})
}

// type User struct {
// 	models.UserService
// }

// func (mw *User) Apply(next http.Handler) http.HandlerFunc {
// 	return mw.ApplyFn(next.ServeHTTP)
// }

// func (mw *User) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		path := r.URL.Path
// 		// If the user is requesting a static asset or image
// 		// we will not need to lookup the current user so we skip
// 		// doing that.
// 		if strings.HasPrefix(path, "/assets/") ||
// 			strings.HasPrefix(path, "/images/") {
// 			next(w, r)
// 			return
// 		}
// 		cookie, err := r.Cookie("remember_token")
// 		if err != nil {
// 			next(w, r)
// 			return
// 		}
// 		user, err := mw.UserService.ByRemember(cookie.Value)
// 		if err != nil {
// 			next(w, r)
// 			return
// 		}
// 		ctx := r.Context()
// 		ctx = context.WithUser(ctx, user)
// 		r = r.WithContext(ctx)
// 		next(w, r)
// 	})
// }

// // RequireUser assumes that User middleware has already been run
// // otherwise it will no work correctly.
// type RequireUser struct {
// 	User
// }

// // Apply assumes that User middleware has already been run
// // otherwise it will no work correctly.
// func (mw *RequireUser) Apply(next http.Handler) http.HandlerFunc {
// 	return mw.ApplyFn(next.ServeHTTP)
// 	//ServeHTTP is the HandlerFunc
// }

// // ApplyFn assumes that User middleware has already been run
// // otherwise it will no work correctly.
// func (mw *RequireUser) ApplyFn(next http.HandlerFunc) http.HandlerFunc {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		user := context.User(r.Context())
// 		if user == nil {
// 			http.Redirect(w, r, "/signup", http.StatusFound)
// 			return
// 		}
// 		next(w, r)
// 	})
// }
