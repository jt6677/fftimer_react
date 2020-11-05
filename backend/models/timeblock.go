package models

import (
	"strconv"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Timeblock struct {
	gorm.Model
	UserID   uint   `gorm:"not_null"`
	DateID   string `gorm:"not_null"`
	Finished bool
}
type TimeblockDB interface {
	CreateSession(timeblock *Timeblock) error
	FinishSession(timeblock *Timeblock) error
	ByUserID(userID uint) ([]Timeblock, error)
	ByDateID(DateID string) ([]Timeblock, error)
	ByDateIDandUserID(userID uint, DateID string) ([]Timeblock, int64, error)
	LastUnfinishedSession() (*Timeblock, error)
}
type TimeblockService interface {
	TimeblockDB
}
type timeblockService struct {
	TimeblockDB
}
type timeblockValidator struct {
	TimeblockDB
}

var _ TimeblockService = &timeblockService{}
var _ TimeblockDB = &timeblockGorm{}
var _ TimeblockDB = &timeblockValidator{}

type timeblockGorm struct {
	db *gorm.DB
}

func NewTimeTimeblockService(db *gorm.DB) TimeblockService {
	ug := &timeblockGorm{db}
	return &timeblockService{
		TimeblockDB: &timeblockValidator{ug},
	}
}
func (tg *timeblockGorm) ByUserID(userID uint) ([]Timeblock, error) {
	var timeblocks []Timeblock
	err := tg.db.Where("user_id=?", userID).Find(&timeblocks).Error
	if err != nil {
		return nil, err
	}
	return timeblocks, nil
}
func (tg *timeblockGorm) ByDateID(DateID string) ([]Timeblock, error) {
	var timeblocks []Timeblock
	err := tg.db.Where("date_id=? ", DateID).Find(&timeblocks).Error
	if err != nil {
		return nil, err
	}
	return timeblocks, nil
}
func (tg *timeblockGorm) ByDateIDandUserID(userID uint, DateID string) ([]Timeblock, int64, error) {
	var timeblocks []Timeblock

	result := tg.db.Where("user_id=? and date_id=?", userID, DateID).Find(&timeblocks)
	err := result.Error

	count := result.RowsAffected
	return timeblocks, count, err
}

func (tg *timeblockGorm) CreateSession(timeblock *Timeblock) error {
	return tg.db.Create(timeblock).Error
}

func (tg *timeblockGorm) FinishSession(timeblock *Timeblock) error {
	timeblock, err := tg.LastUnfinishedSession()
	if err != nil {
		return err
	}
	timeblock.Finished = true
	return tg.db.Save(timeblock).Error
}

func (tg *timeblockGorm) LastUnfinishedSession() (*Timeblock, error) {
	var t Timeblock
	err := tg.db.Last(&t).Error
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func DateIDcheck() (string, error) {
	var dateid time.Time
	var dd string
	timeNowStamp := time.Now()
	t1 := timeNowStamp.Format("15:04:05")
	hr := strings.Split(t1, ":")
	hrINT, err := strconv.Atoi(hr[0])
	if err != nil {
		return "", err
	}
	//if HH is less than 3, count as the previous date
	if hrINT <= 5 {
		dateid = time.Now().Add(-24 * time.Hour)
		dd = dateid.Format("20060102")
	} else {
		dd = timeNowStamp.Format("20060102")
	}
	return dd, nil
}
func (tv *timeblockValidator) CreateSession(timeblock *Timeblock) error {
	err := runTimeblockValFuncs(timeblock,
		tv.userIDRequired,
		// tv.ifDateExist,
	)
	if err != nil {
		return err
	}
	return tv.TimeblockDB.CreateSession(timeblock)
}

func (tv *timeblockValidator) FinishSession(timeblock *Timeblock) error {
	err := runTimeblockValFuncs(timeblock,
		tv.userIDRequired,
		tv.userHasAccessSessionNotFinished,
	)
	if err != nil {
		return err
	}
	return tv.TimeblockDB.FinishSession(timeblock)
}

func (tv *timeblockValidator) userIDRequired(t *Timeblock) error {
	if t.UserID <= 0 {
		return ErrUserIDRequired
	}
	return nil
}
func (tv *timeblockValidator) userHasAccessSessionNotFinished(t *Timeblock) error {
	existing, err := tv.LastUnfinishedSession()
	if err != nil {
		return err
	}
	if existing.UserID != t.UserID {
		return ErrUserHasNoAccess
	}
	if existing.Finished != false {
		return ErrSessionExpired
	}
	return nil
}

// func (tv *timeblockValidator) ifDateExist(t *Timeblock) error {
// 	var dg DateService
// 	date := &Date{
// 		UserID: t.UserID,
// 		DateID: t.DateID,
// 	}
// 	fmt.Println("date:", date)
// 	// _, err := dg.ByDateID(date.DateID)
// 	// switch err {
// 	// case ErrNotFound:
// 	if err := dg.Create(date); err != nil {
// 		fmt.Println("err:", err)
// 	}
// 	// default:
// 	// 	return err
// 	// }

// 	return nil
// }

type timeblockValFunc func(*Timeblock) error

func runTimeblockValFuncs(timeblock *Timeblock, fns ...timeblockValFunc) error {
	for _, fn := range fns {
		if err := fn(timeblock); err != nil {
			return err
		}
	}
	return nil
}
