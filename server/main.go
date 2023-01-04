package main

import (
	"contactForm"
	"fmt"
	"log"
	"net/http"
	"note"
	"os"
	"path/filepath"
	"setup"
	"time"
	"user"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// spaHandler (Single Page Application) implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type spaHandler struct {
	staticPath string
	indexPath  string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h spaHandler) testServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Println("SPA root")
	// file does not exist, serve index.html
	http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	// TODO this does dumb things currently
	// path, err := filepath.Abs(r.URL.Path)
	// 	fmt.Println("1. SPA path:", path)
	//if err != nil {
	// if we failed to get the absolute path respond with a 400 bad request
	// and stop
	//http.Error(w, err.Error(), http.StatusBadRequest)
	//return
	//}
	fmt.Println("0. URL path:", r.URL.Path)

	// prepend the path with the path to the static directory
	path := filepath.Join(h.staticPath, r.URL.Path)
	fmt.Println("2. SPA path:", path)

	// check whether a file exists at the given path
	_, err := os.Stat(path)
	if r.URL.Path == "/" {
		// root call, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if os.IsNotExist(err) {
		// file does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	// setup environment configuration
	setup.EnvironmentConfig()

	// get a file for logging
	file := setup.LogFile()
	defer file.Close()

	// setup logger
	setup.Logger(file)

	// Setup router
	router := mux.NewRouter()
	router.StrictSlash(true)

	router.HandleFunc("/contactForm", contactForm.SaveContact).Methods("POST")
	router.HandleFunc("/notes", note.GetNotes).Methods("GET")
	router.HandleFunc("/notes", note.SaveNote).Methods("POST")
	router.HandleFunc("/notes/{id:[0-9]+}", note.UpdateNote).Methods("PUT")
	router.HandleFunc("/api/login", user.Signin).Methods("POST")

	// otherwise, use http.FileServer to serve the static dir
	// Windows
	clientRootDir := "\\Users\\wpwil\\Documents\\Projects\\Web Dev\\PatrickWilsonSite\\client\\dist"
	clientIndexPath := "\\index.html"
	// Else
	// clientRootDir := "/Users/patrick/Documents/GitHub/PatrickWilsonSite/client/dist"
	// clientIndexPath := "/index.html"

	spa := spaHandler{staticPath: clientRootDir, indexPath: clientIndexPath}
	router.PathPrefix("/").Handler(spa)

	// Set up logging and panic recovery middleware.
	router.Use(func(h http.Handler) http.Handler {
		return handlers.LoggingHandler(os.Stdout, h)
	})
	router.Use(handlers.RecoveryHandler(handlers.PrintRecoveryStack(true)))

	// BAD - do not use in production
	router.Use(cors.AllowAll().Handler)

	srv := &http.Server{
		Handler: router,
		Addr:    "127.0.0.1:3030",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
