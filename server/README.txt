How to run
- "go run main.go" for dev/testing
-- uses dev.env
- "go build main.go -prd" for production
-- uses prd.env
- /scripts/run.sh for running from crontab

Access to client files
- In prd mode, serves the files listed in /server/web
- In dev mode, looks to /client/dist

Project structure
- based on: https://github.com/golang-standards/project-layout
- with some addtional context here: https://eli.thegreenplace.net/2019/simple-go-project-layout-with-modules/

TODO 
- Consider better or custom recaptcha library

Notes
- TLS handled by Caddy on the server. Don't need it here 