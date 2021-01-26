package controllers

import (
	"encoding/json"
	"log"
	"net/http"
)

type ResponseJSON struct {
	Token string `json:"token"`
	ExpiresAt string `json:"expiresAt"`
	Message string `json:"message"`
}
type ResponseErrorJSON struct {
	ErrorMessage string `json:"errormessage"`
}

func responseErrorJSON(errorMessage string, w http.ResponseWriter){
	respmsg := &ResponseErrorJSON{ErrorMessage: errorMessage}
	err := json.NewEncoder(w).Encode(respmsg)
	if err != nil {
		log.Println(err)
	}
}

func respondJSON(token string,expiresAt string, message string, w http.ResponseWriter) {

	respmsg := &ResponseJSON{Token: token,ExpiresAt:expiresAt, Message: message}
	// w.Header().Set("Access-Control-Allow-Origin", "https://1q.gg")
	// w.Header().Set("Access-Control-Allow-Methods", " GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
	// w.Header().Set("Access-Control-Allow-Headers", "Content-Type,X-PINGOTHER,Authorization")
	// w.Header().Set("Access-Control-Allow-Credentials", "true")
	// w.Header().Set("Content-Type", "text/html; charset=utf-8")

	err := json.NewEncoder(w).Encode(respmsg)
	if err != nil {
		log.Println(err)
	}
}
