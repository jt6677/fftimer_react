/*
DB info is in sql.config
*/
package main

import (
	"encoding/gob"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/middleware"
	"github.com/jt6677/ffdtimer/models"
	// "github.com/rs/cors"
)

func init() {
	// type M map[string]interface{}
	gob.Register(&controllers.SessionUser{})
	// gob.Register(&M{})

}

func main() {
	cfg := LoadConfig()
	var store = sessions.NewCookieStore([]byte(cfg.SessionSecret))
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)
	services, err := models.NewServices(
		models.WithGorm("postgres", psqlInfo),
		models.WithUser(cfg.PwPepper, cfg.HMACkey),
		models.WithSession(),
	)
	// b, err := rand.Bytes(32)
	// csrfMw := csrf.Protect(b)
	must(err)

	defer services.Close()
	// services.DestructiveReset()
	services.AutoMigrate()

	timeblockC := controllers.NewSessions(services.Session, services.User)

	userC := controllers.NewUserService(services.User, store)
	userMw := middleware.User{
		UserService:    services.User,
		UserController: *userC,
	}
	requireUserMw := middleware.RequireUser{
		User: userMw,
	}

	r := mux.NewRouter()
	//csrf
	r.Handle("/favicon.ico", http.NotFoundHandler())
	if cfg.IsProd() {
		r.HandleFunc("/csrf", csrfResponse)
		r.HandleFunc("/me", requireUserMw.ApplyFn(userC.Me)).Methods("GET")
		r.HandleFunc("/signup", userC.SignUp).Methods("POST")
		r.HandleFunc("/signin", userC.Signin).Methods("POST")
		r.HandleFunc("/recordsession", requireUserMw.ApplyFn(timeblockC.RecordSession))
		r.HandleFunc("/dailysession/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("POST", "GET", "OPTIONS")
		r.HandleFunc("/logout", userC.Logout)
		fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)
	} else {
		r.HandleFunc("/api/csrf", csrfResponse)
		r.HandleFunc("/api/me", requireUserMw.ApplyFn(userC.Me)).Methods("GET")
		r.HandleFunc("/api/signup", userC.SignUp).Methods("POST")
		r.HandleFunc("/api/signin", userC.Signin).Methods("POST")
		r.HandleFunc("/api/recordsession", requireUserMw.ApplyFn(timeblockC.RecordSession))
		r.HandleFunc("/api/dailysession/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("POST", "GET", "OPTIONS")
		r.HandleFunc("/api/logout", userC.Logout)
	}
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)
	log.Fatal(http.ListenAndServe(cfg.Port, userMw.Apply(r)))
	// log.Fatal(http.ListenAndServe(":8080", csrfMw(userMw.Apply(r))))

}

func must(err error) {
	if err != nil {
		panic(err)
	}
}

func csrfResponse(w http.ResponseWriter, r *http.Request) {
	type CsrfToken struct {
		Csrf string `json:"csrf"`
	}
	csrfResponse := &CsrfToken{
		Csrf: csrf.Token(r),
	}
	// w.Header().Set("X-CSRF-Token", csrf.Token(r))
	err := json.NewEncoder(w).Encode(csrfResponse)
	if err != nil {
		http.Error(w, "Not Authorized", http.StatusUnauthorized)
		return
	}
}
