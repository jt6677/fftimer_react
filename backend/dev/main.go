package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/rs/cors"
)

type SignUpInfo struct {
	Username    string `json:"username"`
	Phonenumber string `json:"cellphone"`
	Password    string `json:"password"`
}
type SignInInfo struct {
	Username string `json:"username"`
	Password string `json:"password"`
	//
}
type SignIn struct {
	Token    string `json:"token"`
	Error    bool   `json:"error"`
	ErrorMSG string `json:"errorMSG"`
	//
}

func main() {

	// l := hclog.Default()
	r := mux.NewRouter()
	// fmt.Println("this is foo1!")

	// r.HandleFunc("/jessica", handleSendingdata)
	// r.HandleFunc("/recieve", handleRecivingdata)
	r.HandleFunc("/signup", handleSignUp)
	r.HandleFunc("/signin", handleSignIn)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	// ch := gohandlers.CORS(gohandlers.AllowedOrigins([]string{"*"}))
	handler := c.Handler(r)
	http.ListenAndServe(":8080", handler)
	// s := http.Server{
	// 	Addr:         *bindAddress,                                     // configure the bind address
	// 	Handler:      ch(r),                                            // set the default handler
	// 	ErrorLog:     l.StandardLogger(&hclog.StandardLoggerOptions{}), // set the
	// 	ReadTimeout:  5 * time.Second,                                  // max time to read request from the client
	// 	WriteTimeout: 10 * time.Second,                                 // max time to write response to the client
	// 	IdleTimeout:  120 * time.Second,                                // max time for connections using TCP Keep-Alive
	// }
	// go func() {
	// 	l.Info("Starting server on port 8080")

	// 	err := s.ListenAndServe()
	// 	if err != nil {
	// 		l.Error("Error starting server", "error", err)
	// 		os.Exit(1)
	// 	}
	// }()

}
func handleSignUp(w http.ResponseWriter, r *http.Request) {
	// w.Header().Add("Access-Control-Allow-Methods", "PUT")
	// w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	var pp SignUpInfo
	err := json.NewDecoder(r.Body).Decode(&pp)
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println(pp)
	// ls := pp.Username

	fmt.Printf("account created:%v,%v,%v", pp.Username, pp.Phonenumber, pp.Password)

	// sig := "Account Info Recieved"

	res := &SignIn{Token: "haha", Error: true, ErrorMSG: "nana"}
	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		fmt.Println(err)
	}
}
func handleSignIn(w http.ResponseWriter, r *http.Request) {
	// w.Header().Add("Access-Control-Allow-Methods", "PUT")
	// w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	var pp SignInInfo
	err := json.NewDecoder(r.Body).Decode(&pp)
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println(pp)
	// ls := pp.Username

	fmt.Printf("Account:%v Aassword: %v\n", pp.Username, pp.Password)

	res := &SignIn{Token: "haha", Error: false, ErrorMSG: "nana"}
	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		fmt.Println(err)
	}
}
