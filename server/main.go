package main

import (
	"log"
	"net/http"
	"note"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"

	"checkout"
	"contactForm"
	"setup"
)

func main() {
	// setup environment configuration
	setup.EnvironmentConfig()

	// get a file for logging
	file := setup.LogFile()
	defer file.Close()
	// setup logger
	setup.Logger(file)
	// This is your test secret API key.
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")

	// run web server
	server()
}

func server() {
	// Initialize
	router := gin.Default()
	// https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies
	router.SetTrustedProxies([]string{"127.0.0.1", "localhost"})

	// Default CORS setup
	router.Use(cors.Default())

	// configuration to SPA applications
	// https://github.com/gin-gonic/contrib/issues/90#issuecomment-990237367
	router.Use(static.Serve("/", static.LocalFile(os.Getenv("CLIENT_FILE_DIRECTORY"), true)))
	// Default route when accessing site. Serves index.html and javascript file
	router.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, "/api") {
			c.File(filepath.Join(os.Getenv("CLIENT_FILE_DIRECTORY"), "index.html"))
			c.Status(http.StatusOK)
		}
		//default 404 page not found
	})

	// Api group
	api := router.Group("/api")
	{
		api.GET("/notes", note.GetNotes)
		api.POST("/contact", contactForm.SaveContact)
		api.POST("/checkout", checkout.HandleCreateCheckoutSession)
		api.GET("/checkout_config", checkout.HandleCheckoutConfig)
		api.GET("/products", checkout.HandleProducts)
	}

	// listen and serve on 0.0.0.0:3030
	log.Fatal(router.Run(os.Getenv("LOCAL_DOMAIN")))
}
