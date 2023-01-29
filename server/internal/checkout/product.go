package checkout

import (
	"net/http"
	"setup"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/price"
	"github.com/stripe/stripe-go/v74/product"
)

// Includes both Stripe Product and Price info
type Product struct {
	ProductID     string   `json:"stripeProductID"`
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	Images        []string `json:"images"`
	StripePriceID string   `json:"stripePriceID"`
	UnitAmount    int64    `json:"unitAmount"`
	Currency      string   `json:"currency"`
}

type Products struct {
	Products []Product `json:"products"`
}

func HandleProducts(c *gin.Context) {
	params := &stripe.ProductListParams{Active: stripe.Bool(true)}
	productIter := product.List(params)

	var products Products
	for productIter.Next() {
		p := productIter.Product()

		// Fetch the default price, use it's unit amount and currency
		price, err := price.Get(
			p.DefaultPrice.ID,
			nil,
		)
		if err != nil {
			setup.LogCommon(err).Error("Get Price")
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		product := Product{
			ProductID:     p.ID,
			Name:          p.Name,
			Description:   p.Description,
			Images:        p.Images,
			StripePriceID: price.ID,
			UnitAmount:    price.UnitAmount,
			Currency:      string(price.Currency),
		}
		products.Products = append(products.Products, product)
	}

	// Send back to client as JSON
	c.JSON(http.StatusOK, products)
}
