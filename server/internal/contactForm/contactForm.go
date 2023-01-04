package contactForm

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"setup"
	"time"

	"gopkg.in/ezzarghili/recaptcha-go.v4"

	"jsonHandler"
)

// Types used internally in this handler to (de-)serialize the request and
// response from/to JSON.
type ContactForm struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
	Message     string `json:"message"`
	Recapthca   string `json:"recaptcha"`
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
			setup.LogCommon(err).Error("SaveContact Json Handler")
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
		return
	}

	contact := ContactForm{
		Name:        cf.Name,
		Email:       cf.Email,
		PhoneNumber: cf.Email,
		Message:     cf.Message,
		Recapthca:   cf.Recapthca,
	}

	fmt.Println(contact)

	// verify this is not a bot using reCAPTCHA
	recaptcha, _ := recaptcha.NewReCAPTCHA(os.Getenv("RECAPTCHA_SECRET"), recaptcha.V2, 3*time.Second)
	err = recaptcha.Verify(contact.Recapthca)
	if err != nil {
		setup.LogCommon(err).Info("SaveContact reCAPTCHA Verify")
		// Example check error codes array if they exist: (err.(*recaptcha.Error)).ErrorCodes
	} else {
		// save contact and send email if reCAPTCHA verify is successful
		save(contact)
		jsonHandler.RenderJSON(w, contact)

		// send email response
		html := setup.ToHTML(os.Getenv("CONTACT_FORM_TEMPLATE"), contact)
		setup.SendEmail("WPW Contact Form Test", html)
	}

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
