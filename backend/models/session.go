package models

import (
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Session struct {
	gorm.Model
	UserID    uint   `gorm:"not_null"`
	DateID    string `gorm:"not_null"`
	StartedAt string `gorm:"not_null"`
}
type SessionDB interface {
	CreateSession(Session *Session) error
	// FinishSession(Session *Session) error
	ByUserID(userID uint) ([]Session, error)
	ByDateID(DateID string) ([]Session, error)
	ByDateIDandUserID(userID uint, DateID string) ([]Session, int64, error)
	// LastUnfinishedSession() (*Session, error)
}
type SessionService interface {
	SessionDB
}
type sessionService struct {
	SessionDB
}
type sessionValidator struct {
	SessionDB
}

var _ SessionService = &sessionService{}
var _ SessionDB = &sessionGorm{}
var _ SessionDB = &sessionValidator{}

type sessionGorm struct {
	db *gorm.DB
}

func NewSessionService(db *gorm.DB) SessionService {
	ug := &sessionGorm{db}
	return &sessionService{
		SessionDB: &sessionValidator{ug},
	}
}
func (sg *sessionGorm) ByUserID(userID uint) ([]Session, error) {
	var sessions []Session
	err := sg.db.Where("user_id=?", userID).Find(&sessions).Error
	if err != nil {
		return nil, err
	}
	return sessions, nil
}
func (sg *sessionGorm) ByDateID(DateID string) ([]Session, error) {
	var sessions []Session
	err := sg.db.Where("date_id=? ", DateID).Find(&sessions).Error
	if err != nil {
		return nil, err
	}
	return sessions, nil
}
func (sg *sessionGorm) ByDateIDandUserID(userID uint, DateID string) ([]Session, int64, error) {
	var sessions []Session

	result := sg.db.Where("user_id=? and date_id=?", userID, DateID).Find(&sessions)
	err := result.Error

	count := result.RowsAffected
	return sessions, count, err
}

func (sg *sessionGorm) CreateSession(session *Session) error {
	return sg.db.Create(session).Error
}

//DateIDGenerate generates dateid for every session,
//can be repeative for same day sessions
//if session started before 5AM, it counts as the previous day
func DateIDGenerate() (string, error) {

	timeNowStamp := time.Now()
	dd := timeNowStamp.Format("20060102")
	
	return dd, nil
}

func (sv *sessionValidator) CreateSession(session *Session) error {
	err := runSessionValFuncs(session,
		sv.userIDRequired,
	)

	if err != nil {
		return err
	}
	return sv.SessionDB.CreateSession(session)
}

func (tv *sessionValidator) userIDRequired(t *Session) error {
	if t.UserID <= 0 {
		return ErrUserIDRequired
	}
	return nil
}

type sessionValFunc func(*Session) error

func runSessionValFuncs(Session *Session, fns ...sessionValFunc) error {
	for _, fn := range fns {
		if err := fn(Session); err != nil {
			return err
		}
	}
	return nil
}
