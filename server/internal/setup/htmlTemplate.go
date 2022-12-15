package setup

import (
	"html/template"
	"os"
	"path/filepath"
)

// get and parse html template file
func setupTemplate() *template.Template {
	// get .env filepath
	absPath, err := filepath.Abs("./configs/")
	if err != nil {
		LogCommon(err).Error("Template filepath")
	}
	templatePath := absPath + "/" + os.Getenv("LOG_TEMPLATE_FILE")

	// setup html template
	t, err := template.ParseFiles(templatePath)
	if err != nil {
		LogCommon(err).Error("Template parsing")
	}

	return t
}
