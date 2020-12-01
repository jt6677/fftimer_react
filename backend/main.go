/*
DB info is in sql.config
*/
package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/middleware"
	"github.com/jt6677/ffdtimer/models"

	"github.com/rs/cors"
)

var sCount int

func main() {
	cfg := LoadConfig()
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)
	services, err := models.NewServices(
		models.WithGorm("postgres", psqlInfo),
		models.WithUser(cfg.PwPepper, cfg.HMACkey),
		models.WithSession(),
	)
	must(err)

	defer services.Close()
	// services.DestructiveReset()
	services.AutoMigrate()

	timeblockC := controllers.NewSessions(services.Session, services.User)
	userC := controllers.NewUsers(services.User)
	userMw := middleware.User{
		UserService: services.User,
	}
	requireUserMw := middleware.RequireUser{
		User: userMw,
	}

	r := mux.NewRouter()

	r.Handle("/favicon.ico", http.NotFoundHandler())

	r.HandleFunc("/recordsession", requireUserMw.ApplyFn(timeblockC.RecordSession)).Methods("POST")
	// r.HandleFunc("/recordsession", timeblockC.RecordSession).Methods("POST")

	r.HandleFunc("/signup", userC.SignUp).Methods("POST")
	r.HandleFunc("/signin", userC.Login).Methods("POST")
	r.HandleFunc("/cookie", userC.Cookie).Methods("POST")
	// r.HandleFunc("/datepage/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("GET").Name("showDate")
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	handler := c.Handler(r)
	http.ListenAndServe(cfg.Port, userMw.Apply(handler))
	// http.ListenAndServe(cfg.Port, handler)
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
