package models

import "strings"

const (
	// ErrNotFound is returned when a resource cannot be found
	// in the database.
	ErrNotFound modelError = "models: resource not found"
	// ErrPasswordIncorrect is returned when an invalid password
	// is used when attempting to authenticate a user.
	ErrPasswordIncorrect modelError = "models: incorrect password provided"
	// ErrEmailRequired is returned when an email address is
	// not provided when creating a user
	ErrNameOrCellphoneRequired modelError = "models: Name or Cellphone is required"
	// ErrEmailInvalid is returned when an email address provided
	// does not match any of our requirements
	ErrCellphoneInvalid modelError = "models: cellphone is not valid"
	// ErrNameTaken is returned when an update or create is attempted
	// with an email address that is already in use.
	ErrNameTaken modelError = "models: Name is already taken"
	// ErrPasswordRequired is returned when a create is attempted
	// without a user password provided.
	ErrPasswordRequired modelError = "models: password is required"
	// ErrPasswordTooShort is returned when an update or create is
	// attempted with a user password that is less than 8 characters.
	ErrPasswordTooShort modelError = "models: password must be at least 8 characters long"
	ErrTitleRequired    modelError = "models: title is required"
	ErrDateInvalid      modelError = "models: Date is not valid"
	ErrUserHasNoAccess  modelError = "models: User provided has no Acess "
	ErrSessionExpired   modelError = "models: Session already expired "

	// ErrIDInvalid is returned when an invalid ID is provided
	// to a method like Delete.
	ErrIDInvalid privateError = "models: ID provided was invalid"
	// ErrRememberRequired is returned when a create or update
	// is attempted without a user remember token hash
	ErrRememberRequired privateError = "models: remember token is required"
	// ErrRememberTooShort is returned when a remember token is
	// not at least 32 bytes
	ErrRememberTooShort privateError = "models: remember token must be at least 32 bytes"
	ErrUserIDRequired   privateError = "models: user ID is required"
)

type modelError string

func (e modelError) Error() string {
	return string(e)
}

func (e modelError) Public() string {
	s := strings.Replace(string(e), "models: ", "", 1)
	split := strings.Split(s, " ")
	split[0] = strings.Title(split[0])
	return strings.Join(split, " ")
}

type privateError string

func (e privateError) Error() string {
	return string(e)
}
