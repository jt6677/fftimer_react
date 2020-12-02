package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/jt6677/ffdtimer/context"
	"github.com/jt6677/ffdtimer/models"
)

func NewSessions(ss models.SessionService, us models.UserService) *Sessions {
	return &Sessions{
		ss: ss,
		us: us,
	}
}

var sCount int

type GetSessions struct {
	SessionCount string `json:"sessioncount"`
	Sessions
}
type Sessions struct {
	ss models.SessionService
	us models.UserService
}
type CurrnentSession struct {
	StartedAt string `json:"startedat"`
	// Timeduration string `json:"timeduration"`
}

func (s *Sessions) RecordSession(w http.ResponseWriter, r *http.Request) {

	var currentsession CurrnentSession
	if err := json.NewDecoder(r.Body).Decode(&currentsession); err != nil {
		log.Println(err)
	}
	dateid, err := models.DateIDGenerate()
	if err != nil {
		log.Println(err)
		return
	}

	user := context.User(r.Context())
	fmt.Println("user name:", user.Name)
	session := &models.Session{
		UserID:    user.ID,
		DateID:    dateid,
		StartedAt: currentsession.StartedAt,
	}

	if err := s.ss.CreateSession(session); err != nil {
		respondJSON("", fmt.Sprint(err), w)
		log.Println(err)
		return
	}

	respondJSON("Successfully Recorded currentSession", "", w)

}
func (s *Sessions) Show(w http.ResponseWriter, r *http.Request) {

	getsessions, count, err := s.dateByDateIDandUserID(r)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			respondJSON("", fmt.Sprint(err), w)
			return
		default:
			respondJSON("", "Whoops! Something went wrong.", w)
			return
		}
	}
	type SessionInfo struct {
		sessionid  string
		startedat  time.Time
		finishedat time.Time
	}
	sessionsInfos := make([]SessionInfo, count)
	for i, session := range getsessions {
		sessionsInfos[i] = SessionInfo{
			sessionid:  session.DateID,
			startedat:  session.CreatedAt,
			finishedat: session.UpdatedAt,
		}
	}
	type ReturnSessionQuery struct {
		Count    int64
		Sessions []SessionInfo
	}
	// t := &ReturnSessionQuery{
	// 	Count:    count,
	// 	Sessions: sessionsInfos,
	// }
	err = json.NewEncoder(w).Encode(getsessions)
	if err != nil {
		log.Println(err)
	}

}

func (s *Sessions) dateByDateIDandUserID(r *http.Request) ([]models.Session, int64, error) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// fmt.Println(idStr)
	user := context.User(r.Context())

	sessions, count, err := s.ss.ByDateIDandUserID(uint(user.ID), idStr)
	if err != nil {
		return nil, 0, err
	}

	return sessions, count, nil
}
