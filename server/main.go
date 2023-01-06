package main

import (
	"contactForm"
	"note"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

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

	// run web server
	server()
}

func server() {
	// Initialize
	router := gin.Default()
	// https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies
	router.SetTrustedProxies([]string{"127.0.0.1", "localhost"})

	//configuration to SAP applications
	// https://github.com/gin-gonic/contrib/issues/90#issuecomment-990237367
	router.Use(static.Serve("/", static.LocalFile(os.Getenv("CLIENT_FILE_DIRECTORY"), true)))
	router.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, "/api") {
			c.File(filepath.Join(os.Getenv("CLIENT_FILE_DIRECTORY"), "index.html"))
		}
		//default 404 page not found
	})

	// Api group
	api := router.Group("/api")
	{
		api.GET("/notes", note.GetNotes)
		api.POST("/contact", contactForm.SaveContact)
	}

	router.Run(":3030") // listen and serve on 0.0.0.0:8080
}
