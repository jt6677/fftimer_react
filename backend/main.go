/*
DB info is in sql.config
*/
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/models"
	// "github.com/rs/cors"
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
	// userMw := middleware.User{
	// 	UserService: services.User,
	// }
	// requireUserMw := middleware.RequireUser{
	// 	User: userMw,
	// }

	r := mux.NewRouter()
	// r.Use(accessControlMiddleware)
	r.Handle("/favicon.ico", http.NotFoundHandler())

	r.HandleFunc("/recordsession", timeblockC.RecordSession).Methods("POST", "OPTIONS")
	r.HandleFunc("/signup", userC.SignUp).Methods("POST", "OPTIONS")
	r.HandleFunc("/signin", userC.Login).Methods("POST")
	// r.HandleFunc("/cookie", userC.Cookie).Methods("POST")
	r.HandleFunc("/dailysession/{id:[0-9]+}", timeblockC.Show).Methods("POST", "OPTIONS")
	// r.HandleFunc("/dailysession/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("GET", "OPTIONS")
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)

	// origin := handlers.AllowedOrigins([]string{"https://jt6677.github.io"})

	origin := handlers.AllowedOrigins([]string{cfg.Origin})

	// header := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"})
	header := handlers.AllowedHeaders([]string{"Access-Control-Allow-Headers", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin", "Origin", "Access-Control-Allow-Methods", "GET", "POST", "OPTIONS", "Content-Type", "*", "Accept", "Authorization", "X-Requested-With"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	creds := handlers.AllowCredentials()
	log.Fatal(http.ListenAndServe(cfg.Port, handlers.CORS(header, methods, origin, creds)(r)))
	// c := cors.New(cors.Options{
	// 	AllowedOrigins: []string{"https://jt6677.github.io"},
	// 	AllowedMethods: []string{"GET", "PUT", "POST", "OPTIONS"},
	// 	// AllowedMethods: []string{"*"},
	// 	AllowedHeaders: []string{"Access-Control-Allow-Headers", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "GET", "POST", "OPTIONS", "Content-Type", "*", "Accept", "Authorization"},
	// 	// AllowedHeaders:   []string{"Access-Control-Allow-Credentials"},
	// 	AllowCredentials: true,
	// })

	// handler := userMw.Apply(c.Handler(r))
	// handler := c.Handler(userMw.Apply(r))

	// http.ListenAndServe(cfg.Port, handler)
	// http.ListenAndServe(cfg.Port, r)
	// handler := c.Handler(userMw.Apply(r))

}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
