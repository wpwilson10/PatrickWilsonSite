package contactForm

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"setup"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/ezzarghili/recaptcha-go.v4"
)

type ContactForm struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	PhoneNumber    string `json:"phoneNumber"`
	Message        string `json:"message"`
	Recapthca      string `json:"recaptcha"`
	SubmissionTime time.Time
}

type ContactForms struct {
	ContactForms []ContactForm `json:"contacts"`
}

// SaveContact handles contact form submissions POSTs to the /api/contact route.
// This will validate the POST passes reCAPTCHA then saves the contact to a file and sends an email.
func SaveContact(c *gin.Context) {
	var contact ContactForm

	// Bind JSON form values to struct
	if err := c.ShouldBindJSON(&contact); err != nil {
		setup.LogCommon(err).Error("Contact form bind to JSON")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// verify this is not a bot using reCAPTCHA
	if contact.Recapthca == "" {
		setup.LogCommon(nil).Info("No reCAPTCHA")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing reCAPTCHA token"})
		return
	}
	recaptcha, err := recaptcha.NewReCAPTCHA(os.Getenv("RECAPTCHA_SECRET"), recaptcha.V2, 3*time.Second)
	if err != nil {
		setup.LogCommon(err).Error("Setup NewReCAPTCHA")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	err = recaptcha.Verify(contact.Recapthca)
	if err != nil {
		setup.LogCommon(err).Error("SaveContact reCAPTCHA Verify")
		// Example check error codes array if they exist: (err.(*recaptcha.Error)).ErrorCodes
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// good to save, add time and remove recaptcha token because we don't care
	contact.SubmissionTime = time.Now()
	contact.Recapthca = ""
	saveContact(contact)
	// send email response
	html := setup.ToHTML(os.Getenv("CONTACT_FORM_TEMPLATE"), contact)
	setup.SendEmail("WPW Contact Form Test", html)
	// Successful submission
	c.Status(http.StatusOK)
}

// saveContact writes the a ContactForm to a json file of ContactForms
func saveContact(contact ContactForm) {
	// get existing contacts
	contactList := loadContacts()
	// add new contact
	contactList.ContactForms = append(contactList.ContactForms, contact)

	// turn back into json
	contactsJSON, err := json.Marshal(contactList)
	if err != nil {
		setup.LogCommon(err).Error("JSON Marshalling")
	}

	// save to file
	err = ioutil.WriteFile("./internal/contactForm/contacts.json", contactsJSON, 0644)
	if err != nil {
		setup.LogCommon(err).Error("Write File")
	} else {
		setup.LogCommon(nil).Info("Saved contact form")
	}
}

// loadContacts reads a JSON file of contacts to a ContactForms
func loadContacts() ContactForms {
	// Open our jsonFile
	jsonFile, err := os.Open("./internal/contactForm/contacts.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		setup.LogCommon(err).Error("Open File")
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// read our opened jsonFile as a byte array.
	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		setup.LogCommon(err).Error("Read File")
	}

	var contacts ContactForms
	// map from bytes to struct
	err = json.Unmarshal(byteValue, &contacts)
	if err != nil {
		setup.LogCommon(err).Error("Unmarshall")
	}

	return contacts
}
