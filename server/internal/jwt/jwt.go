package jwt

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Package jwt implements JSON Web Tokens
// Based on https://www.sohamkamani.com/golang/jwt-authentication/
// and https://pkg.go.dev/github.com/golang-jwt/jwt/v4#pkg-overview

// claims contains the fields that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type to provide standard fields like expiry time
type claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Create the JWT key used to create the signature
var jwtKey = []byte("WPW_PRIVATE_KEY")

// TODO - make this more secure!
func New(username string) (string, error) {
	fmt.Println("JWT key: ", jwtKey)

	// Create the JWT claims, which includes the username and expiry time
	claims := claims{
		username,
		jwt.RegisteredClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(5 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "WPW",
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)

	return tokenString, err
}

// TODO - make this better
func Validate(req *http.Request) (bool, error) {
	auth := req.Header.Get("Authorization")
	if auth == "" {
		// Maybe return an error?
		return false, nil
	}

	// Create a parser that explicitly checks our expected method
	parser := jwt.NewParser(jwt.WithValidMethods([]string{"HS256"}))
	// Parse the token
	token, err := parser.ParseWithClaims(auth, &claims{}, func(token *jwt.Token) (interface{}, error) {
		// since we only use the one private key to sign the tokens,
		// we also only use its public counter part to verify
		return jwtKey, nil
	})
	if err != nil {
		return false, err
	}

	claims := token.Claims.(*claims)
	fmt.Println(claims.Username)

	return true, nil
}
