package notes

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"mime"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
)

// Notes struct which contains an array of notes
type Notes struct {
	Notes []Note `json:"notes"`
}

// Types used internally in this handler to (de-)serialize the request and
// response from/to JSON.
type Note struct {
	Id        int    `json:"id"`
	Content   string `json:"content"`
	Date      string `json:"date"`
	Important bool   `json:"important"`
}

func GetNotes(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Get Notes")
	renderJSON(w, loadNotes())
}

func loadNotes() Notes {
	// Open our jsonFile
	jsonFile, err := os.Open("./internal/notes/notes.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened notes.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// read our opened jsonFile as a byte array.
	byteValue, _ := io.ReadAll(jsonFile)

	// we initialize our Users array
	var notes Notes

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'users' which we defined above
	json.Unmarshal(byteValue, &notes)

	fmt.Println(notes)

	return notes
}

func SaveNote(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Save Note")
	// Enforce a JSON Content-Type.
	contentType := req.Header.Get("Content-Type")
	mediatype, _, err := mime.ParseMediaType(contentType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if mediatype != "application/json" {
		http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
		return
	}

	dec := json.NewDecoder(req.Body)
	dec.DisallowUnknownFields()
	var nt Note
	if err := dec.Decode(&nt); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	notes := loadNotes()

	note := Note{
		Id:        len(notes.Notes) + 1,
		Content:   nt.Content,
		Date:      nt.Date,
		Important: nt.Important,
	}

	notes.Notes = append(notes.Notes, note)
	fmt.Println(notes.Notes)
	saveNotes(notes)
	renderJSON(w, note)
}

func UpdateNote(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Update Note")
	// Enforce a JSON Content-Type.
	contentType := req.Header.Get("Content-Type")
	mediatype, _, err := mime.ParseMediaType(contentType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if mediatype != "application/json" {
		http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
		return
	}

	dec := json.NewDecoder(req.Body)
	dec.DisallowUnknownFields()
	var nt Note
	if err := dec.Decode(&nt); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	vars := mux.Vars(req)
	// string to int
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		// handle error
		fmt.Println(err)
	}

	fmt.Println("ID: ", id, " , ", nt.Id, " Important: ", nt.Important)

	note := Note{
		Id:        id,
		Content:   nt.Content,
		Date:      nt.Date,
		Important: nt.Important,
	}

	fmt.Println("Note: ", note)

	notes := loadNotes()

	// filter function
	// https://github.com/golang/go/wiki/SliceTricks#filtering-without-allocating
	notesOut := notes.Notes[:0]
	for _, n := range notes.Notes {
		if n.Id != id {
			notesOut = append(notesOut, n)
		}
	}
	// add back updated note
	notesOut = append(notesOut, note)

	fmt.Println(notesOut)
	saveNotes(Notes{Notes: notesOut})
	renderJSON(w, note)
}

func saveNotes(notes Notes) {
	fmt.Println("saveNotes")
	notesJSON, err := json.Marshal(notes)
	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("./internal/notes/notes.json", notesJSON, 0644)
	if err != nil {
		fmt.Println(err)
	}
}

// renderJSON renders 'v' as JSON and writes it as a response into w.
func renderJSON(w http.ResponseWriter, v interface{}) {
	js, err := json.Marshal(v)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
