package contactForm

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"setup"

	"jsonHandler"
)

// Types used internally in this handler to (de-)serialize the request and
// response from/to JSON.
type ContactForm struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
	Message     string `json:"message"`
}

func SaveContact(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Save Contact Forms")
	var cf ContactForm

	err := jsonHandler.DecodeJSONBody(w, req, &cf)
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

	contact := ContactForm{
		FirstName:   cf.FirstName,
		LastName:    cf.LastName,
		Email:       cf.Email,
		PhoneNumber: cf.Email,
		Message:     cf.Message,
	}

	fmt.Println(contact)
	save(contact)
	jsonHandler.RenderJSON(w, contact)

	// send email response
	html := setup.ToHTML(os.Getenv("CONTACT_FORM_TEMPLATE"), contact)
	setup.SendEmail("WPW Contact Form Test", html)
}

func save(contact ContactForm) {
	fmt.Println("save ContactForm")
	contactJSON, err := json.Marshal(contact)
	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("./internal/contactForm/contacts.json", contactJSON, 0644)
	if err != nil {
		fmt.Println(err)
	}
}
