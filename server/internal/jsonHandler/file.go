package jsonHandler

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
)

func SaveToFile(filepath string, v any) error {
	json, err := json.Marshal(v)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(filepath, json, 0644)
	if err != nil {
		return err
	}

	return nil
}

func LoadFromFile(filepath string, v any) error {
	// Open our jsonFile
	jsonFile, err := os.Open(filepath)
	// if we os.Open returns an error then handle it
	if err != nil {
		return err
	}

	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// read our opened jsonFile as a byte array.
	byteValue, _ := io.ReadAll(jsonFile)

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'notes' which we defined above
	json.Unmarshal(byteValue, &v)

	return nil
}
