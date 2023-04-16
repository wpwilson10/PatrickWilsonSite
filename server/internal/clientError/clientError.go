package clientError

import (
	"encoding/json"
	"net/http"
	"os"
	"setup"
	"time"

	"github.com/gin-gonic/gin"
)

type ClientError struct {
	Name           string `json:"name"`
	Message        string `json:"message"`
	ErrorStack     string `json:"errorStack"`
	ComponentStack string `json:"componentStack"`
	Time           time.Time
}

type ClientErrors struct {
	ClientErrors []ClientError `json:"errors"`
}

// SaveClientError handles errors logged from the client via POSTs to the /api/error route.
func SaveClientError(c *gin.Context) {
	var cliErr ClientError

	// Bind JSON form values to struct
	if err := c.ShouldBindJSON(&cliErr); err != nil {
		setup.LogCommon(err).Error("Client error bind to JSON")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// good to save
	// add time and remove recaptcha token because we don't care
	cliErr.Time = time.Now()
	saveError(cliErr)

	// Successful submission
	c.Status(http.StatusOK)
}

// saveErrors writes the a client Error to a json file of client errors
func saveError(cliErr ClientError) {
	// file path
	prefix := os.Getenv("LOG_FILE_PATH")
	filepath := prefix + os.Getenv("CLIENT_ERROR_FILE_NAME")

	// Open our jsonFile
	jsonFile, err := os.ReadFile(filepath)
	if err != nil {
		setup.LogCommon(err).Error("Open client error file")
	}

	var errors ClientErrors
	// map from bytes to struct
	err = json.Unmarshal(jsonFile, &errors)
	if err != nil {
		setup.LogCommon(err).Error("Unmarshall")
	}

	// add new contact
	errors.ClientErrors = append(errors.ClientErrors, cliErr)

	// turn back into json
	errorsJSON, err := json.Marshal(errors)
	if err != nil {
		setup.LogCommon(err).Error("JSON Marshalling")
	}

	// save to file
	err = os.WriteFile(filepath, errorsJSON, 0664)
	if err != nil {
		setup.LogCommon(err).Error("Write File")
	} else {
		setup.LogCommon(nil).Warn("Saved client error")
	}
}
