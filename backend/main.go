/*
DB info is in sql.config
*/
package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/models"

	"github.com/rs/cors"
)

var sCount int

func main() {
	cfg := LoadConfig()
	// psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
	// 	cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)
	services, err := models.NewServices(
		// models.WithGorm("postgres", psqlInfo),

		models.WithUser(cfg.PwPepper, cfg.HMACkey),

		// models.WithDate(),
		// models.WithTimeblock(),
	)
	must(err)

	// defer services.Close()
	// // services.DestructiveReset()
	// services.AutoMigrate()

	// timeblockC := controllers.NewTimeblocks(services.Timeblock, services.Date, cfg.TimerDuration)
	userC := controllers.NewUsers(services.User)
	// dateC := controllers.NewDates(services.Date, r)
	// userMw := middleware.User{
	// 	UserService: services.User,
	// }
	// requireUserMw := middleware.RequireUser{
	// 	User: userMw,
	// }

	r := mux.NewRouter()

	r.Handle("/favicon.ico", http.NotFoundHandler())
	// r.HandleFunc("/starting", requireUserMw.ApplyFn(timeblockC.RecordStartingTime)).Methods("POST")
	// r.HandleFunc("/ending", requireUserMw.ApplyFn(timeblockC.RecordEndingTime)).Methods("POST")
	// r.HandleFunc("/datepage/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("GET").Name("showDate")

	// r.Handle("/timer", timeblockC.NewView).Methods("GET")

	// r.HandleFunc("/", requireUserMw.ApplyFn(dateC.Create)).Methods("GET")
	// r.HandleFunc("/datepage/index", requireUserMw.ApplyFn(dateC.Index)).Methods("GET")
	// r.HandleFunc("/dateinput", requireUserMw.ApplyFn(dateC.DatePick)).Methods("POST")

	// r.HandleFunc("/cookies", userC.CookieTest).Methods("GET")
	r.HandleFunc("/signup", userC.SignUp).Methods("POST")
	r.HandleFunc("/signin", userC.Login).Methods("POST")
	// r.HandleFunc("/logout", requireUserMw.ApplyFn(userC.Logout)).Methods("GET")
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	handler := c.Handler(r)
	// http.ListenAndServe(cfg.Port, userMw.Apply(handler))
	http.ListenAndServe(cfg.Port, handler)
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
