How to run
- "go run main.go" for dev/testing
-- uses dev.env
- "go build main.go -prd" for production
-- uses prd.env

Project structure
- based on: https://github.com/golang-standards/project-layout
- with some addtional context here: https://eli.thegreenplace.net/2019/simple-go-project-layout-with-modules/

server files
- copied from: https://eli.thegreenplace.net/2021/rest-servers-in-go-part-2-using-a-router-package/
-- with slight modification

TODO 
- add secure connections: https://eli.thegreenplace.net/2021/go-https-servers-with-tls/
- Consider better or customer recaptcha library