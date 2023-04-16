package setup

import (
	"bytes"
	"html/template"
	"path/filepath"
)

// ToHTML takes an HTML template configuration file and a corresponding struct of values
// to insert into the template. Returns a string of HTML.
// Be careful that the given struct matches the template fields.
func ToHTML(file string, i any) string {
	// get .configs filepath
	absPath, err := filepath.Abs("./configs/")
	if err != nil {
		LogCommon(err).Error("HTML template filepath")
	}
	// point to the given template file
	templatePath := absPath + "/" + file

	// setup html template
	tpl, err := template.ParseFiles(templatePath)
	if err != nil {
		LogCommon(err).Error("HTML template parsing")
	}

	// put struct in to template
	var byt bytes.Buffer
	err = tpl.Execute(&byt, i)
	if err != nil {
		LogCommon(err).Error("HTML template execute")
	}

	// return string of html containing struct values
	return byt.String()
}
