package models

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Services struct {
	Session SessionService
	User    UserService
	db      *gorm.DB
}

type ServicesConfig func(*Services) error

func WithGorm(dialect, connectionInfo string) ServicesConfig {
	return func(s *Services) error {
		db, err := gorm.Open(dialect, connectionInfo)
		if err != nil {
			return err
		}

		s.db = db

		s.db.LogMode(true)
		return nil
	}
}

// func WithLogMode(mode bool) ServicesConfig {
// 	return func(s *Services) error {
// 		s.db.LogMode(mode)
// 		return nil
// 	}
// }

func WithUser(pwPepper, hmackey string) ServicesConfig {
	return func(s *Services) error {
		s.User = NewUserService(s.db, pwPepper, hmackey)
		return nil
	}
}

func WithSession() ServicesConfig {
	return func(s *Services) error {
		s.Session = NewSessionService(s.db)
		return nil
	}
}

func NewServices(cfgs ...ServicesConfig) (*Services, error) {
	var s Services
	for _, cfg := range cfgs {
		if err := cfg(&s); err != nil {
			return nil, err
		}
	}
	return &s, nil
}

// Closes the database connection
func (s *Services) Close() error {
	return s.db.Close()
}

// DestructiveReset drops all tables and rebuilds them
func (s *Services) DestructiveReset() error {
	err := s.db.DropTableIfExists(&User{}, &Session{}).Error
	if err != nil {
		return err
	}
	return s.AutoMigrate()
}

// AutoMigrate will attempt to automatically migrate all tables
func (s *Services) AutoMigrate() error {
	return s.db.AutoMigrate(&User{}, &Session{}).Error
}
