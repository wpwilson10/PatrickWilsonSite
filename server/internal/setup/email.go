package setup

import (
	"os"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"
)

func SendEmail(subject string, body string) {
	server := mail.NewSMTPClient()

	// SMTP Server
	server.Host = os.Getenv("EMAIL_SERVER_HOST")
	server.Port = EnvToInt("EMAIL_SERVER_PORT")
	server.Username = os.Getenv("EMAIL_USERNAME")
	server.Password = os.Getenv("EMAIL_PASSWORD")
	server.Encryption = mail.EncryptionTLS

	// Variable to keep alive connection
	server.KeepAlive = false
	// Timeout for connect to SMTP Server
	server.ConnectTimeout = 10 * time.Second
	// Timeout for send the data and wait respond
	server.SendTimeout = 10 * time.Second

	// SMTP client
	smtpClient, err := server.Connect()

	if err != nil {
		LogCommon(err).Error("Email failed during setup")
	}

	// New email simple html with inline and CC
	email := mail.NewMSG()
	email.SetFrom(os.Getenv("EMAIL_SENDING_ADDRESS")).
		AddTo(os.Getenv("EMAIL_RECIEVING_ADDRESS")).
		SetSubject(subject)

	email.SetBody(mail.TextHTML, body)

	// library says to check error here
	if email.Error != nil {
		LogCommon(email.Error).Error("Email failed after setup")
	}

	// Call Send and pass the client
	err = email.Send(smtpClient)
	if err != nil {
		LogCommon(err).Error("Email failed to send")
	} else {
		LogCommon(nil).Info("Email sent with subject: " + subject)
	}
}
