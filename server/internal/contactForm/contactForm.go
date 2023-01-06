package contactForm

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"setup"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/ezzarghili/recaptcha-go.v4"
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

func SaveContact(c *gin.Context) {
	fmt.Println("Save Contact Forms")
	var contact ContactForm

	// Bind JSON form values to struct
	if err := c.ShouldBindJSON(&contact); err != nil {
		setup.LogCommon(err).Error("Contact form bind to JSON")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(contact)

	// verify this is not a bot using reCAPTCHA
	recaptcha, _ := recaptcha.NewReCAPTCHA(os.Getenv("RECAPTCHA_SECRET"), recaptcha.V2, 3*time.Second)
	err := recaptcha.Verify(contact.Recapthca)
	if err != nil {
		setup.LogCommon(err).Info("SaveContact reCAPTCHA Verify")
		// Example check error codes array if they exist: (err.(*recaptcha.Error)).ErrorCodes
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	} else {
		// save contact and send email if reCAPTCHA verify is successful
		save(contact)
		// send email response
		html := setup.ToHTML(os.Getenv("CONTACT_FORM_TEMPLATE"), contact)
		setup.SendEmail("WPW Contact Form Test", html)
		// Successful submission
		c.Status(http.StatusOK)
		return
	}
	// Not reachable
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
