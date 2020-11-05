/*
DB info is in sql.config
*/
package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jt6677/htmlTimer/timerGit/controllers"
	"github.com/jt6677/htmlTimer/timerGit/middleware"
	"github.com/jt6677/htmlTimer/timerGit/models"
)

var sCount int

func main() {
	cfg := LoadConfig()
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Name)
	services, err := models.NewServices(
		models.WithGorm("postgres", psqlInfo),

		models.WithUser(cfg.PwPepper, cfg.HMACkey),

		models.WithDate(),
		models.WithTimeblock(),
	)
	must(err)

	defer services.Close()
	// services.DestructiveReset()
	services.AutoMigrate()
	r := mux.NewRouter()

	timeblockC := controllers.NewTimeblocks(services.Timeblock, services.Date, cfg.TimerDuration)
	userC := controllers.NewUsers(services.User)
	dateC := controllers.NewDates(services.Date, r)
	userMw := middleware.User{
		UserService: services.User,
	}
	requireUserMw := middleware.RequireUser{
		User: userMw,
	}

	r.Handle("/favicon.ico", http.NotFoundHandler())
	r.HandleFunc("/starting", requireUserMw.ApplyFn(timeblockC.RecordStartingTime)).Methods("POST")
	r.HandleFunc("/ending", requireUserMw.ApplyFn(timeblockC.RecordEndingTime)).Methods("POST")
	r.HandleFunc("/datepage/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("GET").Name("showDate")

	r.Handle("/timer", timeblockC.NewView).Methods("GET")

	r.HandleFunc("/", requireUserMw.ApplyFn(dateC.Create)).Methods("GET")
	r.HandleFunc("/datepage/index", requireUserMw.ApplyFn(dateC.Index)).Methods("GET")
	r.HandleFunc("/dateinput", requireUserMw.ApplyFn(dateC.DatePick)).Methods("POST")

	r.HandleFunc("/signinandsignup", userC.New).Methods("GET")
	r.HandleFunc("/signup", userC.Newup).Methods("GET")
	r.HandleFunc("/signin", userC.Newin).Methods("GET")
	// r.HandleFunc("/cookies", userC.CookieTest).Methods("GET")
	r.HandleFunc("/signup", userC.Create).Methods("POST")
	r.HandleFunc("/signin", userC.Signin).Methods("POST")
	r.HandleFunc("/logout", requireUserMw.ApplyFn(userC.Logout)).Methods("GET")
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)

	assetHandler := http.FileServer(http.Dir("./assets/"))
	assetHandler = http.StripPrefix("/assets/", assetHandler)
	r.PathPrefix("/assets/").Handler(assetHandler)
	http.ListenAndServe(cfg.Port, userMw.Apply(r))
}

// func homepage(w http.ResponseWriter, r *http.Request) {
// 	tpl.ExecuteTemplate(w, "index.html", nil)
// }

func must(err error) {
	if err != nil {
		panic(err)
	}
}
