package models

import (
	"regexp"
	"strings"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/jt6677/ffdtimer/hash"
	"github.com/jt6677/ffdtimer/rand"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	gorm.Model
	Name         string `gorm:"not null; unique_index"`
	Password     string `gorm:"-"`
	PasswordHash string `gorm:"not null"`
	Remember     string `gorm:"-"`
	RememberHash string `gorm:"not null;unique_index"`
	Cellphone    string `gorm:"not null; unique_index"`
}
type UserDB interface {
	// Methods for querying for single users
	ByID(id uint) (*User, error)
	ByCellphone(cellphone string) (*User, error)
	ByName(name string) (*User, error)
	ByRemember(token string) (*User, error)

	// Methods for altering users
	Create(user *User) error
	Update(user *User) error
	Delete(id uint) error
}
type UserService interface {
	Authenticate(name, password string) (*User, error)
	UserDB
}

//making sure userService{} always matches UserService interface... Not abs Needed
var _ UserService = &userService{}

//implmentation of Userservice,can be named to anything
type userService struct {
	pepper string
	UserDB
}

//making sure userGorm{} always matches UserDB interface... Not abs Needed
var _ UserDB = &userGorm{}

type userGorm struct {
	db *gorm.DB
}

//If it is a interface, no need to return a pointer
func NewUserService(db *gorm.DB, pepper string, hmacKey string) UserService {
	ug := &userGorm{db}
	hmac := hash.NewHMAC(hmacKey)
	uv := newUserValidator(ug, hmac, pepper)
	return &userService{
		UserDB: uv,
		pepper: pepper,
	}
}

func (ug *userGorm) Create(user *User) error {
	return ug.db.Create(user).Error
}
func (ug *userGorm) Update(user *User) error {
	return ug.db.Save(user).Error
}
func (ug *userGorm) Delete(id uint) error {
	if id == 0 {
		return ErrIDInvalid
	}
	user := User{Model: gorm.Model{ID: id}}
	return ug.db.Delete(&user).Error
}

//ByID will look up users table with the ID provided
//1- user,nil
//2-nil,ErrorNotFound
//3-nil, otherError
func (ug *userGorm) ByID(id uint) (*User, error) {
	var user User
	db := ug.db.Where("id = ?", id)
	err := first(db, &user)
	return &user, err
}

func (ug *userGorm) ByName(name string) (*User, error) {
	var user User
	db := ug.db.Where("name = ?", name)
	err := first(db, &user)
	return &user, err
}
func (ug *userGorm) ByCellphone(cellphone string) (*User, error) {
	var user User
	db := ug.db.Where("cellphone = ?", cellphone)
	err := first(db, &user)
	return &user, err
}
func (ug *userGorm) ByRemember(rememberHash string) (*User, error) {
	var user User
	err := first(ug.db.Where("remember_hash = ?", rememberHash), &user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (us *userService) Authenticate(name, password string) (*User, error) {

	userfromDB, err := us.ByName(name) // or us.UserDB.ByName(name)
	if err != nil {
		return nil, err
	}
	withPepper := password + us.pepper
	err = bcrypt.CompareHashAndPassword([]byte(userfromDB.PasswordHash), []byte(withPepper))
	if err != nil {
		switch err {
		case bcrypt.ErrMismatchedHashAndPassword:
			return nil, ErrPasswordIncorrect
		default:
			return nil, err
		}
	}

	return userfromDB, nil
}

func first(db *gorm.DB, dst interface{}) error {
	err := db.First(dst).Error
	if err == gorm.ErrRecordNotFound {
		return ErrNotFound
	}
	return err
}

func newUserValidator(udb UserDB, hmac hash.HMAC, pepper string) *userValidator {
	return &userValidator{
		UserDB:         udb,
		hmac:           hmac,
		cellphoneRegex: regexp.MustCompile(`^[1]([3-9])[0-9]{9}$`),
		pepper:         pepper,
	}
}

var _ UserDB = &userValidator{}

type userValidator struct {
	UserDB
	hmac           hash.HMAC
	cellphoneRegex *regexp.Regexp
	pepper         string
}

type userValFunc func(*User) error

func runUserValFuncs(user *User, fns ...userValFunc) error {
	for _, fn := range fns {
		if err := fn(user); err != nil {
			return err
		}
	}
	return nil
}

// ByEmail will normalize the email address before calling
// ByEmail on the UserDB field.
// func (uv *userValidator) ByEmail(email string) (*User, error) {
// 	user := User{
// 		Email: email,
// 	}
// 	if err := runUserValFuncs(&user, uv.normalizeEmail); err != nil {
// 		return nil, err
// 	}
// 	return uv.UserDB.ByEmail(user.Email)
// }

// ByRemember will hash the remember token and then call
// ByRemember on the subsequent UserDB layer.
func (uv *userValidator) ByRemember(token string) (*User, error) {
	user := User{
		Remember: token,
	}
	if err := runUserValFuncs(&user, uv.hmacRemember); err != nil {
		return nil, err
	}
	return uv.UserDB.ByRemember(user.RememberHash)
}

// Create will create the provided user and backfill data
// like the ID, CreatedAt, and UpdatedAt fields.
func (uv *userValidator) Create(user *User) error {
	err := runUserValFuncs(user,
		uv.passwordRequired,
		uv.passwordMinLength,
		uv.bcryptPassword,
		uv.passwordHashRequired,
		uv.setRememberIfUnset,
		uv.rememberMinBytes,
		uv.hmacRemember,
		uv.rememberHashRequired,
		uv.normalizeName,
		uv.requireName,
		uv.nameIsAvail,
		uv.cellphoneCheck,
	)
	if err != nil {
		return err
	}
	return uv.UserDB.Create(user)
}

// Update will hash a remember token if it is provided.
func (uv *userValidator) Update(user *User) error {
	err := runUserValFuncs(user,
		uv.passwordMinLength,
		uv.bcryptPassword,
		uv.passwordHashRequired,
		uv.rememberMinBytes,
		uv.hmacRemember,
		uv.rememberHashRequired,
		uv.normalizeName,
		uv.requireName,
		uv.nameIsAvail,
		uv.cellphoneCheck,
	)
	if err != nil {
		return err
	}
	return uv.UserDB.Update(user)
}

// Delete will delete the user with the provided ID
func (uv *userValidator) Delete(id uint) error {
	var user User
	user.ID = id
	err := runUserValFuncs(&user, uv.idGreaterThan(0))
	if err != nil {
		return err
	}
	return uv.UserDB.Delete(id)
}

// bcryptPassword will hash a user's password with a
// predefined pepper (userPwPepper) and bcrypt if the
// Password field is not the empty string
func (uv *userValidator) bcryptPassword(user *User) error {
	if user.Password == "" {
		return nil
	}
	pwBytes := []byte(user.Password + uv.pepper)
	hashedBytes, err := bcrypt.GenerateFromPassword(pwBytes, bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hashedBytes)
	user.Password = ""
	return nil
}

func (uv *userValidator) hmacRemember(user *User) error {
	if user.Remember == "" {
		return nil
	}
	user.RememberHash = uv.hmac.Hash(user.Remember)
	return nil
}

func (uv *userValidator) setRememberIfUnset(user *User) error {
	if user.Remember != "" {
		return nil
	}
	token, err := rand.RememberToken()
	if err != nil {
		return err
	}
	user.Remember = token
	return nil
}

func (uv *userValidator) rememberMinBytes(user *User) error {
	if user.Remember == "" {
		return nil
	}
	n, err := rand.NBytes(user.Remember)
	if err != nil {
		return err
	}
	if n < 32 {
		return ErrRememberTooShort
	}
	return nil
}

func (uv *userValidator) rememberHashRequired(user *User) error {
	if user.RememberHash == "" {
		return ErrRememberRequired
	}
	return nil
}

func (uv *userValidator) idGreaterThan(n uint) userValFunc {
	return userValFunc(func(user *User) error {
		if user.ID <= n {
			return ErrIDInvalid
		}
		return nil
	})
}

func (uv *userValidator) normalizeName(user *User) error {
	user.Name = strings.ToLower(user.Name)
	user.Name = strings.TrimSpace(user.Name)
	return nil
}

func (uv *userValidator) requireName(user *User) error {
	if user.Name == "" {
		return ErrNameOrCellphoneRequired
	}
	return nil
}

func (uv *userValidator) cellphoneCheck(user *User) error {
	if user.Cellphone == "" {
		return nil
	}
	if !uv.cellphoneRegex.MatchString(user.Cellphone) {
		return ErrCellphoneInvalid
	}
	return nil
}

func (uv *userValidator) nameIsAvail(user *User) error {
	existing, err := uv.ByName(user.Name)
	if err == ErrNotFound {
		// Email address is not taken
		return nil
	}
	if err != nil {
		return err
	}

	// We found a user w/ this email address...
	// If the found user has the same ID as this user, it is
	// an update and this is the same user.
	if user.ID != existing.ID {
		return ErrNameTaken
	}
	return nil
}

func (uv *userValidator) passwordMinLength(user *User) error {
	if user.Password == "" {
		return nil
	}
	if len(user.Password) < 8 {
		return ErrPasswordTooShort
	}
	return nil
}

func (uv *userValidator) passwordRequired(user *User) error {
	if user.Password == "" {
		return ErrPasswordRequired
	}
	return nil
}

func (uv *userValidator) passwordHashRequired(user *User) error {
	if user.PasswordHash == "" {
		return ErrPasswordRequired
	}
	return nil
}
