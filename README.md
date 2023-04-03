# WPW
 
How to make docker
- https://stackoverflow.com/questions/23935141/how-to-copy-docker-images-from-one-host-to-another-without-using-a-repository
- https://devopscube.com/build-docker-image/

In Windows Terminal, in this directory 
-docker build -t patrickwilsonsite:1.0 .
-- Make the image using the Dockerfile config
-docker save -o patrickwilsonsite.tar patrickwilsonsite
-- Turns it into a file that can be export to server

On server, in this directory
- sudo docker load -i ./patrickwilsonsite.tar
-- Loads file
- sudo docker run -d -p 3030:3030 -p 587:587 --name patrickwilsonsite patrickwilsonsite:1.0 -prd
-- Runs docker image. Ports should match .env files and caddy

Clean up docker
- sudo docker ps -a
-- Find containers
- sudo docker rm patrickwilsonsite
-- remove old container
- sudo docker image prune
-- remove images from that container

Caddy
- point request from host server to web server application
- handles TLS and http redirection
-- https://caddyserver.com/docs/caddyfile/patterns#reverse-proxy
- TLS Certs come from cloudflare
- sudo systemctl reload caddy
-- to load updates
- sudo vim /etc/caddy/Caddyfile
-- to update config