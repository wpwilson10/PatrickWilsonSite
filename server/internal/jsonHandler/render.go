package jsonHandler

import (
	"encoding/json"
	"net/http"
)

// renderJSON renders 'v' as JSON and writes it as a response into w.
// https://www.alexedwards.net/blog/golang-response-snippets
func RenderJSON(w http.ResponseWriter, v any) {
	js, err := json.Marshal(v)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
