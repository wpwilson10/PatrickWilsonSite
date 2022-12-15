package note

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"jwt"
	"log"
	"net/http"
	"os"
	"strconv"

	"jsonHandler"

	"github.com/gorilla/mux"
)

// Types used internally in this handler to (de-)serialize the request and
// response from/to JSON.
type Note struct {
	Id        int    `json:"id"`
	Content   string `json:"content"`
	Date      string `json:"date"`
	Important bool   `json:"important"`
}

// Notes struct which contains an array of notes
type Notes struct {
	Notes []Note `json:"notes"`
}

func GetNotes(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Get Notes")
	jsonHandler.RenderJSON(w, loadNotes())
}

func loadNotes() Notes {
	// Open our jsonFile
	jsonFile, err := os.Open("./internal/note/notes.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened notes.json")
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// read our opened jsonFile as a byte array.
	byteValue, _ := io.ReadAll(jsonFile)

	// we initialize our Notes array
	var notes Notes

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'notes' which we defined above
	json.Unmarshal(byteValue, &notes)

	fmt.Println(notes)

	return notes
}

func SaveNote(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Save Note")
	var nt Note

	check, err := jwt.Validate(req)
	if !check {
		fmt.Println("Failed to validate JWT")
	}
	if err != nil {
		fmt.Println(err)
	}

	err = jsonHandler.DecodeJSONBody(w, req, &nt)
	if err != nil {
		var mr *jsonHandler.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
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
	save(notes)
	jsonHandler.RenderJSON(w, note)
}

func UpdateNote(w http.ResponseWriter, req *http.Request) {
	fmt.Println("Update Note")
	var nt Note

	err := jsonHandler.DecodeJSONBody(w, req, &nt)
	if err != nil {
		var mr *jsonHandler.MalformedRequest
		if errors.As(err, &mr) {
			http.Error(w, mr.Msg, mr.Status)
		} else {
			log.Print(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
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
	save(Notes{Notes: notesOut})
	jsonHandler.RenderJSON(w, note)
}

func save(notes Notes) {
	fmt.Println("saveNotes")
	notesJSON, err := json.Marshal(notes)
	if err != nil {
		fmt.Println(err)
	}

	err = ioutil.WriteFile("./internal/note/notes.json", notesJSON, 0644)
	if err != nil {
		fmt.Println(err)
	}
}
