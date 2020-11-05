package models

import (
	"regexp"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Date struct {
	gorm.Model
	UserID uint   `gorm:"not null"`
	DateID string `gorm:"not null;unique_index"`
}
type DateDB interface {
	//Methods for querying for signle date
	ByDateID(dateID string) (*Date, error)
	ByUserID(id uint) ([]Date, int64, error)
	ByDateIDandUserID(date *Date) (*Date, error)
	// 	//alter
	Create(date *Date) error
}
type DateService interface {
	DateDB
}
type dateService struct {
	DateDB
}
type dateGorm struct {
	db *gorm.DB
}

type dateValidator struct {
	DateDB
	dateRegex *regexp.Regexp
}

var _ DateDB = &dateGorm{}
var _ DateService = &dateService{}
var _ DateDB = &dateValidator{}

func NewDateSerivce(db *gorm.DB) DateService {
	ug := &dateGorm{db}
	return &dateService{
		DateDB: &dateValidator{
			DateDB:    ug,
			dateRegex: regexp.MustCompile(`^(202[0-9])+(0[1-9]|1[0-2])+([0-2][0-9]|(3)[0-1])$`),
			// dateRegex: regexp.MustCompile(`^(202[0-9])+(0[1-9]|1[0-2])+(0[1-9]|1[0-9]|2[0-9]|3[0-1])$`),
		},
	}
}

func (dg *dateGorm) Create(date *Date) error {
	// t := time.Now()
	// date.DateID = t.Format("20060102")
	return dg.db.Create(date).Error
}
func (dg *dateGorm) ByDateID(dateID string) (*Date, error) {
	var date Date
	db := dg.db.Where("date_id = ?", dateID)
	err := first(db, &date)
	return &date, err
}

func (dg *dateGorm) ByUserID(userID uint) ([]Date, int64, error) {
	var dates []Date

	result := dg.db.Where("user_id = ?", userID).Find(&dates)
	err := result.Error
	count := result.RowsAffected
	return dates, count, err
}

func (dg *dateGorm) ByDateIDandUserID(date *Date) (*Date, error) {
	var dateDB Date
	db := dg.db.Where("date_id = ? and user_id=?", date.DateID, date.UserID)
	err := first(db, &dateDB)
	return &dateDB, err
}
func (dv *dateValidator) Create(date *Date) error {
	err := runDateValFunc(date,
		dv.dateValidate,
		dv.userIDRequired)
	if err != nil {
		return err
	}
	return dv.DateDB.Create(date)
}

func (dv *dateValidator) dateValidate(date *Date) error {
	if date.DateID == "" {
		return nil
	}
	// t := time.Now()
	// datenow := t.Format("20060102")
	if !dv.dateRegex.MatchString(date.DateID) {
		return ErrDateInvalid
	}
	return nil
}

func (dv *dateValidator) userIDRequired(date *Date) error {
	if date.UserID <= 0 {
		return ErrUserIDRequired
	}
	return nil
}

type dateValFunc func(*Date) error

func runDateValFunc(date *Date, fns ...dateValFunc) error {
	for _, fn := range fns {
		if err := fn(date); err != nil {
			return err
		}
	}
	return nil
}
