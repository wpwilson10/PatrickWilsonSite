package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"

	"checkout"
	"clientError"
	"contactForm"
	"setup"
)

func main() {
	// setup environment configuration
	setup.EnvironmentConfig()

	// Check if app is not already running
	// Don't use RunOnce because then it fight Gin for a port
	if !setup.CheckOnce(3030) {
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
}

func server() {
	// Initialize
	router := gin.Default()
	// https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies
	// https://github.com/gin-gonic/gin/issues/2809
	router.SetTrustedProxies(nil)

	// CORS setup
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"https://patrickwilson.site", "https://patrickwilsonsite.com"}
	router.Use(cors.New(corsConfig))

	// Default GZIP compression
	// Recommended by pingdom site performance test
	// https://blog.hubspot.com/website/gzip-compression
	router.Use(gzip.Gzip(gzip.DefaultCompression))

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
		api.POST("/contact", contactForm.SaveContact)
		api.POST("/checkout", checkout.HandleCreateCheckoutSession)
		api.GET("/checkout_config", checkout.HandleCheckoutConfig)
		api.GET("/products", checkout.HandleProducts)
		api.POST("/error", clientError.SaveClientError)
	}

	setup.LogCommon(nil).Info("PatrickWilsonSite server starting")
	// listen and serve on 0.0.0.0:3030
	err := router.Run(os.Getenv("LOCAL_DOMAIN"))
	if err != nil {
		setup.LogCommon(err).Fatal("Router failed to run")
	}

}
