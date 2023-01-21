package checkout

import (
	"fmt"
	"net/http"
	"os"
	"setup"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
)

// Copied with minor modications from https://github.com/stripe-samples/checkout-one-time-payments/blob/main/server/go/server.go
// and https://stripe.com/docs/checkout/quickstart?lang=go
func HandleCreateCheckoutSession(c *gin.Context) {
	fmt.Println("Checkout")
	domainURL := "https://" + os.Getenv("DOMAIN")

	// Create new Checkout Session for the order
	// set as a query param
	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(domainURL + "?success=true"),
		CancelURL:  stripe.String(domainURL + "?canceled=true"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Quantity: stripe.Int64(1),
				Price:    stripe.String("price_1MSmC5Gg042EnfdjxlDhHGGh"),
			},
		},
		// AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
	}
	s, err := session.New(params)
	if err != nil {
		setup.LogCommon(err).Error("New Session")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Redirect")
	c.Redirect(http.StatusSeeOther, s.URL)
}
