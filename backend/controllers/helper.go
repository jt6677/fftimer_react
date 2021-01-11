package controllers

import (
	"encoding/json"
	"log"
	"net/http"
)

type ResponseJSON struct {
	Response string `json:"response"`
	ErrorMSG string `json:"errormsg"`
}

func respondJSON(resp string, errorMSG string, w http.ResponseWriter) {

	respmsg := &ResponseJSON{Response: resp, ErrorMSG: errorMSG}
	w.Header().Set("Access-Control-Allow-Origin", "https://1q.gg")
	w.Header().Set("Access-Control-Allow-Methods", " GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,X-PINGOTHER,Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	// w.Header().Set("Content-Type", "text/html; charset=utf-8")

	err := json.NewEncoder(w).Encode(respmsg)
	if err != nil {
		log.Println(err)
	}
}
