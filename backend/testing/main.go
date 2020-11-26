package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type SignUpInfo struct {
	Username    string `json:"username"`
	Phonenumber string `json:"cellphone"`
	Password    string `json:"password"`
}

func main() {
	r := mux.NewRouter()
	// r.HandleFunc("/jessica", handleSendingdata)
	// r.HandleFunc("/recieve", handleRecivingdata)
	// r.HandleFunc("/signup", handleSignUp)
	r.HandleFunc("/signin", handleSignIn)
	http.ListenAndServe(":8080", r)
}
func handleSignIn(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Methods", "PUT")
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var pp SignUpInfo
	_ = json.NewDecoder(r.Body).Decode(&pp)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println(pp)
	// ls := pp.Username

	fmt.Println("this is foo!")
	// fmt.Printf("account created:%v\n", ls)
	// fmt.Printf("account created:%v,%v,%v", pp.Username, pp.Phonenumber, pp.Password)
	// _ = r.ParseForm()
	// fmt.Println(r.PostForm)
	sig := "You so fine so fat girl"
	err := json.NewEncoder(w).Encode(sig)
	if err != nil {
		fmt.Println(err)
	}
}

// func handleRecivingdata(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Add("Access-Control-Allow-Methods", "PUT")
// 	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	// fmt.Println("Got a Get Request, Sending Signal")
// 	// var pp Config
// 	// err := json.NewDecoder(r.Body).Decode(&pp)
// 	// if err != nil {
// 	// 	fmt.Println(err)
// 	// }
// 	// fmt.Println(pp.FatToe)

// 	// if err = r.ParseForm(); err != nil {
// 	// 	fmt.Println(err)
// 	// }
// 	// fmt.Println(r.PostForm)
// 	// _ = r.ParseForm()
// 	// fmt.Println(r.PostForm)

// 	sig := "You so fine so fat girl"
// 	err := json.NewEncoder(w).Encode(sig)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// }
// func handleSendingdata(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Add("Access-Control-Allow-Methods", "PUT")
// 	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	fmt.Println("Got a Get Request, Sending Signal")
// 	sig := "fatbitch"
// 	// dec := json.NewDecoder(r.Body)
// 	// var v interface{}
// 	// err := dec.Decode(&v)
// 	// if err != nil {
// 	// 	fmt.Println(err)
// 	// }
// 	// fmt.Println(v)
// 	var objmap map[string]json.RawMessage
// 	reqeustMSG, err := ioutil.ReadAll(r.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	err = json.Unmarshal(reqeustMSG, &objmap)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// 	fmt.Println(string(objmap["jessica"]))
// 	err = json.NewEncoder(w).Encode(sig)
// 	if err != nil {
// 		fmt.Println(err)
// 	}
// }

// func fattoes(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Got a Get Request,Printing msg, Sending Signal")
// 	fmt.Println(r.Body)
// 	sig := "good fat girl jessica"
// 	json.NewEncoder(w).Encode(sig)
// }
