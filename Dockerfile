FROM golang:1.20

WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY ./server/go.mod ./server/go.sum ./
RUN go mod download && go mod verify

# Copy source code
COPY ./server/ ./
# the dist file path should match .env path
COPY ./client/dist/ ./web

RUN go build -v -o main

ENTRYPOINT  ["/app/main"]