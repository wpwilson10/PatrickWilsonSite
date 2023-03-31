package setup

import (
	"flag"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// EnvironmentConfig loads the .env file for the whole program.
// Differentiates between development vs production modes based on presence of -prd flag or not.
// Use os.Getenv("LABEL_NAME") to access.
func EnvironmentConfig() {
	isPrd := flag.Bool("prd", false, "run app using production settings")
	flag.Parse()

	// get different .env file depending on presence of prd flag
	if *isPrd {
		// get .env variables
		err := godotenv.Load("prd.env")
		if err != nil {
			LogCommon(err).Fatal("Loading .env file")
		}

		return
	}

	// get .env variables for development mode
	err := godotenv.Load("dev.env")
	if err != nil {
		LogCommon(err).Fatal("Loading .env file")
	}

}

// EnvToInt converts the given .env variable into an integer.
func EnvToInt(s string) int {
	// get apps port
	port, err := strconv.Atoi(os.Getenv(s))
	if err != nil {
		LogCommon(err).
			WithField("port", port).
			Fatal("Failed env int conversion")
	}

	return port
}
