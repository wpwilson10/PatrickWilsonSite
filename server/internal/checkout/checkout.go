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

type CheckoutConfig struct {
	PublicKey     string `json:"publicKey"`
	UnitAmount    int64  `json:"unitAmount"`
	Currency      string `json:"currency"`
	StripePriceID string `json:"stripePriceID"`
}

// Copied with minor modications from https://github.com/stripe-samples/checkout-one-time-payments/blob/main/server/go/server.go
// and https://stripe.com/docs/checkout/quickstart?lang=go
func HandleCreateCheckoutSession(c *gin.Context) {
	fmt.Println("Checkout")
	// Make this secure
	// redirect to the shop page and not home
	domainURL := "http://" + os.Getenv("DOMAIN") + "/shop"

	// Bind JSON form values to struct
	var cart []Product
	if err := c.ShouldBindJSON(&cart); err != nil {
		setup.LogCommon(err).Error("Checkout form bind to JSON")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var lineItems []*stripe.CheckoutSessionLineItemParams

	// shouldn't send to stripe if nothing received from client
	if len(cart) > 0 {
		for _, p := range cart {
			item := stripe.CheckoutSessionLineItemParams{
				Quantity: stripe.Int64(p.Quantity),
				Price:    stripe.String(p.StripePriceID),
			}
			lineItems = append(lineItems, &item)
		}
	} else {
		setup.LogCommon(nil).Warning("Attempted send empty cart to Stipe")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Received empty cart from client"})
		return
	}

	// Create new Checkout Session for the order
	// set as a query param
	params := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(domainURL + "?success=true"),
		CancelURL:  stripe.String(domainURL + "?canceled=true"),
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems:  lineItems,
		// AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
	}
	s, err := session.New(params)
	if err != nil {
		setup.LogCommon(err).Error("New Session")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Redirect: ", s.URL)
	c.JSON(http.StatusOK, gin.H{"url": s.URL})
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
	config := CheckoutConfig{
		PublicKey:     os.Getenv("STRIPE_PUBLISHABLE_KEY"),
		UnitAmount:    p.UnitAmount,
		Currency:      string(p.Currency),
		StripePriceID: p.ID,
	}

	c.JSON(http.StatusOK, config)
}
