/*
DB info is in sql.config
*/
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jt6677/ffdtimer/controllers"
	"github.com/jt6677/ffdtimer/jwtAuth"
	"github.com/jt6677/ffdtimer/middleware"
	"github.com/jt6677/ffdtimer/models"
	// "github.com/rs/cors"
)

var sCount int
var key = []byte("baibaibaisicsashunhuattoesf2023029f")

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

	jwtWrapper := jwtAuth.JwtService{
		SecretKey:       []byte(cfg.JWTkey),
		Issuer:          "FFtimer",
		ExpirationHours: 24,
	}
	userC := controllers.NewUsers(services.User, jwtWrapper)
	userMw := middleware.User{
		UserService: services.User,
		JwtService:  jwtWrapper,
	}
	requireUserMw := middleware.RequireUser{
		User: userMw,
	}

	r := mux.NewRouter()
	r.Use(CORS)
	r.Handle("/favicon.ico", http.NotFoundHandler())
	r.HandleFunc("/signup", userC.SignUp).Methods("POST", "OPTIONS")
	r.HandleFunc("/signin", userC.Login).Methods("POST")
	r.HandleFunc("/recordsession", requireUserMw.ApplyFn(timeblockC.RecordSession)).Methods("POST", "OPTIONS")
	r.HandleFunc("/dailysession/{id:[0-9]+}", requireUserMw.ApplyFn(timeblockC.Show)).Methods("POST", "GET", "OPTIONS")
	fmt.Printf("Listen%v, System is all GO!\n", cfg.Port)
	log.Fatal(http.ListenAndServe(cfg.Port, userMw.Apply(r)))

}
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set headers
		w.Header().Set("Access-Control-Allow-Origin", "https://1q.gg")
		w.Header().Set("Access-Control-Allow-Methods", " GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,X-PINGOTHER,Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
		return
	})
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
