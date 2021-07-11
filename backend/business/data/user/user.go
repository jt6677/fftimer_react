// Package user contains user related CRUD functionality.
package user

import (
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/jt6677/fftimer/business/auth"
	"github.com/jt6677/fftimer/foundation/database"
	"github.com/pkg/errors"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/crypto/bcrypt"
)

//Add a pepper to hash generation
var (
	// ErrNotFound is used when a specific User is requested but does not exist.
	ErrNotFound = errors.New("not found")

	// ErrInvalidID occurs when an ID is not in a valid form.
	ErrInvalidID = errors.New("ID is not in its proper form")

	// ErrAuthenticationFailure occurs when a user attempts to authenticate but
	// anything goes wrong.
	ErrAuthenticationFailure = errors.New("authentication failed")

	// ErrForbidden occurs when a user tries to do something that is forbidden to them according to our access control policies.
	ErrForbidden = errors.New("attempted action is not allowed")
)

// User manages the set of API's for user access.
type User struct {
	log *log.Logger
	db  *sqlx.DB
}

// New constructs a User for api access.
func New(log *log.Logger, db *sqlx.DB) User {
	return User{
		log: log,
		db:  db,
	}
}

// Create inserts a new user into the database.
func (u User) Create(ctx context.Context, traceID string, nu NewUser, now time.Time) (Info, error) {
	ctx, span := trace.SpanFromContext(ctx).Tracer().Start(ctx, "internal.data.user.create")
	defer span.End()
	//Should add a pepper
	hash, err := bcrypt.GenerateFromPassword([]byte(nu.Password), bcrypt.DefaultCost)
	if err != nil {
		return Info{}, errors.Wrap(err, "generating password hash")
	}

	usr := Info{
		Name:         nu.Name,
		Email:        nu.Email,
		PasswordHash: hash,
		DateCreated:  now.UTC(),
		DateUpdated:  now.UTC(),
	}

	const q = `INSERT INTO users
		(user_id, name, email, password_hash, date_created, date_updated)
		VALUES ($1, $2, $3, $4, $5, $6)`

	u.log.Printf("%s : %s : query : %s", traceID, "user.Create",
		database.Log(q, usr.ID, usr.Name, usr.Email, usr.PasswordHash, usr.DateCreated, usr.DateUpdated),
	)

	if _, err = u.db.ExecContext(ctx, q, usr.ID, usr.Name, usr.Email, usr.PasswordHash, usr.DateCreated, usr.DateUpdated); err != nil {
		return Info{}, errors.Wrap(err, "inserting user")
	}

	return usr, nil
}

// QueryByEmail gets the specified user from the database by email.
func (u User) QueryByEmail(ctx context.Context, traceID string, email string) (Info, error) {
	ctx, span := trace.SpanFromContext(ctx).Tracer().Start(ctx, "business.data.user.querybyemail")
	defer span.End()

	const q = `SELECT * FROM users WHERE email = $1`

	u.log.Printf("%s : %s : query : %s", traceID, "user.QueryByEmail",
		database.Log(q, email),
	)

	var usr Info
	if err := u.db.GetContext(ctx, &usr, q, email); err != nil {
		if err == sql.ErrNoRows {
			return Info{}, ErrNotFound
		}
		return Info{}, errors.Wrapf(err, "selecting user %q", email)
	}
	return usr, nil
}

// Authenticate finds a user by their email and verifies their password. On
// success it returns a Claims Info representing this user. The claims can be
// used to generate a token for future authentication.
func (u User) Authenticate(ctx context.Context, traceID string, emailorusername, password string) (auth.UserSession, error) {
	ctx, span := trace.SpanFromContext(ctx).Tracer().Start(ctx, "business.data.user.authenticate")
	defer span.End()
	var q string
	if strings.Contains(emailorusername, "@") {
		q = `SELECT * FROM users WHERE email = $1`
	} else {
		q = `SELECT * FROM users WHERE name = $1`
	}
	u.log.Printf("%s : %s : query : %s", traceID, "user.Authenticate",
		database.Log(q, emailorusername),
	)

	var usr Info
	if err := u.db.GetContext(ctx, &usr, q, emailorusername); err != nil {

		// Normally we would return ErrNotFound in this scenario but we do not want
		// to leak to an unauthenticated user which emails are in the system.
		if err == sql.ErrNoRows {
			return auth.UserSession{}, ErrAuthenticationFailure
		}

		return auth.UserSession{}, errors.Wrap(err, "selecting single user")
	}

	// Compare the provided password with the saved hash. Use the bcrypt
	// comparison function so it is cryptographically secure.
	if err := bcrypt.CompareHashAndPassword(usr.PasswordHash, []byte(password)); err != nil {
		return auth.UserSession{}, ErrAuthenticationFailure
	}

	// If we are this far the request is valid. Create some claims for the user
	// and generate their token.
	user := auth.UserSession{
		UserID: usr.ID,
		Name:   usr.Name,
	}

	return user, nil
}
