package user

import (
	"errors"
	"fmt"
	"jsonHandler"
	"jwt"
	"log"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

// User contains the application user's details for login and authentication.
// The json tag should match the client side User properties.
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Token    string `json:"token"` // JSON web token
}

type Users struct {
	Users []User
}

func (users *Users) save() {
	err := jsonHandler.SaveToFile("./internal/user/users.json", users)
	if err != nil {
		fmt.Println("Save Users: ", err)
	}
}

func (users *Users) load() {
	err := jsonHandler.LoadFromFile("./internal/user/users.json", users)
	if err != nil {
		fmt.Println("Load Users: ", err)
	}
}

func (users *Users) findUser(username string) User {
	// if we have not initialized users, load from database
	if len(users.Users) <= 0 {
		users.load()
	}

	// find matching user record based on username
	outUser := User{}
	for _, u := range users.Users {
		if strings.Compare(u.Username, username) == 0 {
			outUser = u
		}
	}

	if outUser == (User{}) {
		fmt.Println("No User found mathcing username: ", username)
	}
	return outUser
}

// https://www.sohamkamani.com/golang/password-authentication-and-storage/#overview
func Signup(w http.ResponseWriter, r *http.Request) {
	// Parse and decode the request body into a new `User` instance
	user := &User{}

	err := jsonHandler.DecodeJSONBody(w, r, &user)
	if err != nil {
		var mr *jsonHandler.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// Salt and hash the password using the bcrypt algorithm
	// The second argument is the cost of hashing, which we arbitrarily set as 8 (this value can be more or less, depending on the computing power you wish to utilize)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)

	// Next, insert the username, along with the hashed password into the database
	hashedUser := User{
		Password: string(hashedPassword),
		Username: user.Username,
	}

	users := Users{}
	users.load()
	users.Users = append(users.Users, hashedUser)
	users.save()
	// We reach this point if the credentials we correctly stored in the database, and the default status of 200 is sent back
	jsonHandler.RenderJSON(w, hashedUser)
}

// https://www.sohamkamani.com/golang/password-authentication-and-storage/#overview
func Signin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Sign In start")

	// Parse and decode the request body into a new `User` instance
	user := &User{}
	err := jsonHandler.DecodeJSONBody(w, r, &user)
	if err != nil {
		var mr *jsonHandler.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.Msg, mr.Status)
		} else {
			fmt.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	// Get the existing entry present in the database for the given username
	users := Users{}
	users.load()
	storedUser := users.findUser(user.Username)
	// validate that we got something
	if storedUser == (User{}) {
		// If an entry with the username does not exist, send an "Unauthorized"(401) status
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Compare the stored hashed password, with the hashed version of the password that was received
	if err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password)); err != nil {
		// If the two passwords don't match, return a 401 status
		w.WriteHeader(http.StatusUnauthorized)
	}

	// create a jwt token
	token, err := jwt.New(user.Username)
	if err != nil {
		fmt.Println(err.Error())
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// If we reach this point, that means the users password was correct, and that they are authorized
	returnUser := User{
		Username: user.Username,
		Password: "",
		Token:    token,
	}
	jsonHandler.RenderJSON(w, returnUser)
}
