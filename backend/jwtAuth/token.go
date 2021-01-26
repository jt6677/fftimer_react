package jwtAuth

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

//JwtService declares in main.go
type JwtService struct {
	SecretKey       []byte
	Issuer          string
	ExpirationHours int64
}

//JwtClaim adds UserName as a claim to the token
type JwtClaim struct {
	jwt.StandardClaims
	UserName string
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAzODQ4MTgsIlVzZXJOYW1lIjoicXdlMTIzIn0.ZtZaAYgavayd5TjAnFG8MTYmbXEVmsr65rvh_WPCkPE
//GenerateToken generate signedToken with userName
func (j *JwtService) GenerateToken(userName string) (string, error) {

	cc := JwtClaim{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
		},
		UserName: userName,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, cc)
	signedToken, err := token.SignedString(j.SecretKey)
	if err != nil {
		return "", fmt.Errorf("couldn't sign token in  GenerateToken %w", err)
	}
	return signedToken, nil
}

//ValidateToken takes a signedToken and return UserName
func (j *JwtService) ValidateToken(signedToken string) (string, error) {
	token, err := jwt.ParseWithClaims(signedToken, &JwtClaim{}, func(token *jwt.Token) (interface{}, error) {
		if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return nil, errors.New("parseWithClaims different algorithms used")
		}
		return j.SecretKey, nil
	})

	if err != nil {
		return "", errors.New("Couldn't parse claims")
	}
	if !token.Valid {
		return "", errors.New("Couldn't parse claims")
	}
	claims, ok := token.Claims.(*JwtClaim)
	if !ok {
		return "", errors.New("Couldn't parse claims")
	}
	if claims.ExpiresAt < time.Now().Local().Unix() {

		return "", errors.New("JWT is expired")
	}

	return claims.UserName, nil
}
