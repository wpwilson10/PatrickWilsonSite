package checkout

import (
	"fmt"
	"net/http"
	"os"
	"setup"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
	"github.com/stripe/stripe-go/v74/price"
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
				Price:    stripe.String(os.Getenv("STRIPE_PRICE")),
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

func HandleCheckoutConfig(c *gin.Context) {
	if c.Request.Method != "GET" {
		setup.LogCommon(nil).Error("Request method not GET")
		c.Status(http.StatusMethodNotAllowed)
		return
	}
	// Fetch a price, use it's unit amount and currency
	p, _ := price.Get(
		os.Getenv("STRIPE_PRICE"),
		nil,
	)

	// Send back to client as JSON
	config := struct {
		PublicKey  string `json:"publicKey"`
		UnitAmount int64  `json:"unitAmount"`
		Currency   string `json:"currency"`
	}{
		PublicKey:  os.Getenv("STRIPE_PUBLISHABLE_KEY"),
		UnitAmount: p.UnitAmount,
		Currency:   string(p.Currency),
	}

	c.JSON(http.StatusOK, config)
}
