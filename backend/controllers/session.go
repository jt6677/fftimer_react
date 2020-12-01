package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	// cookie, err := r.Cookie("remember_token")
	// if err != nil {
	// 	respondJSON("", fmt.Sprint(err), w)
	// 	log.Println(err)
	// 	return
	// }

	// user, err := s.us.ByRemember(cookie.Value)
	// if err != nil {
	// 	log.Println(err)
	// 	respondJSON("", fmt.Sprint(err), w)
	// 	return
	// }
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

// func (s *Sessions) Show(w http.ResponseWriter, r *http.Request) {
// 	//check UserID and DateID
// 	timeblocks, count, err := s.dateByDateIDandUserID(r)
// 	if err != nil {
// 		switch err {
// 		case models.ErrNotFound:
// 			http.Error(w, "Not DateID Exisits", http.StatusNotFound)
// 		default:
// 			http.Error(w, "Whoops! Something went wrong.", http.StatusInternalServerError)
// 		}
// 	}

// 	var vd views.Data
// 	if count > 0 {
// 		type Dateinfo struct {
// 			Dateid string
// 			Timed  time.Duration
// 			Status bool
// 		}

// 		// var durations []dateduration
// 		D := make([]Dateinfo, count)

// 		for i, ti := range timeblocks {
// 			start := ti.CreatedAt
// 			end := ti.UpdatedAt
// 			t := -start.Sub(end).Truncate(time.Second)
// 			// 	1h11m15.539182s
// 			D[i] = Dateinfo{
// 				Dateid: ti.DateID,
// 				Timed:  t,
// 				Status: ti.Finished,
// 			}
// 		}
// 		type TimeblockTable struct {
// 			Count     int64
// 			Dateinfos []Dateinfo
// 		}
// 		T := &TimeblockTable{
// 			Count:     count,
// 			Dateinfos: D,
// 		}
// 		// fmt.Println(len(timeblocks))
// 		vd.Yield = T
// 	} else {
// 		vd.Yield = nil
// 	}

// 	t.ShowView.Render(w, r, vd)
// }

// func (s *Sessions) dateByDateIDandUserID(r *http.Request) ([]models.Session, int64, error) {
// 	vars := mux.Vars(r)
// 	idStr := vars["id"]
// 	// fmt.Println(idStr)
// 	user := context.User(r.Context())

// 	date, count, err := t.ts.ByDateIDandUserID(uint(user.ID), idStr)
// 	if err != nil {
// 		return nil, 0, err
// 	}

// 	return date, count, nil
// }
