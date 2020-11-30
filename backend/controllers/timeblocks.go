package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jt6677/ffdtimer/context"
	"github.com/jt6677/ffdtimer/models"
)

func NewTimeblocks(ts models.TimeblockService, ds models.DateService, timerDuration int) *Timeblocks {
	return &Timeblocks{

		ts:            ts,
		ds:            ds,
		timerDuration: timerDuration,
	}
}

var sCount int

type Timeblocks struct {
	ts            models.TimeblockService
	ds            models.DateService
	timerDuration int
}
type Timer struct {
	Startingtime string `json:"startingtime"`
	Timeduration string `json:"timeduration"`
}

func (t *Timeblocks) RecordStartingTime(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())
	dateid, err := models.DateIDcheck()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	timeblock := &models.Timeblock{
		UserID: user.ID,
		DateID: dateid,
	}
	date := &models.Date{
		UserID: user.ID,
		DateID: dateid,
	}
	_, err = t.ds.ByDateIDandUserID(date)
	switch err {
	case models.ErrNotFound:
		if err := t.ds.Create(date); err != nil {
			fmt.Println("err:", err)
		}
	case nil:
		break
	default:
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := t.ts.CreateSession(timeblock); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	sCount++
	fmt.Printf("Done: %v Let's Fucking Go!\n", sCount)
	nt := &Timer{
		Startingtime: time.Now().Format("15:04:05"),
		Timeduration: t.timerDuration,
	}
	json.NewEncoder(w).Encode(nt)

}
func (t *Timeblocks) RecordEndingTime(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())
	timeblock := &models.Timeblock{
		UserID: user.ID,
	}
	if err := t.ts.FinishSession(timeblock); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	s := time.Now().Format("15:04:05")
	json.NewEncoder(w).Encode(s)

}

//GET  /datepage/{id:[0-9]+}  /datepage/20200910
//Show Display given dateid by the Logged in User
// func (t *Timeblocks) Show(w http.ResponseWriter, r *http.Request) {
// 	//check UserID and DateID
// 	timeblocks, count, err := t.dateByDateIDandUserID(r)
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

// func (t *Timeblocks) dateByDateIDandUserID(r *http.Request) ([]models.Timeblock, int64, error) {
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
