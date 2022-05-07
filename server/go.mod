module github.com/wpwilson10/goReactTest

go 1.18

replace (
	notes => ./internal/notes
	taskstore => ./internal/taskstore
)

require (
	github.com/gorilla/handlers v1.5.1
	github.com/gorilla/mux v1.8.0
	github.com/rs/cors v1.8.2
	notes v0.0.0-00010101000000-000000000000
)

require github.com/felixge/httpsnoop v1.0.1 // indirect
