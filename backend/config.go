package main

import (
	"encoding/json"
	"os"
)

type PostGresConfig struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type Config struct {
	Port          string         `json:"port"`
	Database      PostGresConfig `json:"database"`
	TimerDuration int            `json:"timerDuration"`
	PwPepper      string         `json:"pepper"`
	HMACkey       string         `json:"hmackey"`
	Origin        string         `json:"origin"`
}

func LoadConfig() Config {
	var c Config
	f, err := os.Open(".config")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	err = json.NewDecoder(f).Decode(&c)

	return c
}
