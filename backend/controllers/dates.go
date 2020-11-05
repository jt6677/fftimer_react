package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jt6677/htmlTimer/timerGit/context"
	"github.com/jt6677/htmlTimer/timerGit/models"
	"github.com/jt6677/htmlTimer/timerGit/views"
)

type Dates struct {
	DatePageView *views.View
	ShowView     *views.View
	IndexView    *views.View
	ds           models.DateService
	r            *mux.Router
}

func NewDates(ds models.DateService, r *mux.Router) *Dates {
	return &Dates{
		DatePageView: views.NewView("datepage", "datepage/datepage"),
		ShowView:     views.NewView("bootstrap", "datepage/show"),
		IndexView:    views.NewView("bootstrap", "datepage/index"),
		ds:           ds,
		r:            r,
	}
}

type DateForm struct {
	Date string `schema:"date"`
}

//Home
func (d *Dates) Create(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())
	//TODO: THIS IS FUCKED
	_, _, err := d.ds.ByUserID(user.ID)
	if err != nil {
		http.Redirect(w, r, "/signin", http.StatusFound)
		return

	}
	var vd views.Data

	a := &views.Alert{
		Level:     views.AlertLvlInfo,
		Message:   views.AlertMsgWelcome,
		StrongMsg: views.AlertStrongMsg,
	}
	vd.Alert = a

	d.DatePageView.Render(w, r, vd)
}

// GET /galleries
func (d *Dates) Index(w http.ResponseWriter, r *http.Request) {
	user := context.User(r.Context())
	dates, count, err := d.ds.ByUserID(user.ID)
	if err != nil {
		http.Error(w, "Something went wrong.", http.StatusInternalServerError)
		return
	}
	if count > 0 {
		var vd views.Data
		type Datescollection struct {
			DateID string
		}
		D := make([]Datescollection, count)
		for i, ti := range dates {

			D[i] = Datescollection{
				DateID: ti.DateID,
			}
		}
		type TimeblockTable struct {
			Count            int64
			Datescollections []Datescollection
			UserName         string
		}
		T := &TimeblockTable{
			Count:            count,
			Datescollections: D,
			UserName:         user.Name,
		}
		vd.Yield = T
		vd.User = user
		d.IndexView.Render(w, r, vd)
	} else {
		d.IndexView.Render(w, r, nil)
	}
	// fmt.Fprint(w, dates)
}

func (d *Dates) DatePick(w http.ResponseWriter, r *http.Request) {
	var dateform DateForm
	if err := parseForm(r, &dateform); err != nil {
		fmt.Println(err)
	}
	datedd := strings.ReplaceAll(dateform.Date, "-", "")

	//if the r.Context has the userKey , we can use the user we looked up
	user := context.User(r.Context())

	newdate := models.Date{
		DateID: datedd,
		UserID: user.ID,
	}
	//Check if dateID already exist
	existing, err := d.ds.ByDateID(newdate.DateID)
	if err == models.ErrNotFound {
		// TODO: Make a better error
		http.Redirect(w, r, "/", http.StatusFound)
		return
	} else {
		url, err := d.r.Get("showDate").URL("id", fmt.Sprintf("%v", existing.DateID))
		if err != nil {
			// TODO: Make this go to the index page
			http.Redirect(w, r, "/", http.StatusFound)
			return
		}
		http.Redirect(w, r, url.Path, http.StatusFound)
	}

}

//GET /dates/:id
func (d *Dates) Show(w http.ResponseWriter, r *http.Request) {
	date, err := d.dateByDateID(w, r)
	if err != nil {
		// http.Error(w, "Something went wrong.", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	var vd views.Data
	vd.Yield = date

	d.ShowView.Render(w, r, vd)
}

func (d *Dates) dateByDateID(w http.ResponseWriter, r *http.Request) (*models.Date, error) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	// id, err := strconv.Atoi(idStr)
	// if err != nil {
	// 	http.Error(w, "Invalid Date ID", http.StatusNotFound)
	// }
	date, err := d.ds.ByDateID(idStr)
	if err != nil {
		switch err {
		case models.ErrNotFound:
			http.Error(w, "Not DateID Exisits", http.StatusNotFound)
		default:
			http.Error(w, "Whoops! Something went wrong.", http.StatusInternalServerError)
		}
		return nil, err
	}
	return date, nil
}
